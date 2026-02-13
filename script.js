const board = document.getElementById("gameBoard");
const levelTitle = document.getElementById("levelTitle");
const timerEl = document.getElementById("timer");
const starsEl = document.getElementById("stars");
const bestScoreEl = document.getElementById("bestScore");

let level = 1;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let time = 0;
let timerInterval;

// ===================== THEMES =====================
const themes = [
  { name: "Buah", emojis: ["🍎","🍌","🍇","🍓","🍉","🍍","🥭","🍑"] },
  { name: "Sayur", emojis: ["🥕","🌽","🥦","🍆","🥬","🧄","🧅","🌶️"] },
  { name: "Hewan", emojis: ["🐶","🐱","🐭","🐼","🐸","🦁","🐵","🐰"] }
];

// ===================== LEVEL GENERATOR =====================
function generateLevel(level) {
  const size = Math.min(3 + Math.floor(level / 2), 6);
  const theme = themes[(level - 1) % themes.length];
  const total = size * size;
  const pairs = Math.floor(total / 2);
  const needBlock = total % 2 !== 0;

  let items = [];
  for (let i = 0; i < pairs; i++) {
    const emoji = theme.emojis[i % theme.emojis.length];
    items.push(emoji, emoji);
  }

  if (needBlock) items.push("🪨");

  return {
    title: `Level ${level} - ${theme.name}`,
    size,
    timeLimit: size * size * 4,
    items
  };
}

// ===================== AUDIO =====================
function playSound(type) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = type === "good" ? 600 : 200;
  gain.gain.value = 0.2;

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

// ===================== TIMER =====================
function startTimer(limit) {
  clearInterval(timerInterval);
  time = 0;
  timerEl.textContent = time;
  starsEl.textContent = "⭐⭐⭐";

  timerInterval = setInterval(() => {
    time++;
    timerEl.textContent = time;
    updateStars(limit);

    if (time >= limit) {
      clearInterval(timerInterval);
      alert("⏱️ Waktu habis!");
      restartLevel();
    }
  }, 1000);
}

// ===================== STAR SYSTEM =====================
function updateStars(limit) {
  let stars = "⭐⭐⭐";
  if (time > limit * 0.5) stars = "⭐⭐";
  if (time > limit * 0.8) stars = "⭐";
  starsEl.textContent = stars;
}

// ===================== BEST SCORE =====================
function saveBestScore(level, stars, time) {
  const key = `bestLevel${level}`;
  const old = JSON.parse(localStorage.getItem(key));

  if (!old || stars > old.stars || (stars === old.stars && time < old.time)) {
    localStorage.setItem(key, JSON.stringify({ stars, time }));
  }
}

function getBestScore(level) {
  return JSON.parse(localStorage.getItem(`bestLevel${level}`));
}

// ===================== GAME CORE =====================
function startLevel() {
  board.innerHTML = "";
  matchedPairs = 0;
  firstCard = secondCard = null;
  lockBoard = false;

  const current = generateLevel(level);
  levelTitle.textContent = current.title;

  board.style.gridTemplateColumns = `repeat(${current.size}, 1fr)`;
  board.style.maxWidth =
    window.innerWidth <= 600 ? "95vw" : current.size * 90 + "px";

  startTimer(current.timeLimit);

  const best = getBestScore(level);
  bestScoreEl.textContent = best
    ? `🏆 Best: ${"⭐".repeat(best.stars)} | ⏱️ ${best.time}s`
    : "";

  const cards = [...current.items].sort(() => 0.5 - Math.random());

  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = "?";
    card.dataset.symbol = symbol;

    if (symbol === "🪨") {
      card.classList.add("block");
      card.textContent = "🪨";
      board.appendChild(card);
      return;
    }

    card.onclick = () => {
      if (lockBoard || card.classList.contains("open")) return;

      card.textContent = symbol;
      card.classList.add("open");

      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        lockBoard = true;

        if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
          playSound("good");
          matchedPairs++;
          resetTurn();

          if (matchedPairs === Math.floor(current.items.length / 2)) {
            clearInterval(timerInterval);
            saveBestScore(level, starsEl.textContent.length, time);
            setTimeout(() => {
              level++;
              startLevel();
            }, 800);
          }
        } else {
          playSound("bad");
          setTimeout(() => {
            firstCard.textContent = "?";
            secondCard.textContent = "?";
            firstCard.classList.remove("open");
            secondCard.classList.remove("open");
            resetTurn();
          }, 700);
        }
      }
    };

    board.appendChild(card);
  });
}

function resetTurn() {
  firstCard = secondCard = null;
  lockBoard = false;
}

function restartLevel() {
  clearInterval(timerInterval);
  startLevel();
}

// ===================== START =====================
startLevel();
