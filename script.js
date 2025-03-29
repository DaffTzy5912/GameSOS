const API_URL = "https://game-sos.vercel.app/api";

let roomId = null;
let playerSymbol = null;
let isMyTurn = false;

// Buat room baru
async function createRoom() {
    const res = await fetch(`${API_URL}/create-room`);
    const data = await res.json();
    roomId = data.roomId;
    playerSymbol = "⭕";
    isMyTurn = true;

    document.getElementById("status").innerText = `Room ID: ${roomId} (Menunggu lawan...)`;
}

// Gabung ke room yang ada
async function joinRoom() {
    const inputRoomId = document.getElementById("roomIdInput").value;
    if (!inputRoomId) return alert("Masukkan Room ID!");

    roomId = inputRoomId;
    playerSymbol = "❌";
    isMyTurn = false;

    const res = await fetch(`${API_URL}/join-room?roomId=${roomId}`);
    const data = await res.json();
    
    if (data.error) {
        alert(data.error);
    } else {
        document.getElementById("status").innerText = `Bergabung ke Room ${roomId}. Tunggu giliran Anda!`;
    }
}

// Lakukan langkah pada papan permainan
async function makeMove(index) {
    if (!isMyTurn) {
        alert("Bukan giliran Anda!");
        return;
    }

    const res = await fetch(`${API_URL}/play?roomId=${roomId}&player=${playerSymbol}&index=${index}`);
    const data = await res.json();

    if (data.error) {
        alert(data.error);
    } else {
        updateBoard(data.board);
        isMyTurn = false;
        checkGameStatus();
    }
}

// Update tampilan board berdasarkan data dari server
function updateBoard(board) {
    board.forEach((cell, index) => {
        const cellElement = document.getElementById(`cell-${index}`);
        if (cellElement) {
            cellElement.textContent = cell || "";
            cellElement.classList.add("taken"); // Mencegah perubahan setelah diisi
        }
    });
}

// Cek status permainan setiap 3 detik
async function checkGameStatus() {
    if (!roomId) return;

    const res = await fetch(`${API_URL}/check-result?roomId=${roomId}`);
    const data = await res.json();

    if (data.result) {
        alert(data.result);
        resetGame();
    } else {
        isMyTurn = true;
        document.getElementById("status").innerText = "Giliran Anda!";
    }

    setTimeout(checkGameStatus, 3000);
}

// Reset game setelah selesai
function resetGame() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken");
    });
    document.getElementById("status").innerText = "Game selesai. Mulai lagi!";
}
