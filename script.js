const API_URL = "https://game-sos.vercel.app/api";
let roomId = null;
let playerSymbol = null;
let isMyTurn = false;

// Buat room baru
async function createRoom() {
    const res = await fetch(`${API_URL}?action=create-room`);
    const data = await res.json();
    roomId = data.roomId;
    playerSymbol = "⭕";
    isMyTurn = true;

    document.getElementById("status").innerText = `Room ID: ${roomId} (Tunggu pemain lain)`;
}

// Gabung ke room yang ada
async function joinRoom() {
    const inputRoomId = document.getElementById("roomIdInput").value;
    if (!inputRoomId) return alert("Masukkan Room ID!");

    const res = await fetch(`${API_URL}?action=join-room&roomId=${inputRoomId}`);
    const data = await res.json();

    if (data.error) {
        alert(data.error);
    } else {
        roomId = data.roomId;
        playerSymbol = data.playerSymbol;
        isMyTurn = playerSymbol === "⭕";
        document.getElementById("status").innerText = `Gabung ke Room ${roomId}. Anda bermain sebagai ${playerSymbol}`;
        checkGameStatus();
    }
}

// Lakukan langkah pada papan permainan
async function makeMove(index) {
    if (!isMyTurn) {
        alert("Bukan giliran Anda!");
        return;
    }

    const res = await fetch(`${API_URL}?action=play&roomId=${roomId}&index=${index}`);
    const data = await res.json();

    if (data.error) {
        alert(data.error);
    } else {
        updateBoard(data.board);
        isMyTurn = data.nextTurn === playerSymbol;
        document.getElementById("status").innerText = isMyTurn ? "Giliran Anda!" : "Menunggu lawan...";
        checkGameStatus();
    }
}

// Update tampilan board berdasarkan data dari server
function updateBoard(board) {
    board.forEach((cell, index) => {
        const cellElement = document.getElementById(`cell-${index}`);
        if (cellElement && !cellElement.textContent) {
            cellElement.textContent = cell || "";
            cellElement.classList.add("taken");
        }
    });
}

// Cek status permainan setiap 3 detik
async function checkGameStatus() {
    if (!roomId) return;

    const res = await fetch(`${API_URL}?action=check-result&roomId=${roomId}`);
    const data = await res.json();

    updateBoard(data.board);
    isMyTurn = data.turn === playerSymbol;
    document.getElementById("status").innerText = isMyTurn ? "Giliran Anda!" : "Menunggu lawan...";

    setTimeout(checkGameStatus, 3000);
}
