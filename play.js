const rooms = {}; // Menyimpan status room

export default function handler(req, res) {
    const { roomId, player, index } = req.query;

    if (!roomId || !player || index === undefined) {
        return res.json({ error: "Invalid request" });
    }

    // Buat room jika belum ada
    if (!rooms[roomId]) {
        rooms[roomId] = {
            board: Array(9).fill(null),
            currentPlayer: "⭕",
            players: []
        };
    }

    const room = rooms[roomId];

    // Tambahkan pemain jika belum ada
    if (!room.players.includes(player) && room.players.length < 2) {
        room.players.push(player);
    }

    // Pastikan kotak belum diisi
    if (room.board[index] !== null) {
        return res.json({ error: "Kotak sudah diisi" });
    }

    // Pastikan pemain bermain secara bergantian
    if (room.players.length === 2 && player !== room.players[room.players.indexOf(room.currentPlayer)]) {
        return res.json({ error: "Bukan giliran Anda" });
    }

    // Simpan tanda (⭕ atau ❌) dalam board
    room.board[index] = room.currentPlayer;

    // Ganti giliran pemain
    room.currentPlayer = room.currentPlayer === "⭕" ? "❌" : "⭕";

    return res.json({ board: room.board, currentPlayer: room.currentPlayer });
}
