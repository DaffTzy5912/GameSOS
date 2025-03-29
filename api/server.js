const rooms = {};

export default function handler(req, res) {
    const { method, query } = req;

    if (method === "GET" && query.action === "create-room") {
        const roomId = Math.random().toString(36).substring(7);
        rooms[roomId] = {
            players: {},
            board: Array(3).fill(null).map(() => Array(3).fill("")), // 3x3 board kosong
            moves: 0,
            result: null
        };
        return res.json({ roomId });
    }

    if (method === "GET" && query.action === "join-room") {
        const { roomId, playerId } = query;
        if (!roomId || !playerId) return res.status(400).json({ error: "Invalid request" });

        if (!rooms[roomId]) return res.status(404).json({ error: "Room not found" });

        rooms[roomId].players[playerId] = true;
        return res.json({ message: "Joined room", roomId });
    }

    if (method === "GET" && query.action === "play") {
        const { roomId, playerId, row, col, letter } = query;
        if (!roomId || !playerId || row === undefined || col === undefined || !letter) {
            return res.status(400).json({ error: "Invalid request" });
        }

        if (!rooms[roomId]) return res.status(404).json({ error: "Room not found" });

        const board = rooms[roomId].board;
        if (board[row][col] !== "") return res.json({ error: "Posisi sudah terisi!" });

        board[row][col] = letter.toUpperCase(); // Simpan huruf

        rooms[roomId].moves++;

        // Cek apakah ada pola "SOS"
        if (checkSOS(board)) {
            rooms[roomId].result = `Pemain ${playerId} menang!`;
        } else if (rooms[roomId].moves === 9) {
            rooms[roomId].result = "Permainan Seri!";
        }

        return res.json({ board, result: rooms[roomId].result || "Lanjut bermain..." });
    }

    if (method === "GET" && query.action === "check-result") {
        const { roomId } = query;
        if (!roomId) return res.status(400).json({ error: "Invalid request" });

        if (!rooms[roomId]) return res.status(404).json({ error: "Room not found" });

        return res.json({ result: rooms[roomId].result || "Lanjut bermain..." });
    }

    return res.status(405).json({ error: "Method not allowed" });
}

// Fungsi untuk mengecek apakah ada pola "SOS" dalam papan permainan
function checkSOS(board) {
    const patterns = [
        // Horizontal
        [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
        // Vertical
        [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
        // Diagonal
        [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]
    ];

    for (let pattern of patterns) {
        const [a, b, c] = pattern;
        if (board[a[0]][a[1]] === "S" && board[b[0]][b[1]] === "O" && board[c[0]][c[1]] === "S") {
            return true;
        }
    }
    return false;
}
