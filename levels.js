const LEVELS = [
  /* ========= L1: 4×4 – Ring basics (chắc chắn pass) ========= */
  {
    name: "Level 1 — Ring Basics (4×4)",
    gridSize: 4,
    nodes: [
      { x: 0, y: 0, color: "red" }, { x: 3, y: 0, color: "red" },
      { x: 0, y: 3, color: "yellow" }, { x: 3, y: 3, color: "yellow" },
      { x: 0, y: 1, color: "blue" }, { x: 0, y: 2, color: "blue" },
      { x: 3, y: 1, color: "green" }, { x: 3, y: 2, color: "green" },
    ],
    obstacles: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
    bridges: [],
  },

  /* ========= L2: 4×4 – Offset Corridor ========= */
  {
    name: "Level 2 — Offset Corridor (4×4)",
    gridSize: 4,
    nodes: [
      { x: 0, y: 0, color: "red" }, { x: 3, y: 0, color: "red" },
      { x: 0, y: 3, color: "blue" }, { x: 3, y: 3, color: "blue" },
      { x: 0, y: 1, color: "yellow" }, { x: 1, y: 2, color: "yellow" },
      { x: 3, y: 1, color: "green" }, { x: 2, y: 2, color: "green" },
    ],
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }],
    bridges: [],
  },

  /* ========= L3: 5×5 – Center Block ========= */
  {
    name: "Level 3 — Center Block (5×5)",
    gridSize: 5,
    nodes: [
      { x: 0, y: 0, color: "red" },   { x: 4, y: 4, color: "red" },
      { x: 0, y: 4, color: "blue" },  { x: 4, y: 0, color: "blue" },
      { x: 1, y: 0, color: "yellow" },{ x: 3, y: 4, color: "yellow" },
    ],
    obstacles: [{ x: 2, y: 2 }],
    bridges: [],
  },

  /* ========= L4: 5×5 – First Bridge ========= */
  {
    name: "Level 4 — First Bridge (5×5)",
    gridSize: 5,
    nodes: [
      { x: 0, y: 2, color: "red" },   { x: 4, y: 2, color: "red" },
      { x: 2, y: 0, color: "blue" },  { x: 2, y: 4, color: "blue" },
      { x: 0, y: 0, color: "yellow" },{ x: 4, y: 4, color: "yellow" },
    ],
    obstacles: [],
    bridges: [{ x: 2, y: 2 }],
  },

  /* ========= L5: 6×6 – Bridge & Block ========= */
  {
    name: "Level 5 — Bridge & Block (6×6)",
    gridSize: 6,
    nodes: [
      { x: 0, y: 0, color: "red" },   { x: 5, y: 5, color: "red" },
      { x: 0, y: 5, color: "blue" },  { x: 5, y: 0, color: "blue" },
      { x: 0, y: 3, color: "yellow" },{ x: 5, y: 3, color: "yellow" },
      { x: 1, y: 1, color: "green" }, { x: 4, y: 4, color: "green" },
    ],
    obstacles: [{ x: 2, y: 3 }],
    bridges: [{ x: 3, y: 3 }],
  },
];

export default LEVELS;
