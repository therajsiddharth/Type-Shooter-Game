const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const nextLevelBtn = document.getElementById("nextLevelBtn");

canvas.width = innerWidth;
canvas.height = innerHeight;

// ================== ASSET CONFIGURATION ==================
const ASSET_PATH = "assets/";
const ASSETS = {
  images: {
    background: `${ASSET_PATH}Background.png`,
    rocket: `${ASSET_PATH}rocket.png`,
  },
  powerups: {
    laser: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect fill='%23a855f7' x='4' y='12' width='24' height='8' rx='2'/%3E%3Ccircle fill='%23e879f9' cx='16' cy='16' r='3'/%3E%3C/svg%3E",
    bomb: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle fill='%23111' cx='16' cy='16' r='10'/%3E%3Ccircle fill='%23333' cx='16' cy='16' r='8'/%3E%3Crect fill='%23666' x='14' y='4' width='4' height='4'/%3E%3C/svg%3E",
    shield: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%2338bdf8' d='M16 2 L25 7 L25 16 Q25 25 16 28 Q7 25 7 16 L7 7 Z'/%3E%3C/svg%3E",
    blast: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpolygon fill='%23fbbf24' points='16,2 24,12 20,20 12,20 8,12'/%3E%3Ccircle fill='%23f59e0b' cx='16' cy='16' r='4'/%3E%3C/svg%3E",
    life: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23ef4444' d='M16 26 L4 14 Q2 12 2 9 Q2 4 7 4 Q11 4 16 8 Q21 4 25 4 Q30 4 30 9 Q30 12 28 14 Z'/%3E%3C/svg%3E",
  },
};

// ================== GAME DATA ==================
const WORD_SETS = {
  level1: ["cat", "dog", "sun", "hat", "run", "pen", "bug", "fox"],
  level2: ["star", "moon", "fire", "wind", "tree", "rain", "snow"],
  level3: ["enemy", "laser", "power", "shield", "boost", "rocket"],
  level4: ["danger", "weapon", "combat", "strike", "attack", "defend"],
  level5: ["strategy", "precision", "eliminate", "explosive"],
  level6: ["synchronize", "destruction", "obliterate", "annihilation"],
};

const BOSS_WORDS = {
  level1: "initiate combat protocol",
  level2: "defeat the guardian",
  level3: "destroy the iron core",
  level4: "annihilate the war machine",
  level5: "eliminate the final protocol",
  level6: "exterminate all resistance",
};

// ================== POWERUP IMAGES ==================
const powerupImages = {
  laser: new Image(),
  bomb: new Image(),
  shield: new Image(),
  blast: new Image(),
  life: new Image(),
};

// Try to load PNG assets first, fallback to SVG if not available
powerupImages.laser.onload = () => { };
powerupImages.laser.onerror = () => {
  powerupImages.laser.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect fill='%23a855f7' x='4' y='12' width='24' height='8' rx='2'/%3E%3Ccircle fill='%23e879f9' cx='16' cy='16' r='3'/%3E%3C/svg%3E";
};
powerupImages.laser.src = "assets/Laser.png";

powerupImages.bomb.onerror = () => {
  powerupImages.bomb.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle fill='%23111' cx='16' cy='16' r='10'/%3E%3Ccircle fill='%23333' cx='16' cy='16' r='8'/%3E%3Crect fill='%23666' x='14' y='4' width='4' height='4'/%3E%3C/svg%3E";
};
powerupImages.bomb.src = "assets/Bomb.png";

powerupImages.shield.onerror = () => {
  powerupImages.shield.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%2338bdf8' d='M16 2 L25 7 L25 16 Q25 25 16 28 Q7 25 7 16 L7 7 Z'/%3E%3C/svg%3E";
};
powerupImages.shield.src = "assets/Shield.png";

powerupImages.blast.onerror = () => {
  powerupImages.blast.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpolygon fill='%23fbbf24' points='16,2 24,12 20,20 12,20 8,12'/%3E%3Ccircle fill='%23f59e0b' cx='16' cy='16' r='4'/%3E%3C/svg%3E";
};
powerupImages.blast.src = "assets/Blast.png";

powerupImages.life.onerror = () => {
  powerupImages.life.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23ef4444' d='M16 26 L4 14 Q2 12 2 9 Q2 4 7 4 Q11 4 16 8 Q21 4 25 4 Q30 4 30 9 Q30 12 28 14 Z'/%3E%3C/svg%3E";
};
powerupImages.life.src = "assets/Life.png";

// ================== BACKGROUND & ROCKET IMAGES ==================
const backgroundImage = new Image();
backgroundImage.src = ASSETS.images.background;

const rocketImage = new Image();
rocketImage.src = ASSETS.images.rocket;

const rocket = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  angle: 0,
};

// ================== STARFIELD ==================
const stars = Array.from({ length: 150 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 2 + 0.5,
  speed: Math.random() * 20 + 10,
}));

function registerKill(enemy) {
  if (enemy.isPowerup || enemy.isBoss) return;

  killsThisLevel++;
}


function getKillsToNextLevel(level) {
  return Math.min(4 + level * 2, 14);
}

function getWordsForLevel(level) {
  const key = `level${Math.min(level, 6)}`;
  return WORD_SETS[key] || WORD_SETS.level6;
}

function getBossWordForLevel(level) {
  return BOSS_WORDS[`level${level}`] || "superboss";
}

let enemies = [];
let activeEnemy = null;
let explosions = [];
let lasers = [];
let powerupDrops = [];

let score = 0;
let health = 3;
let lives = 3;

let levelPopup = {
  active: false,
  text: "",
  timer: 0,
};

// ================== POWER-UPS ==================
let powerups = {
  laser: 0,
  bomb: 0,
  shield: 0,
  blast: 0,
};

let shieldActive = false;
let shieldTimer = 0;

// ================== LEVEL SYSTEM ==================
let level = 1;
let killsThisLevel = 0;
let killsToNextLevel = 12;

// ================== WPM-BASED PACING ==================
const BASE_WPM = 10;
const WPM_STEP = 10;

function getWPM(level) {
  return BASE_WPM + (level - 1) * WPM_STEP;
}

function wpmToSpeed(wpm) {
  return 90 + wpm * 4;
}

// ================== COMBO ==================
let combo = 0;
let comboTimer = 0;

// ================== BOSS ==================
let bossActive = false;

// ================== STATE ==================
let gameOver = false;
let paused = false;

// ================== SCREEN SHAKE ==================
let shakeTime = 0;
let shakeIntensity = 0;

// ================== SPAWN ==================
let spawnTimer = 0;
let powerupTimer = 0;

// ================== ENEMY ==================
class Enemy {
  constructor(word, isPowerup = false) {
    this.word = word;
    this.progress = 0;
    this.isPowerup = isPowerup;
    this.x = Math.random() * (canvas.width - 200) + 100;
    this.y = -30;

    const wpm = getWPM(level);
    this.speed = wpmToSpeed(wpm) + Math.random() * 6;
  }

  update(dt) {
    this.y += this.speed * dt;
  }

  draw(active) {
    ctx.font = active ? "28px Arial" : "26px Arial";
    ctx.textAlign = "left";

    const typed = this.word.slice(0, this.progress);
    const rest = this.word.slice(this.progress);

    const typedWidth = ctx.measureText(typed).width;
    const restWidth = ctx.measureText(rest).width;
    const totalWidth = typedWidth + restWidth;
    const height = 32;

    if (active) {
      ctx.fillStyle = "rgba(34, 197, 94, 0.15)";
      ctx.fillRect(this.x - 6, this.y - height + 6, totalWidth + 12, height);

      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x - 6, this.y - height + 6, totalWidth + 12, height);
    }

    ctx.fillStyle = "#22c55e";
    ctx.fillText(typed, this.x, this.y);

    ctx.fillStyle = active
      ? "#facc15"
      : this.word.length >= 8
        ? "#fb7185"
        : "#f87171";

    ctx.fillText(rest, this.x + typedWidth, this.y);
  }
}

// ================== BOSS ==================
class Boss extends Enemy {
  constructor(sentence) {
    super(sentence);
    this.words = sentence.split(" ");
    this.currentWord = 0;
    this.progress = 0;
    this.speed *= 0.4;
    this.isBoss = true;
  }

  update(dt) {
    const STOP_Y = 120;
    if (this.y < STOP_Y) {
      this.y += this.speed * dt;
    }
  }

  draw(active) {
    ctx.font = active ? "32px Arial" : "30px Arial";
    ctx.textAlign = "left";

    const beforeWords = this.words.slice(0, this.currentWord).join(" ");
    const activeWord = this.words[this.currentWord] || "";
    const afterWords = this.words.slice(this.currentWord + 1).join(" ");

    const typed = activeWord.slice(0, this.progress);
    const rest = activeWord.slice(this.progress);

    // Build full sentence parts
    const partBefore = beforeWords ? beforeWords + " " : "";
    const partActiveTyped = typed;
    const partActiveRest = rest;
    const partAfter = afterWords ? " " + afterWords : "";

    // Measure total width
    const totalText = partBefore + partActiveTyped + partActiveRest + partAfter;

    const totalWidth = ctx.measureText(totalText).width;
    const height = 42;

    // Background
    ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
    ctx.fillRect(this.x - 10, this.y - height + 10, totalWidth + 20, height);

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x - 10, this.y - height + 10, totalWidth + 20, height);

    let drawX = this.x;

    // 🟢 Completed words
    if (partBefore) {
      ctx.fillStyle = "#22c55e";
      ctx.fillText(partBefore, drawX, this.y);
      drawX += ctx.measureText(partBefore).width;
    }

    // 🟢 Typed letters of current word
    ctx.fillStyle = "#22c55e";
    ctx.fillText(partActiveTyped, drawX, this.y);
    drawX += ctx.measureText(partActiveTyped).width;

    // 🟡 Remaining letters of current word
    ctx.fillStyle = active ? "#fbbf24" : "#ef4444";
    ctx.fillText(partActiveRest, drawX, this.y);
    drawX += ctx.measureText(partActiveRest).width;

    // 🔴 Future words
    if (partAfter) {
      ctx.fillStyle = "#ef4444";
      ctx.fillText(partAfter, drawX, this.y);
    }

    // ✅ BOSS PROGRESS BAR (green bar showing words completed)
    if (this.words.length > 0) {
      ctx.fillStyle = "#22c55e";
      const progressWidth = Math.max(0, Math.min((this.currentWord / this.words.length) * (totalWidth + 20), totalWidth + 20));
      ctx.fillRect(
        this.x - 10,
        this.y + 18,
        progressWidth,
        4
      );
    }
  }
}
// ================== EXPLOSION ==================
class Explosion {
  constructor(x, y, isBoss = false) {
    this.x = x;
    this.y = y;
    this.radius = isBoss ? 10 : 5;
    this.life = isBoss ? 0.5 : 0.3;
    this.isBoss = isBoss;
  }
  update(dt) {
    this.radius += (this.isBoss ? 300 : 200) * dt;
    this.life -= dt;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.isBoss ? "#ef4444" : "orange";
    ctx.lineWidth = this.isBoss ? 5 : 3;
    ctx.stroke();
  }
}

// ================== POWERUP DROP ==================
class Powerup {
  constructor(type) {
    this.type = type; // "laser", "bomb", "shield", "blast", "life"
    this.x = Math.random() * (canvas.width - 60) + 30;
    this.y = -30;
    this.speed = 260 + Math.random() * 120; // Fast drop
    this.size = 64;
    this.collected = false;
  }

  update(dt) {
    this.y += this.speed * dt;
  }

  draw() {
    const img = powerupImages[this.type];
    if (img && img.complete) {
      ctx.drawImage(
        img,
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    } else {
      // Fallback circle while loading
      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  collect() {
    if (this.collected) return;
    this.collected = true;

    switch (this.type) {
      case "laser":
        powerups.laser++;
        break;
      case "bomb":
        powerups.bomb++;
        break;
      case "shield":
        powerups.shield++;
        break;
      case "blast":
        powerups.blast++;
        break;
      case "life":
        lives++;
        break;
    }

    explosions.push(new Explosion(this.x, this.y));
  }
}

// ================== TARGET ==================
function pickActiveEnemy() {
  if (activeEnemy && enemies.includes(activeEnemy)) return; // Lock target once typing starts
  if (enemies.length === 0) {
    activeEnemy = null;
    return;
  }

  const nonPowerups = enemies.filter((e) => !e.isPowerup);
  if (nonPowerups.length === 0) {
    activeEnemy = null;
    return;
  }

  activeEnemy = nonPowerups.reduce((a, b) => (a.y > b.y ? a : b));
}

// ================== SPAWNING ==================
function handleSpawning(dt) {
  if (levelPopup.active) return;
  if (bossActive) return;

  // ================== BOSS SPAWN ==================
if (
  killsThisLevel >= getKillsToNextLevel(level) &&
  !bossActive
) {
  enemies = []; // clear screen BEFORE boss
  enemies.push(new Boss(getBossWordForLevel(level)));
  bossActive = true;
  killsThisLevel = 0;
  return;
}

  // ================== POWER-UP SPAWN ==================
  powerupTimer += dt;
  if (powerupTimer >= 7) {
    powerupTimer = 0;

    const POWERUP_POOL = [
      "laser", "laser", "laser",
      "bomb", "bomb",
      "shield",
      "blast",
      "life" // rare
    ];

    const type = POWERUP_POOL[Math.floor(Math.random() * POWERUP_POOL.length)];
    powerupDrops.push(new Powerup(type));
  }

  spawnTimer += dt;

  const spawnDelay = Math.max(0.6, 1.8 - level * 0.12);

  if (spawnTimer >= spawnDelay) {
    spawnTimer = 0;
    const words = getWordsForLevel(level);
    enemies.push(new Enemy(words[Math.floor(Math.random() * words.length)]));
  }
}

// ================== POWER-UP EFFECTS ==================

function useLaser() {
  if (powerups.laser <= 0) return;
  powerups.laser--;

  // ================= BOSS HANDLING =================
  if (activeEnemy?.isBoss) {
    // ✅ Laser damages boss by word
    activeEnemy.currentWord++;
    activeEnemy.progress = 0;

    explosions.push(new Explosion(activeEnemy.x, activeEnemy.y));

    if (activeEnemy.currentWord >= activeEnemy.words.length) {
      explosions.push(new Explosion(activeEnemy.x, activeEnemy.y, true));
      enemies = enemies.filter(e => e !== activeEnemy);
      activeEnemy = null;
      bossActive = false;

      levelPopup.active = true;
      levelPopup.text = `LEVEL ${level} COMPLETED`;
      levelPopup.timer = 2.5;

      level++;
    }

    shakeTime = 0.25;
    shakeIntensity = 18;
    return;
  }

  // ================= NORMAL ENEMIES =================
  if (!activeEnemy) return;

  const LASER_THICKNESS = 40; // pixels - horizontal band
  const targetY = activeEnemy.y;

  // Get all enemies in horizontal band, sorted left to right for sweep effect
  const hitEnemies = enemies.filter(
    e =>
      !e.isBoss &&
      Math.abs(e.y - targetY) <= LASER_THICKNESS
  );

  // Sort left to right for visual left-to-right sweep effect
  hitEnemies.sort((a, b) => a.x - b.x);

  hitEnemies.forEach(e => {
    explosions.push(new Explosion(e.x, e.y));
    score += 5;
    registerKill(e);
  });

  enemies = enemies.filter(e => !hitEnemies.includes(e));

  // Strong screen feedback
  shakeTime = 0.3;
  shakeIntensity = 20;
}


function useBomb() {
  if (powerups.bomb <= 0) return;
  powerups.bomb--;

  // 🔴 BOSS: remove ONE word
  if (activeEnemy?.isBoss) {
    activeEnemy.currentWord++;
    activeEnemy.progress = 0;

    if (activeEnemy.currentWord >= activeEnemy.words.length) {
      explosions.push(new Explosion(activeEnemy.x, activeEnemy.y, true));
      enemies = enemies.filter((e) => e !== activeEnemy);
      activeEnemy = null;
      bossActive = false;

      levelPopup.active = true;
      levelPopup.text = `LEVEL ${level} COMPLETED`;
      levelPopup.timer = 2.5;

      level++;
    }
    return;
  }

  // 🟢 NORMAL: clear 5 closest enemies
  const sorted = [...enemies]
    .filter((e) => !e.isPowerup)
    .sort((a, b) => b.y - a.y);

  const toRemove = sorted.slice(0, 5);

  toRemove.forEach(e => {
  explosions.push(new Explosion(e.x, e.y));
  score += 5;
  registerKill(e);
});


  enemies = enemies.filter((e) => !toRemove.includes(e));
  shakeTime = 0.3;
  shakeIntensity = 15;
}

function useShield() {
  if (powerups.shield <= 0 || shieldActive) return;
  powerups.shield--;
  shieldActive = true;
  shieldTimer = 10;
}

function useBlast() {
  if (powerups.blast <= 0) return;
  powerups.blast--;

  // 🟢 Clear everything EXCEPT boss
  enemies.forEach(e => {
  if (!e.isBoss) {
    explosions.push(new Explosion(e.x, e.y));
    score += 5;
    registerKill(e);
  }
});

  enemies = enemies.filter((e) => e.isBoss);

  // Big visual shockwave
  explosions.push(new Explosion(canvas.width / 2, canvas.height / 2, true));

  shakeTime = 0.4;
  shakeIntensity = 25;
}

// ================== INPUT ==================
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    paused = !paused;
    return;
  }

  if (e.key === "Tab") {
    e.preventDefault();
    location.reload();
  }

  if (e.key === "L") {
    useLaser();
    return;
  }

  if (e.key === "B") {
    useBomb();
    return;
  }

  if (e.key === "S") {
    useShield();
    return;
  }

  if (e.key === "X") {
    useBlast();
    return;
  }

  if (gameOver || paused) return;

  if (!activeEnemy) pickActiveEnemy();
  if (!activeEnemy) return;

  const currentWord = activeEnemy.isBoss
    ? activeEnemy.words[activeEnemy.currentWord]
    : activeEnemy.word;

  if (!currentWord) return;

  const expected = currentWord[activeEnemy.progress];

  if (!expected) return;

  if (e.key.toLowerCase() === expected.toLowerCase()) {
    // Case-insensitive typing for all words
    comboTimer = 1.5;

    // Create flying laser projectile
    lasers.push({
      x: rocket.x,
      y: rocket.y - 20,
      target: activeEnemy,
      speed: 1400,
      alive: true,
    });

    activeEnemy.progress++;

    const wordLength = activeEnemy.isBoss
  ? (activeEnemy.words[activeEnemy.currentWord] || "").length
  : (activeEnemy.word || "").length;

if (activeEnemy.progress === wordLength) {

  // ================= NORMAL ENEMY =================
  if (!activeEnemy.isBoss) {
    explosions.push(new Explosion(activeEnemy.x, activeEnemy.y));
    shakeTime = 0.15;
    shakeIntensity = 10;

    score += Math.max(1, combo);
    combo++;
    registerKill(activeEnemy);

    enemies = enemies.filter(e => e !== activeEnemy);
    activeEnemy = null;
    return;
  }

  // ================= BOSS WORD COMPLETED =================
  activeEnemy.currentWord++;
  activeEnemy.progress = 0;

  explosions.push(new Explosion(activeEnemy.x, activeEnemy.y));
  shakeTime = 0.3;
  shakeIntensity = 20;

  // ✅ Boss defeated ONLY after all words
  if (activeEnemy.currentWord >= activeEnemy.words.length) {
    explosions.push(new Explosion(activeEnemy.x, activeEnemy.y, true));

    enemies = enemies.filter(e => e !== activeEnemy);
    activeEnemy = null;
    bossActive = false;

    levelPopup.active = true;
    levelPopup.text = `LEVEL ${level} COMPLETED`;

    level++;
    killsThisLevel = 0;
  }
}
  }
});
function drawRocket() {
  ctx.save();

  // Aim rocket toward active enemy
  if (activeEnemy) {
    const dx = activeEnemy.x - rocket.x;
    const dy = activeEnemy.y - rocket.y;
    rocket.angle = Math.atan2(dy, dx) + Math.PI / 2;
  }

  ctx.translate(rocket.x, rocket.y);
  ctx.rotate(rocket.angle);

  // Draw rocket image or fallback
  if (rocketImage.complete) {
    ctx.drawImage(rocketImage, -24, -32, 48, 64);
  } else {
    // Fallback while loading
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(10, 15);
    ctx.lineTo(-10, 15);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}
// ================== RESIZE ==================
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  rocket.x = canvas.width / 2;
  rocket.y = canvas.height - 50;
});

// ================== GAME LOOP ==================
let last = 0;
function loop(time) {
  const dt = (time - last) / 1000;
  last = time;

  // ================== SHIELD TIMER ==================
  if (shieldActive) {
    shieldTimer -= dt;
    if (shieldTimer <= 0) {
      shieldActive = false;
      shieldTimer = 0;
    }
  }

  if (paused) {
    ctx.fillStyle = "yellow";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);

    requestAnimationFrame(loop);
    return;
  }

  if (comboTimer > 0) {
    comboTimer -= dt;
  } else if (comboTimer < 0) {
    combo = 0;
  }

  let ox = 0,
    oy = 0;
  if (shakeTime > 0) {
    shakeTime -= dt;
    ox = (Math.random() - 0.5) * shakeIntensity;
    oy = (Math.random() - 0.5) * shakeIntensity;
  }

  ctx.setTransform(1, 0, 0, 1, ox, oy);
  if (levelPopup.active) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#22c55e";
    ctx.font = "48px Orbitron";
    ctx.textAlign = "center";
    ctx.fillText(levelPopup.text, canvas.width / 2, canvas.height / 2);

    showNextLevelButton();
    return;
  }

  if (gameOver) {
    requestAnimationFrame(loop);
    return;
  }

  // ================== BACKGROUND ==================
  if (backgroundImage.complete) {
    ctx.drawImage(backgroundImage, -ox, -oy, canvas.width, canvas.height);
  } else {
    // Fallback black background while loading
    ctx.fillStyle = "black";
    ctx.fillRect(-ox, -oy, canvas.width, canvas.height);
  }

  // ================== STARFIELD ==================
  ctx.fillStyle = "white";
  stars.forEach(star => {
    star.y += star.speed * dt;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });

  drawRocket();
  if (shieldActive) {
    ctx.beginPath();
    ctx.arc(rocket.x, rocket.y, 60, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  handleSpawning(dt);

  enemies.forEach((e) => {
    e.update(dt);
    e.draw(e === activeEnemy);
  });

  enemies = enemies.filter((e) => {
    if (e.y > canvas.height - 40 && !e.isPowerup) {
      if (!shieldActive) {
        health--;
        if (health <= 0 && lives > 0) {
          lives--;
          health = 3;
        }
      }
      return false;
    }
    return true;
  });

  // ================== LASER UPDATE ==================
  lasers = lasers.filter(l => l.alive);

  lasers.forEach(l => {
    if (!l.target || !enemies.includes(l.target)) {
      l.alive = false;
      return;
    }

    const dx = l.target.x - l.x;
    const dy = l.target.y - l.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 15) {
      l.alive = false;
      return;
    }

    const vx = (dx / dist) * l.speed * dt;
    const vy = (dy / dist) * l.speed * dt;

    l.x += vx;
    l.y += vy;
  });

  // ================== POWERUP UPDATE & AUTO-COLLECT ==================
  powerupDrops.forEach(p => {
    p.update(dt);

    // Collect when touching rocket
    const dx = p.x - rocket.x;
    const dy = p.y - rocket.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 45) {
      p.collect();
    }

    // Auto-collect on ground
    if (p.y > canvas.height - 40) {
      p.collect();
    }
  });

  powerupDrops = powerupDrops.filter(p => !p.collected);

  // ================== LASER DRAWING ==================
  lasers.forEach(l => {
    ctx.strokeStyle = shieldActive ? "#38bdf8" : "#22c55e";
    ctx.lineWidth = 3;
    ctx.shadowColor = shieldActive ? "#38bdf8" : "#22c55e";
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.moveTo(l.x - (l.target.x - l.x), l.y - (l.target.y - l.y));
    ctx.lineTo(l.x, l.y);
    ctx.stroke();

    ctx.shadowBlur = 0;
  });

  // ================== POWERUP DRAWING ==================
  powerupDrops.forEach(p => p.draw());

  explosions = explosions.filter((ex) => {
    ex.update(dt);
    ex.draw();
    return ex.life > 0;
  });
  ctx.fillStyle = "#38bdf8";
  ctx.fillText(`Shield (S): ${powerups.shield}`, 20, 240);
  ctx.fillText(`Blast (X): ${powerups.blast}`, 20, 270);

  if (shieldActive) {
    ctx.fillText(`Shield Active: ${shieldTimer.toFixed(1)}s`, 20, 300);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  let hudY = 30;
  const hudGap = 26;

  ctx.fillText(`Score: ${score}`, 20, hudY);
  hudY += hudGap;
  ctx.fillText(`Health: ${health}`, 20, hudY);
  hudY += hudGap;
  ctx.fillText(`Lives: ${lives}`, 20, hudY);
  hudY += hudGap;
  ctx.fillText(`Level: ${level}`, 20, hudY);
  hudY += hudGap;
  ctx.fillText(`Target WPM: ${getWPM(level)}`, 20, hudY);
  hudY += hudGap;
  ctx.fillText(`Combo: ${combo}`, 20, hudY);
  hudY += hudGap;

  ctx.fillStyle = "#a855f7";
  ctx.fillText(`Laser (L): ${powerups.laser}`, 20, 180);
  ctx.fillText(`Bomb (B): ${powerups.bomb}`, 20, 210);

  if (health <= 0 && lives <= 0) {
    gameOver = true;
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.fillStyle = "#22c55e";
    ctx.font = "28px Arial";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText(`Level Reached: ${level}`, canvas.width / 2, canvas.height / 2 + 80);
    
    ctx.fillStyle = "#a855f7";
    ctx.font = "20px Arial";
    ctx.fillText("Press TAB to restart", canvas.width / 2, canvas.height / 2 + 140);
    return;
  }

  pickActiveEnemy();
  requestAnimationFrame(loop);
}

// ================== NEXT LEVEL BUTTON ==================
nextLevelBtn.addEventListener("click", () => {
  nextLevelBtn.style.display = "none";
  levelPopup.active = false;
  levelPopup.timer = 0;

  // Reset for next level
  spawnTimer = 0;
  powerupTimer = 0;
  enemies = [];
  activeEnemy = null;
  killsThisLevel = 0;
  bossActive = false;

  // Start next level immediately
  requestAnimationFrame(loop);
});

// Ensure button is visible when level completes
function showNextLevelButton() {
  nextLevelBtn.style.display = "block";
  nextLevelBtn.style.opacity = "1";
  nextLevelBtn.style.visibility = "visible";
  nextLevelBtn.style.pointerEvents = "auto";
}

requestAnimationFrame(loop);
