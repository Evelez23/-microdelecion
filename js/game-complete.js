/* ============================================================
   Oso Abrazos - game-complete.js (versión corregida)
   ============================================================ */

(function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // ========================
  // Configuración general
  // ========================
  const GAME_WIDTH = canvas.width;
  const GAME_HEIGHT = canvas.height;

  let currentLevel = 1;
  let score = 0;
  let lives = 3;
  let isGameOver = false;

  // ========================
  // Assets (Imágenes)
  // ========================
  const IMAGES = {
    amigos: {
      fondoBosque: "img/Amigos/Fondobosque.jpg",
      ardilla: "img/Amigos/ardilla.png",
      conejo: "img/Amigos/conejo.png",
      lovepower: "img/Amigos/lovepower.png",
      miel: "img/Amigos/miel.png",
      osoyuni: "img/Amigos/osoyuni.png",
      pajarito: "img/Amigos/pajarito.png",
      unir4patas: "img/Amigos/unien4patas.png",
      unirshup: "img/Amigos/unirshup.png",
      unirun: "img/Amigos/unirun.png",
    },
    enemigos: {
      enemigo1: "img/enemigos/Enemigos-01.svg",
      enemigo2: "img/enemigos/Enemigos-02.svg",
      enemigo3: "img/enemigos/Enemigos-03.svg",
      enemigo3png: "img/enemigos/Enemigos-03.svg.png",
      fire: "img/enemigos/fire.png",
      lobo: "img/enemigos/lobo.svg",
      loboFeroz: "img/enemigos/loboferoz.png",
      loboTriste: "img/enemigos/lobotriste.png",
    },
    fondos: {
      final: "img/fondos/background final.jpeg",
      b1_1: "img/fondos/background_1_1.jpeg",
      b1_2: "img/fondos/background_1_2.jpeg",
      b1_3: "img/fondos/background_1_3.jpeg",
      b2_1: "img/fondos/background_2_1.jpeg",
      b2_2: "img/fondos/background_2_2.jpeg",
      b2_3: "img/fondos/background_2_3.jpeg",
      bosque1: "img/fondos/bosque1.jpg",
      bosque2: "img/fondos/bosque2.jpg",
      bosque3: "img/fondos/bosque3.jpg",
      bosque4: "img/fondos/bosque4.jpg",
    },
    oso: {
      hang: "img/oso/oso_hang.svg",
      hug: "img/oso/oso_hug.svg",
      idle: "img/oso/oso_idle.svg",
      portada: "img/oso/oso_portada.png",
      sit: "img/oso/oso_sit.svg",
      walk: "img/oso/oso_walk.svg",
    },
  };

  // ========================
  // Assets (Sonidos)
  // ========================
  const SOUNDS = {
    background: "sounds/background.mp3.mp3",
    collect: "sounds/collect.mp3.mp3",
    enemy: "sounds/enemy.mp3.mp3",
    hug: "sounds/hug.mp3.mp3",
    hurt: "sounds/hurt.mp3.mp3",
    intro: "sounds/intro.mp3",
    jump: "sounds/jump.mp3.mp3",
    batalla: "sounds/para la batalla.mp3",
    powerup: "sounds/powerup.mp3.mp3",
    shot: "sounds/shot.mp3.mp3",
  };

  // ========================
  // Precarga de recursos
  // ========================
  const loadedImages = {};
  const loadedSounds = {};

  function loadImage(name, src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve((loadedImages[name] = img));
      img.onerror = () => {
        console.warn("No se pudo cargar imagen:", src);
        resolve((loadedImages[name] = null));
      };
      img.src = src;
    });
  }

  function loadSound(name, src) {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => resolve((loadedSounds[name] = audio));
      audio.onerror = () => {
        console.warn("No se pudo cargar sonido:", src);
        resolve((loadedSounds[name] = null));
      };
      audio.src = src;
    });
  }

  async function preloadAssets() {
    const promises = [];

    // Imágenes
    for (const group in IMAGES) {
      for (const key in IMAGES[group]) {
        promises.push(loadImage(`${group}_${key}`, IMAGES[group][key]));
      }
    }

    // Sonidos
    for (const key in SOUNDS) {
      promises.push(loadSound(key, SOUNDS[key]));
    }

    await Promise.all(promises);
    console.info("Todos los assets precargados");
  }

  // ========================
  // Entidades del juego
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
      this.sprite = loadedImages["oso_idle"];
    }

    update() {
      this.y += this.speedY;
      if (!this.grounded) this.speedY += this.gravity;

      if (this.y + this.height >= GAME_HEIGHT - 20) {
        this.y = GAME_HEIGHT - 20 - this.height;
        this.speedY = 0;
        this.grounded = true;
      }
    }

    jump() {
      if (this.grounded) {
        this.speedY = this.jumpPower;
        this.grounded = false;
        if (loadedSounds.jump) loadedSounds.jump.play();
      }
    }

    draw() {
      if (this.sprite) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
      } else {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  }

  class Enemy {
    constructor(x, y, sprite) {
      this.x = x;
      this.y = y;
      this.width = 50;
      this.height = 50;
      this.speedX = -3;
      this.sprite = sprite;
    }

    update() {
      this.x += this.speedX;
    }

    draw() {
      if (this.sprite) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
      } else {
        ctx.fillStyle = "purple";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  }

  // ========================
  // Lógica de juego
  // ========================
  const player = new Player();
  const enemies = [];

  function spawnEnemy() {
    const y = GAME_HEIGHT - 70;
    const sprite = loadedImages["enemigos_enemigo1"];
    enemies.push(new Enemy(GAME_WIDTH, y, sprite));
  }

  function update() {
    if (isGameOver) return;
    player.update();
    enemies.forEach((e) => e.update());

    // Colisiones
    enemies.forEach((e) => {
      if (
        player.x < e.x + e.width &&
        player.x + player.width > e.x &&
        player.y < e.y + e.height &&
        player.height + player.y > e.y
      ) {
        lives--;
        if (loadedSounds.hurt) loadedSounds.hurt.play();
        if (lives <= 0) {
          isGameOver = true;
        }
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Fondo
    if (loadedImages["fondos_bosque1"]) {
      ctx.drawImage(
        loadedImages["fondos_bosque1"],
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
      );
    } else {
      ctx.fillStyle = "#88c070";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // Player y enemigos
    player.draw();
    enemies.forEach((e) => e.draw());

    // UI
    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.fillText("Puntos: " + score, 20, 30);
    ctx.fillText("Vidas: " + lives, 20, 55);
  }

  function gameLoop() {
    update();
    draw();
    if (!isGameOver) {
      requestAnimationFrame(gameLoop);
    } else {
      ctx.fillStyle = "#fff";
      ctx.font = "40px Arial";
      ctx.fillText("GAME OVER", GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2);
    }
  }

  // ========================
  // Input
  // ========================
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      player.jump();
    }
  });

  // ========================
  // Inicio del juego
  // ========================
  (async function init() {
    await preloadAssets();
    setInterval(spawnEnemy, 2500);
    gameLoop();
  })();
})();
