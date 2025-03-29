// Backend SOS Online Game const rooms = {};

export default function handler(req, res) { const { roomId, playerName, position, letter } = req.query;

if (!roomId || !playerName || position === undefined || !letter) {
    return res.json({ error: "Permintaan tidak valid" });
}

if (!rooms[roomId]) {
    rooms[roomId] = { players: {}, board: Array(9).fill(''), turn: '' };
}

const room = rooms[roomId];
room.players[playerName] = true;

// Atur giliran pertama
if (!room.turn) {
    room.turn = playerName;
}

if (room.turn !== playerName) {
    return res.json({ error: "Bukan giliranmu!" });
}

if (room.board[position]) {
    return res.json({ error: "Posisi sudah terisi!" });
}

room.board[position] = letter;
room.turn = Object.keys(room.players).find(p => p !== playerName);

const winner = checkWinner(room.board);
if (winner) {
    res.json({ status: "Game selesai", winner });
    delete rooms[roomId];
} else {
    res.json({ board: room.board, turn: room.turn });
}

}

function checkWinner(board) { const sosPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

for (let [a, b, c] of sosPatterns) {
    if (board[a] + board[b] + board[c] === "SOS") {
        return true;
    }
}
return false;

}

