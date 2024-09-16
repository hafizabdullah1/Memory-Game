if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/memory-game/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

const cardsArray = [
  { name: "A", id: 1 },
  { name: "B", id: 2 },
  { name: "C", id: 3 },
  { name: "D", id: 4 },
  { name: "E", id: 5 },
  { name: "F", id: 6 },
  { name: "G", id: 7 },
  { name: "H", id: 8 },
];

let cards = [...cardsArray, ...cardsArray];

let flippedCards = [];
let matchedCards = [];
let wrongAttempts = 0;
const maxAttempts = 16;
let score = 0;
let timer;
const gameTime = 60;
let timeLeft;

function startGame() {
  document.getElementById("start-btn").style.display = "none";
  document.getElementById("start-title").style.display = "none";
  document.querySelector("img").style.display = "none";
  document.getElementById("status").classList.remove("hidden");
  createBoard();
  startTimer();
}

function createBoard() {
  cards = shuffle(cards);
  const gameBoard = document.getElementById("game-board");
  gameBoard.style.display = "grid";
  gameBoard.innerHTML = "";
  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;
    cardElement.dataset.name = card.name;
    cardElement.addEventListener("click", flipCard);
    gameBoard.appendChild(cardElement);
  });
}

function flipCard() {
  if (flippedCards.length < 2) {
    this.classList.add("flipped");
    this.innerHTML = this.dataset.name;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      checkForMatch();
    }
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.name === card2.dataset.name) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedCards.push(card1, card2);
  } else {
    wrongAttempts++;
    updateRemainingAttempts();
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.innerHTML = "";
      card2.innerHTML = "";
    }, 1000);
  }
  flippedCards = [];

  if (wrongAttempts >= maxAttempts || matchedCards.length === cards.length) {
    endGame();
  }
}

function updateRemainingAttempts() {
  document.getElementById("remaining-attempts").textContent =
    maxAttempts - wrongAttempts;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  timeLeft = gameTime;
  document.getElementById("time-left").textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time-left").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  const gameBoard = document.getElementById("game-board");
  const endMessage = document.getElementById("end-message");
  const endTitle = document.getElementById("end-title");
  const finalScore = document.getElementById("final-score");

  gameBoard.style.pointerEvents = "none";

  if (matchedCards.length === cards.length) {
    endTitle.textContent = "Congratulations! You won!";
  } else {
    endTitle.textContent = "Game Over!";
  }

  document.getElementById("game-board").style.display = "none";

  score =
    (matchedCards.length / 2) * 10 + timeLeft + (maxAttempts - wrongAttempts);
  finalScore.textContent = score < 0 ? 0 : score;

  gameBoard.innerHTML = "";
  gameBoard.textContent = endTitle.textContent;
  endMessage.classList.remove("hidden");
}

function restartGame() {
  matchedCards = [];
  flippedCards = [];
  wrongAttempts = 0;
  document.getElementById("remaining-attempts").textContent = maxAttempts;
  document.getElementById("time-left").textContent = gameTime;
  document.getElementById("status").classList.add("hidden");
  document.getElementById("start-title").style.display = "block";
  document.getElementById("start-btn").style.display = "inline-block";
  document.getElementById("end-message").classList.add("hidden");
  document.querySelector("img").style.display = "inline-block";
  document.getElementById("game-board").style.pointerEvents = "auto";
}

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", restartGame);
