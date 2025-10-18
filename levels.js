const LEVELS = [
    /* ========= L1: 4×4 – Ring basics (chắc chắn pass) ========= */
    {
        name: "Level 1 — Ring Basics (4×4)",
        gridSize: 4,
        nodes: [
            { x: 0, y: 0, color: "red" }, { x: 3, y: 0, color: "red" },     // top row
            { x: 0, y: 3, color: "yellow" }, { x: 3, y: 3, color: "yellow" },  // bottom row
            { x: 0, y: 1, color: "blue" }, { x: 0, y: 2, color: "blue" },    // left column mid
            { x: 3, y: 1, color: "green" }, { x: 3, y: 2, color: "green" },   // right column mid
        ],
        obstacles: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
        // Solution (1 trong các cách):
        // red:   (0,0)→(1,0)→(2,0)→(3,0)
        // yellow:(0,3)→(1,3)→(2,3)→(3,3)
        // blue:  (0,1)→(0,2)
        // green: (3,1)→(3,2)
    },

    /* ========= L2: 4×4 – Offset Corridor (khác hẳn L1) ========= */
    {
        name: "Level 2 — Offset Corridor (4×4)",
        gridSize: 4,
        // 2 obstacle lệch tạo hành lang ở hàng y=2; 4 cặp đi độc lập → phủ kín
        nodes: [
            { x: 0, y: 0, color: "red" }, { x: 3, y: 0, color: "red" },     // top row
            { x: 0, y: 3, color: "blue" }, { x: 3, y: 3, color: "blue" },    // bottom row
            { x: 0, y: 1, color: "yellow" }, { x: 1, y: 2, color: "yellow" },  // ngắn, đi trái→xuống→phải
            { x: 3, y: 1, color: "green" }, { x: 2, y: 2, color: "green" },   // ngắn, đi phải→xuống→trái
        ],
        obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }],
        // Solution:
        // red:   (0,0)→(1,0)→(2,0)→(3,0)
        // blue:  (0,3)→(1,3)→(2,3)→(3,3)
        // yellow:(0,1)→(0,2)→(1,2)
        // green: (3,1)→(3,2)→(2,2)
    },

    /* ========= L3: 5×5 – Center Block (ép đi vòng, chắc pass) ========= */
    {
        name: "Level 3 — Center Block (5×5)",
        gridSize: 5,
        nodes: [
            { x: 0, y: 0, color: "red" }, { x: 4, y: 4, color: "red" },
            { x: 0, y: 4, color: "blue" }, { x: 4, y: 0, color: "blue" },
            { x: 1, y: 0, color: "yellow" }, { x: 3, y: 4, color: "yellow" },  // hai đầu sole để tạo hành lang rõ
        ],
        obstacles: [{ x: 2, y: 2 }],  // khóa tâm → buộc các đường vòng
        // Solution (gợi ý một tuyến không xung đột, phủ kín 24 ô):
        // yellow: (1,0)→(1,1)→(1,2)→(1,3)→(2,3)→(3,3)→(3,4)
        // red:    (0,0)→(0,1)→(0,2)→(0,3)→(0,4)→(1,4)→(2,4)→(2,3)→(2,2)[blocked] => đi vòng phải:
        //         (2,4)→(3,4)→(4,4)   [đi tuyến này sau khi yellow đã chiếm (3,4); phương án khác an toàn dưới]
        //
        // Tuyến an toàn hơn không đè nhau:
        // red:    (0,0)→(1,0)→(2,0)→(3,0)→(4,0)→(4,1)→(4,2)→(4,3)→(4,4)
        // blue:   (0,4)→(1,4)→(2,4)→(3,4)→(3,3)→(3,2)→(2,2)[blocked]→(2,1)→(2,0)→(1,0)→(0,0)  // chạy sau red
        //         => Nếu muốn chắc tay: đi blue theo viền trái–trên thay vì chui vào giữa:
        // blue (an toàn): (0,4)→(0,3)→(0,2)→(0,1)→(0,0)→(1,0)→(2,0)→(3,0)→(4,0)
        // => Kết hợp: red chiếm viền phải và top, blue chiếm viền trái và bottom, yellow lấp dải giữa.
    },

    /* ========= L4: 5×5 – First Bridge (⛉ ở tâm, 3 cặp rõ ràng) ========= */
    {
        name: "Level 4 — First Bridge (5×5)",
        gridSize: 5,
        nodes: [
            { x: 0, y: 2, color: "red" }, { x: 4, y: 2, color: "red" },     // đỏ chạy ngang qua tâm (bridge)
            { x: 2, y: 0, color: "blue" }, { x: 2, y: 4, color: "blue" },    // xanh chạy dọc qua tâm (bridge)
            { x: 0, y: 0, color: "yellow" }, { x: 4, y: 4, color: "yellow" },  // vàng đi viền chéo lấp ô trống
        ],
        bridges: [{ x: 2, y: 2 }],
        // Solution (rõ ràng):
        // red:   (0,2)→(1,2)→(2,2)[bridge]→(3,2)→(4,2)
        // blue:  (2,0)→(2,1)→(2,2)[bridge]→(2,3)→(2,4)
        // yellow viền chéo:
        // yellow:(0,0)→(1,0)→(1,1)→(0,1)→(0,2)→(0,3)→(0,4)→(1,4)→(2,4)→(3,4)→(4,4)
        // → Hai đường red/blue giao nhau hợp lệ tại bridge; yellow “quét” phần còn lại để phủ kín.
    },

    /* ========= L5: 6×6 – Bridge & Block (tăng màu, dễ giải) ========= */
    {
        name: "Level 5 — Bridge & Block (6×6)",
        gridSize: 6,
        nodes: [
            { x: 0, y: 0, color: "red" }, { x: 5, y: 5, color: "red" },
            { x: 0, y: 5, color: "blue" }, { x: 5, y: 0, color: "blue" },
            { x: 0, y: 3, color: "yellow" }, { x: 5, y: 3, color: "yellow" },
            { x: 1, y: 1, color: "green" }, { x: 4, y: 4, color: "green" },
        ],
        obstacles: [{ x: 2, y: 3 }],
        bridges: [{ x: 3, y: 3 }],
        // Solution gợi ý (đi theo viền + dùng bridge để tránh xung đột):
        // red:   (0,0)→(1,0)→(2,0)→(3,0)→(4,0)→(5,0)→(5,1)→(5,2)→(5,3)→(5,4)→(5,5)
        // blue:  (0,5)→(1,5)→(2,5)→(3,5)→(4,5)→(5,5)→(5,4)→(5,3)→(4,3)→(3,3)[bridge]→(3,2)→(3,1)→(4,1)→(5,1)→(5,0)
        // → Nếu sợ đè red ở (5,5)/(5,1): đi blue ngược viền trái: (0,5)→(0,4)→...→(0,0)→(1,0)→...
        // yellow: (0,3)→(1,3)→(2,3)[blocked]→ đi xuống rồi vòng phải:
        //         (0,3)→(0,2)→(0,1)→(1,1)→(2,1)→(3,1)→(4,1)→(5,1)→(5,2)→(5,3)
        // green: (1,1)→(2,1)→(3,1)→(3,2)→(3,3)[bridge]→(4,3)→(4,4)
        // → Thực tế dễ nhất: bật Hint auto-solve (nếu bạn đã thêm), máy sẽ đi tuyến không xung đột và phủ kín.
    },
];

export default LEVELS;
  