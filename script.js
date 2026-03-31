let boxes = document.querySelectorAll(".box");
let statusText = document.getElementById("status");

let popup = document.getElementById("popup");
let winnerText = document.getElementById("winnerText");

let mode = "";
let currentPlayer = "X";
let gameActive = false;

let scoreX = 0;
let scoreO = 0;

let board = ["","","","","","","","",""];

let animationId;

const winPatterns = [
 [0,1,2],[3,4,5],[6,7,8],
 [0,3,6],[1,4,7],[2,5,8],
 [0,4,8],[2,4,6]
];

function setMode(selectedMode) {
    mode = selectedMode;
    resetGame();
    gameActive = true;
    statusText.innerText = (mode === "ai") ? "Your Turn" : "Player X Turn";
}

boxes.forEach(box => {
    box.addEventListener("click", handleClick);
});

function handleClick() {
    let index = this.dataset.index;

    if (board[index] !== "" || !gameActive) return;

    makeMove(index, currentPlayer);

    if (mode === "ai" && gameActive) {
        currentPlayer = "O";
        setTimeout(aiMove, 400);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = "Player " + currentPlayer + " Turn";
    }
}

function makeMove(i, player) {
    board[i] = player;
    boxes[i].innerText = player;
    checkWinner(player);
}

function aiMove() {
    let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    let move = empty[Math.floor(Math.random()*empty.length)];

    makeMove(move, "O");

    currentPlayer = "X";
    statusText.innerText = "Your Turn";
}

function checkWinner(player) {
    for (let pattern of winPatterns) {
        let [a,b,c] = pattern;

        if (board[a]===player && board[b]===player && board[c]===player) {
            gameActive = false;
            showWinner(player);
            updateScore(player);
            return;
        }
    }

    if (!board.includes("")) {
        statusText.innerText = "😐 Draw!";
        gameActive = false;
    }
}

function showWinner(player) {
    let text = (mode === "ai")
        ? (player === "X" ? "🎉 You Win!" : "🤖 AI Wins!")
        : `🎉 Player ${player} Wins!`;

    winnerText.innerText = text;
    popup.style.display = "flex";
    startConfetti();
}

function closePopup() {
    popup.style.display = "none";

    stopConfetti(); // 🔥 full clean

    board = ["","","","","","","","",""];
    boxes.forEach(b => b.innerText = "");

    gameActive = true;
    currentPlayer = "X";

    statusText.innerText = (mode === "ai") ? "Your Turn" : "Player X Turn";
}

function updateScore(player) {
    if (player==="X") {
        scoreX++;
        document.getElementById("scoreX").innerText = scoreX;
    } else {
        scoreO++;
        document.getElementById("scoreO").innerText = scoreO;
    }
}

function resetGame() {
    stopConfetti(); // 🔥 important

    board = ["","","","","","","","",""];
    boxes.forEach(b => b.innerText = "");

    currentPlayer = "X";
    gameActive = false;
    statusText.innerText = "Select Mode";
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
}

/* 🎉 CONFETTI FINAL FIX */
let canvas = document.getElementById("confetti");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pieces = [];

function startConfetti() {
    pieces = [];
    for (let i = 0; i < 100; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 5 + 2,
            speed: Math.random() * 3 + 1
        });
    }
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
        ctx.fillRect(p.x, p.y, p.size, p.size);
        p.y += p.speed;

        if (p.y > canvas.height) p.y = 0;
    });

    if (popup.style.display === "flex") {
        animationId = requestAnimationFrame(animateConfetti);
    }
}

function stopConfetti() {
    cancelAnimationFrame(animationId);

    pieces = []; // 🔥 remove old particles

    canvas.width = window.innerWidth; // 🔥 full reset
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}