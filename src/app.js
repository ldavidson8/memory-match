const themeToggle = document.getElementById("theme-toggle");
const currentIconSun = document.querySelector(".current-icon-sun");
const currentIconMoon = document.querySelector(".current-icon-moon");

const board = document.getElementById("board");
const moveCounter = document.getElementById("moves-counter");

const numOfCards = 12;
const cardTypes = ["003", "006", "009", "133", "149", "150"];

function setTheme(theme) {
  let isDark = theme === "dark";
  document.documentElement.setAttribute("data-theme", theme);
  currentIconSun.style.display = isDark ? "none" : "block"; // Sun icon if light mode
  currentIconMoon.style.display = isDark ? "block" : "none"; // Moon icon if dark mode
  themeToggle.checked = isDark;
}

function toggleTheme(e) {
  const isChecked = e.target.checked;
  const theme = isChecked ? "dark" : "light";
  localStorage.setItem("theme", theme);
  setTheme(theme);
}

let currentTheme = localStorage.getItem("theme");
if (currentTheme === null) {
  // Check user's preference if current theme has not been set
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    currentTheme = "dark";
  } else {
    currentTheme = "light";
  }
}

setTheme(currentTheme);

themeToggle.addEventListener("input", toggleTheme);

let flippedCards = [];

let totalMoves = 0;
updateMovesCounter();

// Shuffle the card types array
shuffleArray(cardTypes);
addCardsToBoard();

function addCardsToBoard() {
  for (let i = 0; i < numOfCards; i++) {
    const type = cardTypes[i % cardTypes.length];
    const card = createCard(type);
    board.appendChild(card);
  }
}

function removeCardsFromBoard() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
}

function createCard(type) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-type", type);

  const front = document.createElement("div");
  front.classList.add("card-front");
  front.style.backgroundImage = `url(${type}.png)`;

  const back = document.createElement("div");
  back.classList.add("card-back");
  back.style.backgroundImage = `url(cardback.jpg)`;

  card.append(front, back);

  card.addEventListener("click", () => {
    if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
      card.classList.add("flipped");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        const type1 = card1.getAttribute("data-type");
        const type2 = card2.getAttribute("data-type");

        if (type1 === type2) {
          flippedCards = [];
          totalMoves++;
          updateMovesCounter();
        } else {
          totalMoves++;
          updateMovesCounter();
          setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
          }, 2000);
        }
      }
    }
    checkWin();
  });

  return card;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateMovesCounter() {
  moveCounter.textContent = totalMoves;
}

function getBestMoves() {
  const bestMoves = localStorage.getItem("bestMoves");
  return bestMoves !== null ? parseInt(bestMoves) : Infinity;
}

function updateBestMoves(moves) {
  const bestMoves = getBestMoves();
  if (moves < bestMoves) {
    localStorage.setItem("bestMoves", moves);
    return true;
  }
  return false;
}

function resetGame() {
  hideModal();
  removeCardsFromBoard();

  // Reset game variables
  flippedCards.length = 0;
  totalMoves = 0;
  updateMovesCounter();

  // Add new cards to the board
  addCardsToBoard();
}

function checkWin() {
  // Check if all card elements have a flipped class equal to total cards
  if (document.querySelectorAll(".card.flipped").length === numOfCards) {
    showModal();
  }
}

function showModal() {
  // Check if a modal already exists and remove it
  const existingModal = document.querySelector(".modal");
  if (existingModal) {
    existingModal.remove();
  }
  // Get the current total moves and best moves from localStorage
  const currentMoves = totalMoves;
  let bestMoves = localStorage.getItem("bestMoves");

  // Check if the user has never played before or if the current total moves is better than the previous best moves
  let isNewBest = false;
  if (!bestMoves || currentMoves < bestMoves) {
    localStorage.setItem("bestMoves", currentMoves);
    bestMoves = currentMoves;
    isNewBest = true;
  }

  // Create the modal content
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const header = document.createElement("h2");
  header.textContent = "Congratulations!";
  modalContent.appendChild(header);

  const message = document.createElement("p");
  message.textContent = `You completed the game in ${currentMoves} turns!`;
  modalContent.appendChild(message);

  const bestScoreMessage = document.createElement("p");
  bestScoreMessage.textContent = `Your best score is ${bestMoves} turns.`;
  modalContent.appendChild(bestScoreMessage);

  if (isNewBest) {
    const newBestScoreMessage = document.createElement("p");
    newBestScoreMessage.textContent = "Congratulations on your new best score!";
    modalContent.appendChild(newBestScoreMessage);
  }

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.addEventListener("click", resetGame);
  buttonContainer.appendChild(resetButton);

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", function () {
    hideModal();
    removeCardsFromBoard();
    createBoardResetOverlay();
  });

  closeButton.classList.add("close-btn");
  buttonContainer.appendChild(closeButton);

  modalContent.appendChild(buttonContainer);

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
}

function hideModal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "none";
}

function createBoardResetOverlay() {
  const overlay = document.createElement("div");
  overlay.classList.add("board-overlay");

  const resetButton = document.createElement("button");
  resetButton.addEventListener("click", resetGame);

  // SVG string
  const svgString =
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 0 0-8 8 8 8 0 0 0 8 8 7.98 7.98 0 0 0 7.73-6h-2.08A6 6 0 0 1 12 18a6 6 0 0 1-6-6 6 6 0 0 1 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z"/></svg>';

  resetButton.innerHTML = svgString;

  overlay.appendChild(resetButton);
  board.appendChild(overlay);
}
