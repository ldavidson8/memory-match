const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

const storedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

document.documentElement.setAttribute("data-theme", storedTheme);

themeIcon.setAttribute(
  "src",
  storedTheme === "dark" ? "./svg/sun.svg" : "./svg/moon.svg"
);

themeToggle.onclick = function () {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const targetTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", targetTheme);
  localStorage.setItem("theme", targetTheme);

  themeIcon.setAttribute(
    "src",
    targetTheme === "dark" ? "./svg/sun.svg" : "./svg/moon.svg"
  );
};

const board = document.querySelector("#board");

const numOfCards = 12;
const cardTypes = ["003", "006", "009", "133", "149", "150"];
const totalTypes = cardTypes.length;

const usedTypes = [];

for (let i = 0; i < numOfCards; i++) {
  const card = document.createElement("div");
  card.classList.add("card");

  let type = null;

  do {
    // Randomly select a data type from the cardTypes array
    const typeIndex = Math.floor(Math.random() * totalTypes);
    type = cardTypes[typeIndex];
  } while (
    usedTypes.includes(type) &&
    usedTypes.filter((x) => x === type).length >= 2
  );

  // Add the data type to the usedTypes array
  usedTypes.push(type);

  // Assign the data type as a custom data attribute on the card
  card.setAttribute("data-type", type);
  card.style.backgroundImage = `url(./images/${type}.png)`;
  board.appendChild(card);
}

let card1;
