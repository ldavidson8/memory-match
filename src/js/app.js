const themeToggle = document.getElementById("theme-toggle");
const currentIconSun = document.querySelector(".current-icon-sun");
const currentIconMoon = document.querySelector(".current-icon-moon");

let currentTheme = localStorage.getItem("theme") || "light";
let isDark = currentTheme === "dark";

// Check user's OS theme preference and set the initial theme accordingly
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  currentTheme = "dark";
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  currentTheme = "light";
}

isDark = currentTheme === "dark";

document.documentElement.setAttribute("data-theme", currentTheme);
currentIconSun.style.display = isDark ? "none" : "block";
currentIconMoon.style.display = isDark ? "block" : "none";
themeToggle.checked = isDark;

themeToggle.addEventListener("input", (e) => {
  const isChecked = e.target.checked;
  currentTheme = isChecked ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);
  document.documentElement.setAttribute("data-theme", currentTheme);
  currentIconSun.style.display = isChecked ? "none" : "block";
  currentIconMoon.style.display = isChecked ? "block" : "none";
});

const board = document.getElementById("board");
const moveCounter = document.getElementById("moves-counter");

const numOfCards = 12;
const cardTypes = ["003", "006", "009", "133", "149", "150"];

let flippedCards = [];

let totalMoves = 0;
updateMovesCounter();

// Shuffle the card types array
shuffleArray(cardTypes);

// Create and add cards to the board
for (let i = 0; i < numOfCards; i++) {
  const type = cardTypes[i % cardTypes.length];
  const card = createCard(type);
  board.appendChild(card);
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
  back.style.backgroundImage = "url(/cardback.jpg";

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

function checkWin() {
  if (document.querySelectorAll(".card.flipped").length === numOfCards) {
    alert("You win!");
  }
}
