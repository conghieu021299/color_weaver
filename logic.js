// logic.js — pure game logic utilities (no UI/tailwind)

export const key = (x, y) => `${x},${y}`;
export const isAdj = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;

export function neighborsOf(N, x, y, portalMap) {
  const out = [
    {x:x+1,y}, {x:x-1,y}, {x, y:y+1}, {x, y:y-1},
  ].filter(p => p.x>=0 && p.y>=0 && p.x<N && p.y<N);
  const k = `${x},${y}`;
  const portal = portalMap.get(k);
  if (portal) out.push({ x: portal.x, y: portal.y, viaPortal: true });
  return out;
}

export function mixAfter(cell, color, mixNodes, MIX_RULES) {
  const mn = mixNodes.get(`${cell.x},${cell.y}`);
  if (!mn) return color;
  return MIX_RULES[`${color}+${mn.pigment}`] || color;
}

// ---------- Solver (pure) ----------
export function solvePathForColor({
  color,
  N,
  occupancy,
  obstacles,
  bridges,
  portalMap,
  mixNodes,
  MIX_RULES,
  endpointsByColor,
}) {
  const ends = endpointsByColor[color];
  if (!ends || ends.length < 2) return null;

  const start = ends[0];

  const passable = (x, y, curColor) => {
    const k = `${x},${y}`;
    if (x<0 || y<0 || x>=N || y>=N) return false;
    if (obstacles.has(k)) return false;
    if (bridges.has(k)) return true; // bridge cho phép chồng
    const occ = occupancy[y][x];
    return !occ || occ === curColor;
  };

  const keyState = (x, y, curColor) => `${x},${y},${curColor}`;
  const stack = [{ x: start.x, y: start.y, path: [{x:start.x,y:start.y}], curColor: color }];
  const seen = new Set([keyState(start.x, start.y, color)]);

  while (stack.length) {
    const cur = stack.pop();
    const goalList = endpointsByColor[cur.curColor] || endpointsByColor[color] || [];

    const reached = goalList.some(e => e.x === cur.x && e.y === cur.y) &&
                    !(cur.x === start.x && cur.y === start.y);
    if (reached) return cur.path;

    const ns = neighborsOf(N, cur.x, cur.y, portalMap);
    // heuristic: ưu tiên gần goal hơn
    ns.sort((a,b)=>{
      const ga = Math.min(...goalList.map(g => Math.abs(g.x-a.x)+Math.abs(g.y-a.y)));
      const gb = Math.min(...goalList.map(g => Math.abs(g.x-b.x)+Math.abs(g.y-b.y)));
      return gb - ga; // dùng stack → sort ngược để push tốt nhất sau cùng
    });

    for (const nb of ns) {
      if (!passable(nb.x, nb.y, cur.curColor)) continue;

      const nextColor = mixAfter(nb, cur.curColor, mixNodes, MIX_RULES);
      const kst = keyState(nb.x, nb.y, nextColor);
      if (seen.has(kst)) continue;
      seen.add(kst);

      const nextPath = [...cur.path, {x:nb.x, y:nb.y}];
      stack.push({ x: nb.x, y: nb.y, path: nextPath, curColor: nextColor });
    }
  }
  return null;
}

export function orderColors(endpointsByColor) {
  const list = Object.entries(endpointsByColor).map(([c, [a,b]]) => ({
    color: c, dist: Math.abs(a.x-b.x)+Math.abs(a.y-b.y)
  }));
  return list.sort((a,b)=>a.dist-b.dist).map(i=>i.color);
}

export function applySolutionPaths(pathsMap, N, bridges) {
  const occ = Array.from({length:N},()=>Array.from({length:N},()=>null));
  const bOcc = {};
  for (const [c, path] of Object.entries(pathsMap)) {
    for (const cell of path) {
      const k = `${cell.x},${cell.y}`;
      if (bridges.has(k)) {
        bOcc[k] ??= new Set();
        bOcc[k].add(c);
      } else {
        occ[cell.y][cell.x] = c;
      }
    }
  }
  return { occ, bOcc };
}

// Tổng giải ('all' = toàn level, 'pair' = 1 màu còn thiếu)
export function solveAllColors({
  mode = 'all',
  N, occupancy, obstacles, bridges, portalMap,
  mixNodes, MIX_RULES, endpointsByColor, paths
}) {
  // clone occupancy để solver tham chiếu
  const occ = occupancy.map(r=>r.slice());
  const solution = {};
  const colors = mode === 'pair'
    ? Object.keys(endpointsByColor).filter(c => !paths[c] || paths[c].length < 2).slice(0,1)
    : orderColors(endpointsByColor);

  for (const c of colors) {
    let found = null;
    const cur = paths[c];
    if (cur && cur.length >= 2) {
      found = cur;
    } else {
      found = solvePathForColor({
        color: c, N, occupancy: occ, obstacles, bridges,
        portalMap, mixNodes, MIX_RULES, endpointsByColor
      });
    }

    if (!found) {
      if (mode === 'pair') continue;
      return null; // không có lời giải hoàn chỉnh
    }
    solution[c] = found;

    // ghi tạm vào occ để màu sau né
    for (const cell of found) {
      const k = `${cell.x},${cell.y}`;
      if (bridges.has(k)) continue;
      occ[cell.y][cell.x] = c;
    }
  }

  const { occ: newOcc, bOcc: newB } = applySolutionPaths(solution, N, bridges);
  return { solution, occ: newOcc, bOcc: newB };
}

// Progress & complete (pure)
export function computeProgress(N, obstacles, occupancy, bridgeOcc) {
  let fillable = 0, filled = 0;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const k = key(x,y);
      if (obstacles.has(k)) continue;
      fillable++;
      const occ = occupancy[y][x];
      const b = bridgeOcc[k];
      if (occ || (b && b.size > 0)) filled++;
    }
  }
  return fillable ? Math.round((filled / fillable) * 100) : 0;
}

export function isBoardComplete(N, obstacles, occupancy, bridgeOcc, endpointsByColor, paths) {
  // endpoints nối đủ cặp?
  for (const color of Object.keys(endpointsByColor)) {
    const p = paths[color];
    if (!p || p.length < 2) return false;
    const ends = endpointsByColor[color];
    const startOk = p.some(c => c.x === ends[0].x && c.y === ends[0].y);
    const endOk   = p.some(c => c.x === ends[1].x && c.y === ends[1].y);
    if (!startOk || !endOk) return false;
  }
  // phủ kín
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const k = key(x, y);
      if (obstacles.has(k)) continue;
      const occ = occupancy[y][x];
      const b = bridgeOcc[k];
      if (!occ && !(b && b.size > 0)) return false;
    }
  }
  return true;
}
