const images = {
  "coin": "images/Coin.png",
  "clover": "images/Clover.png",
  "gold": "images/Gold.png",
  "7": "images/7.png",
  "red cat": "images/Red-Cat.png"
};

const symbols = [
  { name: "coin", score: 20, weight: 5 },
  { name: "clover", score: 30, weight: 4 },
  { name: "gold", score: 40, weight: 3 },
  { name: "7", score: 50, weight: 2 },
  { name: "red cat", score: 100, weight: 1 }
];

const symbolHeight = 100; // same as image height
const symbolsPerReel = 5; // before duplicates

let score = 0;
let spins = 0;
let spinning = false;

const spinSound = document.getElementById("spinSound");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const spinCountEl = document.getElementById("spinCount");
const reels = Array.from(document.querySelectorAll(".reel"));

// 🎯 5% chance to win
function shouldWin() {
  return Math.random() < 0.20;
}

function spin() {
  if (spinning) return;
  spinning = true;
  spins++;
  if (spins > 5) spins = 1;

  spinSound.currentTime = 0;
  spinSound.play();

  messageEl.textContent = "";
  let results = [];

  const win = shouldWin();
  const winningSymbol = win ? symbols[Math.floor(Math.random() * symbols.length)] : null;

  // reset reels
  reels.forEach((reel) => {
    reel.style.transition = "none";
    reel.style.transform = "translateY(0)";
  });
  void document.body.offsetWidth; // force reflow

  // spin all reels at same time
  reels.forEach((reel) => {
    reel.style.transition = "transform 1.2s linear";
    reel.style.transform = `translateY(-${symbolHeight * symbolsPerReel * 8}px)`; // multiple full spins
  });

  // stop each reel one by one
  reels.forEach((reel, i) => {
    const stopDelay = 1200 + i * 700; // delay between stops
    setTimeout(() => {
      let finalIndex;

      if (win) {
        // find matching winning symbol
        finalIndex = [...reel.children].findIndex(img => img.alt === winningSymbol.name);
      } else {
        // random stop
        finalIndex = Math.floor(Math.random() * symbolsPerReel);
      }

      results[i] = finalIndex;

      // smooth stop
      reel.style.transition = "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)";
      reel.style.transform = `translateY(-${finalIndex * symbolHeight}px)`;

      // after all reels stop
      if (i === reels.length - 1) {
        setTimeout(() => {
          checkWin(win, winningSymbol, results);
          spinning = false;
        }, 900);
      }
    }, stopDelay);
  });

  spinCountEl.textContent = `Spins: ${spins}/5`;
}

function checkWin(win, winningSymbol, results) {
  const msg = messageEl;
  const allSame = results.every(v => v === results[0]);

  if (win && winningSymbol) {
    score += winningSymbol.score;
    msg.textContent = `🎉 You Win!! (${winningSymbol.name} +${winningSymbol.score})`;
    msg.style.color = "gold";

    // flash glow around reels
    reels.forEach(reel => {
      reel.parentElement.style.boxShadow = "0 0 20px gold";
      setTimeout(() => (reel.parentElement.style.boxShadow = "none"), 1200);
    });
  } else if (allSame) {
    // if they randomly match up
    const matchedSymbol = symbols[results[0]];
    score += matchedSymbol.score;
    msg.textContent = `🎉 Lucky Match!! (${matchedSymbol.name} +${matchedSymbol.score})`;
    msg.style.color = "lime";
  } else {
    msg.textContent = "😢 Better luck next time";
    msg.style.color = "red";
  }

  scoreEl.textContent = `Score: ${score}`;
}
