<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tic Tac Toe Multiplayer</title>
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
      background-color: #333333;
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

    #status {
      margin-top: 15px;
      font-size: 18px;
      font-weight: bold;
    }

    #stats {
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <h1>Tic Tac Toe Multiplayer</h1>
  <div class="controls">
    <label>Pemain 1:
      <select id="player1-symbol">
        <option value="X">X</option>
        <option value="O">O</option>
      </select>
    </label>
    <label>Pemain 2:
      <select id="player2-symbol">
        <option value="O">O</option>
        <option value="X">X</option>
      </select>
    </label>
  </div>
  <div id="stats">
    Pemain 1: <span id="player1-wins">0</span> Menang |
    Pemain 2: <span id="player2-wins">0</span> Menang |
    Seri: <span id="draws">0</span>
  </div>
  <div id="status">Pilih simbol untuk memulai permainan!</div>
  <div id="game-container"></div>
  <button id="reset-btn">Reset Game</button>
  <script>
    let board = [];
    let currentPlayer = "X";
    let boardSize = 3;
    let player1Symbol = "X";
    let player2Symbol = "O";
    let player1Wins = 0;
    let player2Wins = 0;
    let draws = 0;
    let gameActive = true;

    const boardElement = document.getElementById("game-container");
    const statusElement = document.getElementById("status");
    const player1WinsElement = document.getElementById("player1-wins");
    const player2WinsElement = document.getElementById("player2-wins");
    const drawsElement = document.getElementById("draws");

    document.getElementById("player1-symbol").addEventListener("change", updateSymbols);
    document.getElementById("player2-symbol").addEventListener("change", updateSymbols);
    document.getElementById("reset-btn").addEventListener("click", startGame);

    function updateSymbols() {
      player1Symbol = document.getElementById("player1-symbol").value;
      player2Symbol = document.getElementById("player2-symbol").value;
      startGame();
    }

    function startGame() {
      board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
      currentPlayer = player1Symbol;
      gameActive = true;

      boardElement.innerHTML = "";
      boardElement.className = "board";
      boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 60px)`;
      boardElement.style.gridTemplateRows = `repeat(${boardSize}, 60px)`;

      renderBoard();
      statusElement.textContent = "Pemain 1, giliran Anda!";
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

      const winningLine = checkWinner(currentPlayer);
      if (winningLine) {
        drawWinningLine(winningLine, currentPlayer);
        if (currentPlayer === player1Symbol) {
          player1Wins++;
          player1WinsElement.textContent = player1Wins;
          statusElement.textContent = "Pemain 1 Menang!";
        } else {
          player2Wins++;
          player2WinsElement.textContent = player2Wins;
          statusElement.textContent = "Pemain 2 Menang!";
        }
        gameActive = false;
        return;
      }

      if (isDraw()) {
        draws++;
        drawsElement.textContent = draws;
        statusElement.textContent = "Seri!";
        gameActive = false;
        return;
      }

      currentPlayer = currentPlayer === player1Symbol ? player2Symbol : player1Symbol;
      statusElement.textContent = `Giliran ${currentPlayer === player1Symbol ? "Pemain 1" : "Pemain 2"}!`;
    }

    function checkWinner(player) {
      for (let i = 0; i < boardSize; i++) {
        if (board[i].every(cell => cell === player)) return [[i, 0], [i, boardSize - 1]];
        if (board.every(row => row[i] === player)) return [[0, i], [boardSize - 1, i]];
      }
      if (board.every((row, idx) => row[idx] === player)) return [[0, 0], [boardSize - 1, boardSize - 1]];
      if (board.every((row, idx) => row[boardSize - 1 - idx] === player)) return [[0, boardSize - 1], [boardSize - 1, 0]];
      return null;
    }

    function drawWinningLine(line, player) {
      const [start, end] = line;
      const cellSize = 60;
      const startX = start[1] * cellSize + cellSize / 2;
      const startY = start[0] * cellSize + cellSize / 2;
      const endX = end[1] * cellSize + cellSize / 2;
      const endY = end[0] * cellSize + cellSize / 2;

      const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

      const lineElement = document.createElement("div");
      lineElement.classList.add("winning-line");
      lineElement.style.width = `${length}px`;
      lineElement.style.height = "4px";
      lineElement.style.backgroundColor = player === "X" ? "red" : "blue";
      lineElement.style.position = "absolute";
      lineElement.style.transform = `rotate(${angle}deg)`;
      lineElement.style.left = `${startX}px`;
      lineElement.style.top = `${startY}px`;
      lineElement.style.transformOrigin = "0 50%";

      boardElement.appendChild(lineElement);
    }

    function isDraw() {
      return board.flat().every(cell => cell);
    }

    startGame();
  </script>
</body>
</html>
