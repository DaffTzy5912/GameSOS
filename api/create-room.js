import { rooms } from "./server"; // Pastikan ini sesuai dengan struktur proyek

export default function handler(req, res) {
    let roomId = Math.random().toString(36).substring(7);
    
    // Simpan room di server
    rooms[roomId] = { board: Array(9).fill(null), players: [], turn: 0 };
    
    res.json({ roomId });
}
