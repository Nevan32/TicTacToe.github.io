<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tic Tac Toe</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: black;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100vh;
      margin: 0;
    }

    h1 {
      margin-bottom: 10px;
    }

    .controls {
      margin-bottom: 15px;
      display: flex;
      gap: 20px;
    }

    select, button {
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 5px;
      border: 1px solid #444;
      background-color: #333;
      color: white;
      cursor: pointer;
    }

    select:hover, button:hover {
      background-color: #555;
    }

    .board {
      position: relative;
      display: grid;
      gap: 5px;
      margin-bottom: 10px;
    }

    .cell {
      width: 60px;
      height: 60px;
      background-color: #333333; /* Warna abu-abu */
      border: 2px solid black;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
    }

    .cell.taken {
      cursor: not-allowed;
    }

    .symbol-x {
      color: red;
    }

    .symbol-o {
      color: blue;
    }

    .winning-line {
      position: absolute;
      z-index: 10;
    }

    .line-red {
      background-color: red;
      height: 4px;
    }

    .line-blue {
      background-color: blue;
      height: 4px;
    }

    #status {
      margin-top: 15px;
      font-size: 18px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Tic Tac Toe</h1>
  <div class="controls">
    <label>Board Size:
      <select id="board-size">
        <option value="3">3x3</option>
        <option value="4">4x4</option>
      </select>
    </label>
    <label>Difficulty:
      <select id="difficulty">
        <option value="easy">Easy</option>
        <option value="normal">Normal</option>
        <option value="hard">Hard</option>
      </select>
    </label>
  </div>
  <div id="status">Giliran Anda!</div>
  <div id="game-container"></div>
  <button id="reset-btn">Reset Game</button>
   <p>Dibuat Oleh Raya</p>
  <script>
    let board = [];
    let currentPlayer = "X";
    let boardSize = 3;
    let difficulty = "easy";
    let gameActive = true;

    const boardElement = document.getElementById("game-container");
    const statusElement = document.getElementById("status");

    document.getElementById("board-size").addEventListener("change", startGame);
    document.getElementById("difficulty").addEventListener("change", () => {
      difficulty = document.getElementById("difficulty").value;
    });
    document.getElementById("reset-btn").addEventListener("click", startGame);

    function startGame() {
      boardSize = parseInt(document.getElementById("board-size").value);
      difficulty = document.getElementById("difficulty").value;
      board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
      currentPlayer = "X";
      gameActive = true;

      boardElement.innerHTML = "";
      boardElement.className = "board";
      boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 60px)`;
      boardElement.style.gridTemplateRows = `repeat(${boardSize}, 60px)`;

      renderBoard();
      statusElement.textContent = "Giliran Anda!";
    }

    function renderBoard() {
      boardElement.innerHTML = "";

      board.forEach((row, i) => {
        row.forEach((cell, j) => {
          const cellElement = document.createElement("div");
          cellElement.classList.add("cell");
          if (cell) cellElement.classList.add("taken", cell === "X" ? "symbol-x" : "symbol-o");
          cellElement.textContent = cell || "";
          cellElement.onclick = () => makeMove(i, j);
          boardElement.appendChild(cellElement);
        });
      });
    }

    function makeMove(row, col) {
      if (!gameActive || board[row][col]) return;

      board[row][col] = currentPlayer;
      renderBoard();

      if (checkWinner(currentPlayer)) {
        statusElement.textContent = currentPlayer === "X" ? "Anda Menang!" : "Anda Kalah!";
        gameActive = false;
        return;
      }

      if (isDraw()) {
        statusElement.textContent = "Seri!";
        gameActive = false;
        return;
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (currentPlayer === "O") {
        statusElement.textContent = "Giliran AI...";
        setTimeout(aiMove, 700);
      } else {
        statusElement.textContent = "Giliran Anda!";
      }
    }

    function aiMove() {
      if (!gameActive) return;

      let move;
      if (difficulty === "easy") {
        move = getRandomMove();
      } else if (difficulty === "normal") {
        move = getBlockingMove() || getRandomMove();
      } else if (difficulty === "hard") {
        move = getBestMove();
      }

      if (move) {
        const [row, col] = move;
        board[row][col] = "O";
        renderBoard();

        if (checkWinner("O")) {
          statusElement.textContent = "Anda Kalah!";
          gameActive = false;
          return;
        }

        if (isDraw()) {
          statusElement.textContent = "Seri!";
          gameActive = false;
          return;
        }

        currentPlayer = "X";
        statusElement.textContent = "Giliran Anda!";
      }
    }

    function getRandomMove() {
      const emptyCells = [];
      board.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (!cell) emptyCells.push([i, j]);
        });
      });
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function getBlockingMove() {
      return findWinningMove("X");
    }

    function getBestMove() {
      return findWinningMove("O") || getBlockingMove() || getRandomMove();
    }

    function findWinningMove(player) {
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (!board[i][j]) {
            board[i][j] = player;
            if (checkWinner(player)) {
              board[i][j] = null;
              return [i, j];
            }
            board[i][j] = null;
          }
        }
      }
      return null;
    }

    function checkWinner(player) {
      for (let i = 0; i < boardSize; i++) {
        if (board[i].every(cell => cell === player)) {
          drawWinningLine(player, [i, 0], [i, boardSize - 1]);
          return true;
        }
        if (board.every(row => row[i] === player)) {
          drawWinningLine(player, [0, i], [boardSize - 1, i]);
          return true;
        }
      }
      if (board.every((row, idx) => row[idx] === player)) {
        drawWinningLine(player, [0, 0], [boardSize - 1, boardSize - 1]);
        return true;
      }
      if (board.every((row, idx) => row[boardSize - 1 - idx] === player)) {
        drawWinningLine(player, [0, boardSize - 1], [boardSize - 1, 0]);
        return true;
      }
      return false;
    }

    function isDraw() {
      return board.flat().every(cell => cell);
    }

    function drawWinningLine(player, start, end) {
      const line = document.createElement("div");
      line.classList.add("winning-line", player === "X" ? "line-red" : "line-blue");

      const cellSize = 60;
      const startX = start[1] * cellSize + cellSize / 2;
      const startY = start[0] * cellSize + cellSize / 2;
      const endX = end[1] * cellSize + cellSize / 2;
      const endY = end[0] * cellSize + cellSize / 2;

      const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

      line.style.width = `${length}px`;
      line.style.height = "4px";
      line.style.backgroundColor = player === "X" ? "red" : "blue";
      line.style.position = "absolute";
      line.style.transform = `rotate(${angle}deg)`;
      line.style.left = `${startX}px`;
      line.style.top = `${startY}px`;
      line.style.transformOrigin = "0 50%";

      boardElement.appendChild(line);
    }

    startGame();
  </script>
  </body>
</html>
