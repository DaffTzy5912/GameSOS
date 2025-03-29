let games = {}; // Menyimpan status game sementara

export default function handler(req, res) {
    const { method, query } = req;

    if (method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (query.action === "create-room") {
        const roomId = Math.random().toString(36).substring(7);
        games[roomId] = { board: Array(9).fill(null), currentPlayer: "⭕" };
        return res.json({ roomId });
    }

    if (query.action === "join-room") {
        const { roomId } = query;
        if (!games[roomId]) return res.status(404).json({ error: "Room not found" });

        return res.json({ message: "Berhasil bergabung", board: games[roomId].board });
    }

    if (query.action === "make-move") {
        const { roomId, index } = query;
        if (!games[roomId] || games[roomId].board[index] !== null) {
            return res.status(400).json({ error: "Invalid move" });
        }

        games[roomId].board[index] = games[roomId].currentPlayer;
        games[roomId].currentPlayer = games[roomId].currentPlayer === "⭕" ? "❌" : "⭕";

        return res.json({ board: games[roomId].board });
    }

    if (query.action === "reset-game") {
        const { roomId } = query;
        if (!games[roomId]) return res.status(404).json({ error: "Room not found" });

        games[roomId].board = Array(9).fill(null);
        games[roomId].currentPlayer = "⭕";

        return res.json({ message: "Game telah direset" });
    }

    return res.status(400).json({ error: "Invalid request" });
}
