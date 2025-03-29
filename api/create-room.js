export default function handler(req, res) {
    let roomId = Math.random().toString(36).substring(7);
    res.json({ roomId });
}
