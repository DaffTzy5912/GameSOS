const rooms = {};

export default function handler(req, res) {
    const { method, query } = req;

    // Buat room baru
    if (method === "GET" && query.action === "create-room") {
        const roomId = Math.random().toString(36).substring(7);
        rooms[roomId] = { board: Array(9).fill(null), players: [], turn: 0 };
        return res.json({ roomId });
    }

    // Gabung ke room
    if (method === "GET" && query.action === "join-room") {
        const { roomId } = query;
        if (!rooms[roomId]) return res.status(404).json({ error: "Room tidak ditemukan" });

        if (rooms[roomId].players.length >= 2) {
            return res.status(400).json({ error: "Room penuh" });
        }

        const playerSymbol = rooms[roomId].players.length === 0 ? "⭕" : "❌";
        rooms[roomId].players.push(playerSymbol);

        return res.json({ roomId, playerSymbol });
    }

    // Pemain melakukan langkah
    if (method === "GET" && query.action === "play") {
        const { roomId, index } = query;
        if (!rooms[roomId]) return res.status(404).json({ error: "Room tidak ditemukan" });

        const { board, players, turn } = rooms[roomId];
        if (!players.length) return res.status(400).json({ error: "Belum ada pemain" });

        if (board[index] !== null) return res.status(400).json({ error: "Kotak sudah diisi" });

        board[index] = players[turn]; // Masukkan simbol ke papan
        rooms[roomId].turn = turn === 0 ? 1 : 0; // Ganti giliran pemain

        return res.json({ board, nextTurn: rooms[roomId].players[rooms[roomId].turn] });
    }

    // Cek status permainan
    if (method === "GET" && query.action === "check-result") {
        const { roomId } = query;
        if (!rooms[roomId]) return res.status(404).json({ error: "Room tidak ditemukan" });

        return res.json({ board: rooms[roomId].board, turn: rooms[roomId].players[rooms[roomId].turn] });
    }

    return res.status(405).json({ error: "Method not allowed" });
}
