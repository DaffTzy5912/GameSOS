const rooms = {};

export default function handler(req, res) {
    const { roomId, player, choice } = req.query;

    if (!roomId || !player || !choice) {
        return res.json({ error: "Invalid request" });
    }

    // Cek apakah pilihan valid
    const choices = ["rock", "paper", "scissors"];
    if (!choices.includes(choice)) {
        return res.json({ error: "Pilihan tidak valid" });
    }

    // Simpan pilihan pemain dalam room
    if (!rooms[roomId]) {
        rooms[roomId] = {};
    }
    rooms[roomId][player] = choice;

    console.log(`Room ${roomId}:`, rooms[roomId]); // Debugging log

    // Cek apakah dua pemain sudah memilih
    const players = Object.keys(rooms[roomId]);
    if (players.length < 2) {
        return res.json({ status: "Menunggu pemain lain..." });
    }

    // Ambil pilihan kedua pemain
    const [player1, player2] = players;
    const choice1 = rooms[roomId][player1];
    const choice2 = rooms[roomId][player2];

    console.log(`Player1 (${player1}): ${choice1}, Player2 (${player2}): ${choice2}`); // Debugging log

    // Tentukan pemenang
    let result = "";
    if (choice1 === choice2) {
        result = "Seri!";
    } else if (
        (choice1 === "rock" && choice2 === "scissors") ||
        (choice1 === "scissors" && choice2 === "paper") ||
        (choice1 === "paper" && choice2 === "rock")
    ) {
        result = `${player1} menang!`;
    } else {
        result = `${player2} menang!`;
    }

    // Simpan hasil agar bisa dicek
    rooms[roomId].result = result;

    res.json({ result });
}
