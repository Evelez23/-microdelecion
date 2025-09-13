/* ============================================================
   Oso Abrazos - game-complete.js (versión corregida e integrada)
   ============================================================ */

// Esta versión está diseñada para integrarse con el juego principal
// y soluciona los problemas de movimiento de enemigos y sistema de vidas

(function () {
  // Solo ejecutar si el canvas existe
  if (!document.getElementById("gameCanvas")) return;

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // =======================
  // Configuración general
  // ========================
  const GAME_WIDTH = canvas.width;
  const GAME_HEIGHT = canvas.height;

  // Integración con el juego principal
  let currentLevel = window.gameState ? window.gameState.currentLevel : "1-1";
  let score = window.gameState ? window.gameState.score : 0;
  let lives = window.gameState ? window.gameState.lives : 3;
  let isGameOver = false;

  // =======================
  // Clases mejoradas para integración
  // ========================
  class Player {
    constructor() {
      this.x = 100;
      this.y = GAME_HEIGHT - 120;
      this.width = 60;
      this.height = 60;
      this.speedY = 0;
      this.gravity = 0.6;
      this.jumpPower = -12;
      this.grounded = true;
      this.sprite = window.sprites ? window.sprites.idle : null;
      this.invincible = 0; // Para evitar daño inicial
    }

    update() {
      if (this.invincible > 0) {
        this.invincible--;
      }
      this.speedY += this.gravity;
      this.y += this.speedY;

      // Colisión con el suelo
      if (this.y + this.height > GAME_HEIGHT) {
        this.y = GAME_HEIGHT - this.height;
        this.speedY = 0;
        this.grounded = true;
      }
    }

    draw() {
      if (this.sprite) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
      }
    }

    jump() {
      if (this.grounded) {
        this.speedY = this.jumpPower;
        this.grounded = false;
        playSound("jump");
      }
    }

    takeDamage() {
      if (this.invincible <= 0) {
        lives--;
        this.invincible = 120; // 2 segundos de invencibilidad (60 fps)
        playSound("hurt");
      }
    }
  }

  class Enemy {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.width = 50;
      this.height = 50;
      this.type = type;
      this.speedX = -2;
      this.health = 1;
      this.sprite = window.sprites.enemy;

      if (this.type === "boss") {
        this.width = 120;
        this.height = 120;
        this.health = 5; // Más vida para el jefe
        this.sprite = window.sprites.wolf;
        this.phase = 1;
        this.attackCooldown = 0;
      } else if (this.type === "bird") {
        this.width = 60;
        this.height = 60;
        this.speedX = -3;
        this.sprite = window.sprites.bird;
      }
    }

    update() {
      this.x += this.speedX;

      if (this.type === "boss") {
        if (this.health <= 3 && this.phase === 1) {
          this.phase = 2;
          this.sprite = window.sprites.wolfAngry;
          this.speedX = -3; // Se mueve más rápido
          flashScreen();
          playSound("boss");
        }
        this.attackCooldown--;
        if (this.attackCooldown <= 0) {
          this.attackCooldown = 90; // Ataca cada 1.5 segundos
          if (Math.random() < 0.5) {
            spawnEnemy(this.x, this.y + this.height, "fireball");
          }
        }
      }
    }

    draw() {
      if (this.sprite) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
      }
    }
  }

  class Item {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.width = 30;
      this.height = 30;
      this.sprite = window.sprites.heart;
      if (type === "powerup") {
        this.sprite = window.sprites.powerup;
      } else if (type === "coin") {
        this.sprite = window.sprites.coin;
      }
    }
    draw() {
      if (this.sprite) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
      }
    }
  }

  class Projectile {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.speedX = 5;
      this.width = 20;
      this.height = 20;
      this.type = type;
      this.sprite = window.sprites.shot;
    }
    update() {
      this.x += this.speedX;
    }
    draw() {
      if (this.sprite) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
      }
    }
  }

  // =======================
  // Variables del juego
  // ========================
  let player = new Player();
  let enemies = [];
  let items = [];
  let projectiles = [];

  // =======================
  // Funciones de control
  // ========================

  function playSound(soundKey) {
    const sound = sounds[soundKey];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }

  function flashScreen() {
    const container = document.getElementById('gameContainer');
    container.classList.add('flash-effect');
    setTimeout(() => {
      container.classList.remove('flash-effect');
    }, 300);
  }

  function updateGame() {
    if (isGameOver) return;

    // Actualizar jugador
    player.update();

    // Actualizar enemigos
    enemies.forEach((enemy, index) => {
      enemy.update();
      // Colisión con jugador
      if (checkCollision(player, enemy)) {
        player.takeDamage();
        if (enemy.type !== "boss") {
          enemies.splice(index, 1);
        }
      }
    });

    // Actualizar items
    items.forEach((item, index) => {
      if (checkCollision(player, item)) {
        if (item.type === "heart") {
          lives++;
        } else if (item.type === "coin") {
          score += 10;
        } else if (item.type === "powerup" && !window.oso.hasUnicorn) {
          window.gameState.heartsCollected += 3; // Corazones para invocar
          playSound("powerup");
        }
        items.splice(index, 1);
        playSound("collect");
      }
    });

    // Actualizar proyectiles
    projectiles.forEach((p, pIndex) => {
      p.update();
      if (p.x > GAME_WIDTH) {
        projectiles.splice(pIndex, 1);
      }
      // Colisión con enemigos
      enemies.forEach((enemy, eIndex) => {
        if (checkCollision(p, enemy)) {
          enemy.health--;
          projectiles.splice(pIndex, 1);
          if (enemy.health <= 0) {
            enemies.splice(eIndex, 1);
            score += 50;
          }
        }
      });
    });

    // Filtra los enemigos que están fuera de pantalla
    enemies = enemies.filter(enemy => enemy.x + enemy.width > 0);
  }

  function drawGame() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Dibujar jugador y otros elementos
    player.draw();
    enemies.forEach(enemy => enemy.draw());
    items.forEach(item => item.draw());
    projectiles.forEach(p => p.draw());

    // Actualizar UI del juego principal
    if (window.updateGameUI) {
      window.updateGameUI(lives, score);
    }
  }

  function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y;
  }

  function spawnEnemy(x, y, type) {
    enemies.push(new Enemy(x, y, type));
  }

  function clearEnemies() {
    enemies = [];
    projectiles = [];
  }

  // =======================
  // Integración con el juego principal
  // ========================

  function initIntegratedGame() {
    if (window.gameState) {
      window.integratedGame = {
        update: updateGame,
        draw: drawGame,
        spawnEnemy: spawnEnemy,
        clearEnemies: clearEnemies,
        getPlayer: () => player,
        getEnemies: () => enemies,
        getProjectiles: () => projectiles,
        spawnProjectile: (x, y, type) => projectiles.push(new Projectile(x, y, type))
      };

      // Control del jugador con teclas
      document.addEventListener("keydown", (e) => {
        if (!window.gameState.gameStarted) return;
        if (e.code === "Space" && player.grounded) {
          player.jump();
        }
        if (e.code === "KeyP" && window.oso.hasUnicorn) {
          const unicorn = window.unicorn;
          if (!unicorn.active) {
            unicorn.active = true;
            unicorn.power = 100;
            playSound("powerup");
            
            // Transformación del oso al 20% más grande
            window.oso.sprite = window.sprites.osoyuni;
            window.oso.width = 96; // 80 * 1.2
            window.oso.height = 96; // 80 * 1.2
          }
        }
      });

      // Modificar el loop de juego principal para llamar a nuestras funciones
      window.originalUpdate = window.update;
      window.update = function() {
        window.originalUpdate();
        updateGame();
      };

      window.originalDraw = window.draw;
      window.draw = function() {
        window.originalDraw();
        drawGame();
      };
    }
  }

  // =======================
  // Inicialización cuando el juego principal esté listo
  // ========================
  if (window.gameState) {
    // El juego principal ya está cargado
    initIntegratedGame();
  } else {
    // Esperar a que el juego principal se cargue
    const checkGameReady = setInterval(() => {
      if (window.gameState && window.update && window.draw) {
        clearInterval(checkGameReady);
        initIntegratedGame();
      }
    }, 100);
  }

  // Hacer funciones disponibles globalmente para integración
  window.integratedUpdate = updateGame;
  window.integratedDraw = drawGame;
  window.spawnEnemy = spawnEnemy;
  window.clearEnemies = clearEnemies;

})();

// Sonidos
const sounds = {
  background: new Audio(`${baseUrl}/sounds/background.mp3`),
  jump: new Audio(`${baseUrl}/sounds/jump.mp3`),
  collect: new Audio(`${baseUrl}/sounds/collect.mp3`),
  hug: new Audio(`${baseUrl}/sounds/hug.mp3`),
  hurt: new Audio(`${baseUrl}/sounds/hurt.mp3`),
  enemy: new Audio(`${baseUrl}/sounds/enemy.mp3`),
  powerup: new Audio(`${baseUrl}/sounds/powerup.mp3`),
  shot: new Audio(`${baseUrl}/sounds/shot.mp3`),
  boss: new Audio(`${baseUrl}/sounds/para%20la%20batalla.mp3`),
};
