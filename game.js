// game.js - Versión corregida
console.log("Iniciando juego Oso Abrazos...");

// ============= CONFIGURACIÓN Y VARIABLES GLOBALES =============
const baseUrl = "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main";

// Sprites
const sprites = {
  idle: new Image(),
  walk: new Image(),
  jump: new Image(),
  run: new Image(),
  crouch: new Image(),
  hug: new Image(),
  cover: new Image(),
  squirrel: new Image(),
  rabbit: new Image(),
  bird: new Image(),
  enemy1: new Image(),
  enemy2: new Image(),
  enemy3: new Image(),
  // Fondos de nivel
  background_1_1: new Image(),
  background_1_2: new Image(),
  background_1_3: new Image(),
  background_2_1: new Image(),
  background_2_2: new Image(),
  background_2_3: new Image(),
  // Jefe y elementos especiales
  bossPhase1: new Image(),
  bossPhase2: new Image(),
  bossPhase3: new Image(),
  heart: new Image(),
  fire: new Image(),
  unicorn: new Image(),
  honey: new Image(),
  osoyuni: new Image()
};

// URLs de las imágenes (CORREGIDAS)
const imageUrls = {
  idle: `${baseUrl}/img/oso/oso_idle.svg`,
  walk: `${baseUrl}/img/oso/oso_walk.svg`,
  jump: `${baseUrl}/img/oso/oso_jump.svg`,
  run: `${baseUrl}/img/oso/oso_run.svg`,
  crouch: `${baseUrl}/img/oso/oso_sit.svg`,
  hug: `${baseUrl}/img/oso/oso_hugging.svg`,
  cover: `${baseUrl}/img/oso/oso_portada.png`,
  squirrel: `${baseUrl}/img/Amigos/ardilla.png`,
  rabbit: `${baseUrl}/img/Amigos/conejo.png`,
  bird: `${baseUrl}/img/Amigos/pajarito.png`,
  enemy1: `${baseUrl}/img/enemigos/Enemigos-01.svg`,
  enemy2: `${baseUrl}/img/enemigos/Enemigos-02.svg`,
  enemy3: `${baseUrl}/img/enemigos/Enemigos-03.svg`,
  // Fondos de nivel
  background_1_1: `${baseUrl}/img/fondos/bosque1.jpg`,
  background_1_2: `${baseUrl}/img/fondos/bosque2.jpg`,
  background_1_3: `${baseUrl}/img/fondos/bosque3.jpg`,
  background_2_1: `${baseUrl}/img/fondos/bosque4.jpg`,
  background_2_2: `${baseUrl}/img/fondos/background_1_2.jpeg`,
  background_2_3: `${baseUrl}/img/fondos/background%20final.jpeg`,
  // Jefe y elementos especiales
  bossPhase1: "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/41296616cc8e88066d9db7c38be0939b9302996a/img/enemigos/lobo.svg",
  bossPhase2: "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/img/enemigos/loboferoz.png",
  bossPhase3: "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/img/enemigos/lobotriste.png",
  heart: `${baseUrl}/img/Amigos/lovepower.png`,
  fire: `${baseUrl}/img/enemigos/fire.png`,
  unicorn: `${baseUrl}/img/Amigos/unirshup.png`,
  honey: `${baseUrl}/img/Amigos/miel.png`,
  osoyuni: `${baseUrl}/img/Amigos/osoyuni.png`
};

// Sonidos (CORREGIDOS)
const sounds = {
  background: new Audio(`${baseUrl}/sounds/background.mp3.mp3`),
  jump: new Audio(`${baseUrl}/sounds/jump.mp3.mp3`),
  collect: new Audio(`${baseUrl}/sounds/collect.mp3.mp3`),
  hug: new Audio(`${baseUrl}/sounds/hug.mp3.mp3`),
  hurt: new Audio(`${baseUrl}/sounds/hurt.mp3.mp3`),
  enemy: new Audio(`${baseUrl}/sounds/enemy.mp3.mp3`),
  powerup: new Audio(`${baseUrl}/sounds/powerup.mp3.mp3`),
  shot: new Audio(`${baseUrl}/sounds/shot.mp3.mp3`),
  bossBattle: new Audio(`${baseUrl}/sounds/para%20la%20batalla.mp3`),
  intro: new Audio(`${baseUrl}/sounds/intro.mp3`)
};

// Configurar sonidos
for (let key in sounds) {
  if (sounds[key]) {
    sounds[key].volume = 0.6;
    sounds[key].preload = 'auto';
  }
}
if (sounds.background) sounds.background.loop = true;

// Variables para el estado de carga
let totalResources = Object.keys(imageUrls).length;
let loadedResources = 0;
let failedResources = 0;

// Esperar a que se cargue la página
window.addEventListener('load', function() {
  console.log("🎮 Inicializando juego Oso Abrazos...");
  
  // Inicializar variables globales
  window.gameState = {
    gameStarted: false,
    currentLevel: "1-1",
    score: 0,
    lives: 3,
    heartsCollected: 0,
    soundEnabled: true,
    bossFight: false
  };
  
  window.oso = {
    x: 100, 
    y: 380,
    width: 80, 
    height: 80,
    vx: 0, 
    vy: 0,
    speed: 5,
    jumpForce: 15,
    gravity: 0.7,
    grounded: false,
    hugging: false,
    hugCooldown: 0,
    direction: 1,
    action: "idle",
    hasUnicorn: false,
    invincible: 60
  };
  
  window.boss = {
    x: 600, 
    y: 350,
    width: 120, 
    height: 120,
    health: 5,
    maxHealth: 5,
    enraged: false,
    phase: 1,
    attackCooldown: 100,
    warningTimer: 0,
    fireballs: []
  };
  
  window.unicorn = {
    active: false,
    power: 0,
    cooldown: 0
  };
  
  window.platforms = [];
  window.friends = [];
  window.enemies = [];
  window.items = [];
  window.hearts = [];
  window.projectiles = [];
  window.particles = [];
  window.keys = {};
  
  // Definir niveles
  window.LEVELS = {
    "1-1": { name: "Bosque Inicial", friends: 3, enemies: 2, items: 2, hasBoss: false },
    "1-2": { name: "Claro Soleado", friends: 4, enemies: 3, items: 3, hasBoss: false },
    "1-3": { name: "Cueva Misteriosa", friends: 5, enemies: 4, items: 4, hasBoss: false },
    "2-1": { name: "Montañas Altas", friends: 4, enemies: 5, items: 3, hasBoss: false },
    "2-2": { name: "Cascada Brillante", friends: 5, enemies: 5, items: 4, hasBoss: false },
    "2-3": { name: "Guarida del Lobo", friends: 0, enemies: 0, items: 0, hasBoss: true }
  };
  
  // Obtener referencias a elementos del DOM
  const gameCanvas = document.getElementById('gameCanvas');
  const startScreen = document.getElementById('startScreen');
  const startButton = document.getElementById('startButton');
  const victoryScreen = document.getElementById('victoryScreen');
  const nextLevelBtn = document.getElementById('nextLevelBtn');
  const storybook = document.getElementById('storybook');
  const startGameBtn = document.getElementById('startGame');
  const backToMenuBtn = document.getElementById('backToMenu');
  const soundToggle = document.getElementById('soundToggle');
  const hintElement = document.getElementById('hint');
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingProgress = document.getElementById('loadingProgress');
  const loadingText = document.getElementById('loadingText');
  const loadingDetails = document.getElementById('loadingDetails');
  const coverImage = document.getElementById('coverImage');
  
  // Configurar canvas
  if (gameCanvas) {
    window.gameCtx = gameCanvas.getContext('2d');
  }
  
  // Configurar botones
  if (startButton) {
    startButton.addEventListener('click', function() {
      showStorybook();
    });
  }
  
  if (startGameBtn) {
    startGameBtn.addEventListener('click', startGame);
  }
  
  if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', backToMenu);
  }
  
  if (nextLevelBtn) {
    nextLevelBtn.addEventListener('click', nextLevel);
  }
  
  if (soundToggle) {
    soundToggle.addEventListener('click', toggleSound);
  }
  
  // Precargar recursos
  loadResources();
  
  console.log("✅ Juego inicializado correctamente");
});

// ============= FUNCIONES DE INTERFAZ =============
function update() {
  // Actualizar amigos (animación flotante)
  for (let friend of window.friends) {
    friend.floating += 0.05;
    friend.y += Math.sin(friend.floating) * 0.5 * friend.floatDir;
  }
  
  // Actualizar enemigos
  for (let enemy of window.enemies) {
    if (enemy.moveCooldown > 0) {
      enemy.moveCooldown--;
    }
    
    if (enemy.moveCooldown <= 0) {
      enemy.x += enemy.speed * enemy.direction;
    }
    
    if (enemy.x <= 50) {
      enemy.direction = 1;
      enemy.moveCooldown = 60;
    }
    
    if (enemy.moveCooldown === 0 && enemy.direction > 0) {
      enemy.direction = -1;
    }
    
    // Solo verificar colisiones si el oso no es invencible
    if (window.oso.invincible <= 0 && checkCollision(window.oso, enemy) && !window.oso.hugging) {
      takeDamage(enemy.damage);
    }
  }
  
  // Actualizar jefe si está en nivel de jefe
  if (window.gameState.bossFight) {
    updateBoss();
  }
  
  // Actualizar posición del oso
  updateOso();
  
  // Actualizar proyectiles
  updateProjectiles();
  
  // Actualizar partículas
  updateParticles();
  
  // Comprobar condiciones de victoria/derrota
  checkGameConditions();
  
  // Actualizar UI
  updateUI();
}

function draw() {
  const ctx = window.gameCtx;
  const canvas = document.getElementById('gameCanvas');
  
  if (!ctx || !canvas) {
    console.error("❌ Canvas no encontrado");
    return;
  }
  
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar fondo según el nivel
  drawBackground();
  
  // Dibujar plataformas
  drawPlatforms();
  
  // Dibujar items (miel)
  drawItems();
  
  // Dibujar amigos
  drawFriends();
  
  // Dibujar enemigos
  drawEnemies();
  
  // Dibujar corazones
  drawHearts();
  
  // Dibujar proyectiles
  drawProjectiles();
  
  // Dibujar bolas de fuego del jefe
  drawFireballs();
  
  // Dibujar partículas
  drawParticles();
  
  // Dibujar jefe si está activo
  if (window.gameState.bossFight) {
    drawBoss();
  }
  
  // Dibujar oso
  drawOso();
  
  // Dibujar efectos especiales
  drawSpecialEffects();
}
function updateOso() {
  // Aplicar gravedad
  window.oso.vy += window.oso.gravity;
  
  // Movimiento horizontal
  if (window.keys["ArrowLeft"] || window.keys["a"]) {
    window.oso.vx = -window.oso.speed;
    window.oso.direction = -1;
  } else if (window.keys["ArrowRight"] || window.keys["d"]) {
    window.oso.vx = window.oso.speed;
    window.oso.direction = 1;
  } else {
    window.oso.vx *= 0.8;
  }
  
  // Saltar
  if ((window.keys["ArrowUp"] || window.keys["w"]) && window.oso.grounded) {
    window.oso.vy = -window.oso.jumpForce;
    window.oso.grounded = false;
    playSound("jump");
  }
  
  // Abrazar
  if (window.keys[" "] && window.oso.hugCooldown <= 0 && window.oso.grounded) {
    window.oso.hugging = true;
    window.oso.hugCooldown = 30;
    playSound("hug");
    
    // Comprobar colisión con amigos
    for (let friend of window.friends) {
      if (!friend.hugged && checkCollision(window.oso, friend)) {
        friend.hugged = true;
        window.gameState.score += 100;
        createParticles(friend.x + friend.width/2, friend.y + friend.height/2, 10, '#FF69B4');
        playSound("collect");
      }
    }
  } else {
    window.oso.hugging = false;
    if (window.oso.hugCooldown > 0) window.oso.hugCooldown--;
  }
  
  // Disparar con unicornio
  if ((window.keys["z"] || window.keys["Z"]) && window.unicorn.active && window.unicorn.cooldown <= 0 && window.unicorn.power > 0) {
    window.projectiles.push({
      x: window.oso.x + window.oso.width/2,
      y: window.oso.y + window.oso.height/2,
      vx: window.oso.direction * 10,
      vy: 0,
      radius: 8,
      type: 'unicorn',
      damage: 1
    });
    
    window.unicorn.cooldown = 15;
    window.unicorn.power -= 5;
    
    if (window.unicorn.power <= 0) {
      window.unicorn.active = false;
      window.oso.hasUnicorn = false;
    }
    
    playSound("shot");
  }
  
  if (window.unicorn.cooldown > 0) window.unicorn.cooldown--;
  
  // Actualizar posición
  window.oso.x += window.oso.vx;
  window.oso.y += window.oso.vy;
  
  // Limitar a los bordes de la pantalla
  if (window.oso.x < 0) window.oso.x = 0;
  if (window.oso.x > 800 - window.oso.width) window.oso.x = 800 - window.oso.width;
  if (window.oso.y > 500) {
    // Caer fuera de la pantalla
    window.oso.y = 100;
    window.oso.x = 100;
    takeDamage(1);
  }
  
  // Comprobar colisión con plataformas
  window.oso.grounded = false;
  for (let platform of window.platforms) {
    if (window.oso.x + window.oso.width > platform.x && 
        window.oso.x < platform.x + platform.width &&
        window.oso.y + window.oso.height > platform.y && 
        window.oso.y + window.oso.height < platform.y + 10) {
      window.oso.y = platform.y - window.oso.height;
      window.oso.vy = 0;
      window.oso.grounded = true;
    }
  }
  
  // Comprobar colisión con enemigos
  if (window.oso.invincible <= 0) {
    for (let enemy of window.enemies) {
      if (checkCollision(window.oso, enemy)) {
        takeDamage(enemy.damage);
        window.oso.invincible = 60;
      }
    }
  } else {
    window.oso.invincible--;
  }
  
  // Comprobar colisión con corazones
  for (let heart of window.hearts) {
    if (!heart.collected && checkCollision(window.oso, heart)) {
      heart.collected = true;
      window.gameState.heartsCollected++;
      window.gameState.score += 50;
      createParticles(heart.x + heart.width/2, heart.y + heart.height/2, 15, '#FF69B4');
      playSound("collect");
      
      // Si se recolectan 3 corazones, activar unicornio
      if (window.gameState.heartsCollected >= 3 && !window.unicorn.active) {
        window.unicorn.active = true;
        window.oso.hasUnicorn = true;
        window.unicorn.power = 100;
        const unicornPowerElement = document.getElementById('unicornPower');
        if (unicornPowerElement) unicornPowerElement.style.display = 'block';
        showHint("¡Unicornio de la Amistad activado! Presiona Z para disparar rayos de amistad.", 5000);
      }
    }
  }
  
  // Comprobar colisión con items (miel)
  for (let item of window.items) {
    if (!item.collected && checkCollision(window.oso, item)) {
      item.collected = true;
      window.gameState.score += 30;
      createParticles(item.x + item.width/2, item.y + item.height/2, 8, '#FF9800');
      playSound("powerup");
    }
  }
}

function updateProjectiles() {
  for (let i = window.projectiles.length - 1; i >= 0; i--) {
    const proj = window.projectiles[i];
    proj.x += proj.vx;
    
    // Eliminar proyectiles fuera de pantalla
    if (proj.x < 0 || proj.x > 800) {
      window.projectiles.splice(i, 1);
      continue;
    }
    
    // Comprobar colisión de proyectiles con enemigos
    if (proj.type === 'unicorn') {
      for (let j = window.enemies.length - 1; j >= 0; j--) {
        const enemy = window.enemies[j];
        if (Math.abs(proj.x - (enemy.x + enemy.width/2)) < proj.radius + enemy.width/2 &&
            Math.abs(proj.y - (enemy.y + enemy.height/2)) < proj.radius + enemy.height/2) {
          // Eliminar enemigo y proyectil
          window.enemies.splice(j, 1);
          window.projectiles.splice(i, 1);
          window.gameState.score += 50;
          createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 15, '#FF69B4');
          break;
        }
      }
      
      // Comprobar colisión con el jefe
      if (window.gameState.bossFight && window.boss.health > 0) {
        if (Math.abs(proj.x - (window.boss.x + window.boss.width/2)) < proj.radius + window.boss.width/2 &&
            Math.abs(proj.y - (window.boss.y + window.boss.height/2)) < proj.radius + window.boss.height/2) {
          // Dañar al jefe
          window.boss.health--;
          window.projectiles.splice(i, 1);
          window.gameState.score += 100;
          createParticles(window.boss.x + window.boss.width/2, window.boss.y + window.boss.height/2, 20, '#FF69B4');
          updateBossHealth();
          
          // Hacer enojar al jefe si tiene poca vida
          if (window.boss.health <= 2 && !window.boss.enraged) {
            window.boss.enraged = true;
            window.boss.speed = 2;
            showHint("¡El lobo se ha enfurecido! ¡Ten cuidado!", 3000);
          }
          
          break;
        }
      }
    }
  }
  
  // Actualizar bolas de fuego del jefe
  for (let i = window.boss.fireballs.length - 1; i >= 0; i--) {
    const fireball = window.boss.fireballs[i];
    fireball.x += fireball.vx;
    
    // Eliminar bolas de fuego fuera de pantalla
    if (fireball.x < 0 || fireball.x > 800) {
      window.boss.fireballs.splice(i, 1);
      continue;
    }
    
    // Comprobar colisión con el oso
    if (Math.abs(fireball.x - (window.oso.x + window.oso.width/2)) < fireball.radius + window.oso.width/2 &&
        Math.abs(fireball.y - (window.oso.y + window.oso.height/2)) < fireball.radius + window.oso.height/2 &&
        window.oso.invincible <= 0) {
      takeDamage(1);
      window.boss.fireballs.splice(i, 1);
    }
  }
}

function updateParticles() {
  for (let i = window.particles.length - 1; i >= 0; i--) {
    const p = window.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    
    if (p.life <= 0) {
      window.particles.splice(i, 1);
    }
  }
}

function checkCollision(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

function takeDamage(amount) {
  if (window.oso.invincible > 0) return;
  
  window.gameState.lives -= amount;
  playSound("hurt");
  
  if (window.gameState.lives <= 0) {
    window.gameState.lives = 0;
    gameOver();
  }
  
  // Efecto de parpadeo al recibir daño
  window.oso.invincible = 60;
}

function createParticles(x, y, count, color) {
  for (let i = 0; i < count; i++) {
    window.particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      size: Math.random() * 5 + 2,
      color: color,
      life: 30,
      maxLife: 30
    });
  }
}

function updateUI() {
  // Actualizar puntuación
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = window.gameState.score;
  }
  
  // Actualizar vidas
  const livesElement = document.getElementById('lives');
  if (livesElement) {
    let livesText = '';
    for (let i = 0; i < window.gameState.lives; i++) {
      livesText += '❤️';
    }
    livesElement.textContent = livesText;
  }
  
  // Actualizar nivel
  const levelElement = document.getElementById('level');
  if (levelElement) {
    levelElement.textContent = window.gameState.currentLevel;
  }
  
  // Actualizar poder del unicornio
  const unicornPowerLevelElement = document.getElementById('unicornPowerLevel');
  if (unicornPowerLevelElement) {
    unicornPowerLevelElement.style.width = `${window.unicorn.power}%`;
  }
  
  // Actualizar corazones recolectados
  const heartCountElement = document.getElementById('heartCount');
  if (heartCountElement) {
    heartCountElement.textContent = window.gameState.heartsCollected;
  }
}

function checkGameConditions() {
  // Comprobar victoria en nivel normal
  if (!window.gameState.bossFight) {
    const allFriendsHugged = window.friends.every(friend => friend.hugged);
    if (allFriendsHugged && window.friends.length > 0) {
      levelComplete();
    }
  }
  
  // Comprobar victoria en jefe
  if (window.gameState.bossFight && window.boss.health <= 0) {
    victory();
  }
}

function levelComplete() {
  console.log("✅ Nivel completado");
  window.gameState.gameStarted = false;
  
  // Mostrar mensaje de nivel completado
  showHint("¡Nivel completado! Próximo nivel...", 3000);
  
  // Avanzar al siguiente nivel después de un breve retraso
  setTimeout(() => {
    const nextLevelKey = getNextLevel(window.gameState.currentLevel);
    if (nextLevelKey) {
      setupLevel(nextLevelKey);
      window.gameState.gameStarted = true;
    } else {
      // No hay más niveles, reiniciar juego
      startGame();
    }
  }, 3000);
}

function victory() {
  console.log("🎉 ¡Victoria!");
  window.gameState.gameStarted = false;
  
  const victoryScreen = document.getElementById('victoryScreen');
  const finalScore = document.getElementById('finalScore');
  const finalHearts = document.getElementById('finalHearts');
  
  if (victoryScreen) victoryScreen.style.display = 'flex';
  if (finalScore) finalScore.textContent = window.gameState.score;
  if (finalHearts) finalHearts.textContent = window.gameState.heartsCollected;
  
  // Reproducir sonido de victoria
  playSound("collect");
}

function gameOver() {
  console.log("💀 Game Over");
  window.gameState.gameStarted = false;
  
  showHint("¡Game Over! Presiona F5 para reintentar.", 5000);
}

function getNextLevel(currentLevel) {
  const levelKeys = Object.keys(window.LEVELS);
  const currentIndex = levelKeys.indexOf(currentLevel);
  
  if (currentIndex < levelKeys.length - 1) {
    return levelKeys[currentIndex + 1];
  }
  function nextLevel() {
  const nextLevelKey = getNextLevel(window.gameState.currentLevel);
  if (nextLevelKey) {
    // Ocultar pantalla de victoria
    const victoryScreen = document.getElementById('victoryScreen');
    if (victoryScreen) victoryScreen.style.display = 'none';
    
    // Configurar el siguiente nivel
    setupLevel(nextLevelKey);
    window.gameState.gameStarted = true;
  } else {
    // No hay más niveles, reiniciar juego
    startGame();
  }
}
  
  return null; // No hay más niveles
}
function drawBackground() {
  const ctx = window.gameCtx;
  const canvas = document.getElementById('gameCanvas');
  
  // Dibujar fondo según el nivel
  const bgImage = sprites[`background_${window.gameState.currentLevel.replace('-', '_')}`];
  if (bgImage && bgImage.complete) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    // Fondo por defecto si la imagen no está cargada
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#E0F7FA");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawPlatforms() {
  const ctx = window.gameCtx;
  
  for (let platform of window.platforms) {
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(platform.x, platform.y, platform.width, 5);
  }
}

function drawItems() {
  const ctx = window.gameCtx;
  
  for (let item of window.items) {
    if (!item.collected) {
      if (sprites.honey && sprites.honey.complete) {
        ctx.drawImage(sprites.honey, item.x, item.y, item.width, item.height);
      } else {
        ctx.fillStyle = '#FFB300';
        ctx.beginPath();
        ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawFriends() {
  const ctx = window.gameCtx;
  
  for (let friend of window.friends) {
    if (!friend.hugged && friend.sprite && friend.sprite.complete) {
      ctx.drawImage(friend.sprite, friend.x, friend.y, friend.width, friend.height);
    }
  }
}

function drawEnemies() {
  const ctx = window.gameCtx;
  
  for (let enemy of window.enemies) {
    if (enemy.sprite && enemy.sprite.complete) {
      // Enemigos siempre mirando hacia la izquierda
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(enemy.sprite, -enemy.x - enemy.width, enemy.y, enemy.width, enemy.height);
      ctx.restore();
    } else {
      // Placeholder si el sprite no está cargado
      ctx.fillStyle = '#F44336';
      ctx.beginPath();
      ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.width/2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawHearts() {
  const ctx = window.gameCtx;
  
  for (let heart of window.hearts) {
    if (!heart.collected) {
      if (sprites.heart && sprites.heart.complete) {
        ctx.drawImage(sprites.heart, heart.x, heart.y, heart.width, heart.height);
      } else {
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.moveTo(heart.x + heart.width/2, heart.y);
        ctx.bezierCurveTo(
          heart.x + heart.width, heart.y,
          heart.x + heart.width, heart.y + heart.height,
          heart.x + heart.width/2, heart.y + heart.height
        );
        ctx.bezierCurveTo(
          heart.x, heart.y + heart.height,
          heart.x, heart.y,
          heart.x + heart.width/2, heart.y
        );
        ctx.fill();
      }
    }
  }
}

function drawProjectiles() {
  const ctx = window.gameCtx;
  
  for (let proj of window.projectiles) {
    if (proj.type === 'unicorn') {
      ctx.fillStyle = '#9370DB';
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawFireballs() {
  const ctx = window.gameCtx;
  
  for (let fireball of window.boss.fireballs) {
    if (sprites.fire && sprites.fire.complete) {
      ctx.drawImage(sprites.fire, fireball.x - fireball.radius, fireball.y - fireball.radius, fireball.radius * 2, fireball.radius * 2);
    } else {
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.arc(fireball.x, fireball.y, fireball.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawParticles() {
  const ctx = window.gameCtx;
  
  for (let particle of window.particles) {
    ctx.globalAlpha = particle.life / particle.maxLife;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawOso() {
  const ctx = window.gameCtx;
  
  // Dibujar oso - CON UNICORNIO si está activo
  if (window.oso.hasUnicorn && sprites.osoyuni && sprites.osoyuni.complete) {
    // Usar imagen de oso con unicornio
    ctx.save();
    if (window.oso.direction === -1) {
      ctx.scale(-1, 1);
      ctx.drawImage(sprites.osoyuni, -window.oso.x - window.oso.width, window.oso.y, window.oso.width, window.oso.height);
    } else {
      ctx.drawImage(sprites.osoyuni, window.oso.x, window.oso.y, window.oso.width, window.oso.height);
    }
    ctx.restore();
  } else {
    // Dibujar oso normal
    let osoSprite = sprites.idle;
    
    if (window.oso.hugging) {
      osoSprite = sprites.hug;
    } else if (!window.oso.grounded) {
      osoSprite = sprites.jump;
    } else if (Math.abs(window.oso.vx) > 0) {
      osoSprite = window.oso.vx > window.oso.speed * 0.7 ? sprites.run : sprites.walk;
    }
    
    if (osoSprite && osoSprite.complete) {
      // Voltear sprite según la dirección
      ctx.save();
      if (window.oso.direction === -1) {
        ctx.scale(-1, 1);
        ctx.drawImage(osoSprite, -window.oso.x - window.oso.width, window.oso.y, window.oso.width, window.oso.height);
      } else {
        ctx.drawImage(osoSprite, window.oso.x, window.oso.y, window.oso.width, window.oso.height);
      }
      ctx.restore();
    } else {
      // Dibujar placeholder si el sprite no está cargado
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(window.oso.x, window.oso.y, window.oso.width, window.oso.height);
    }
  }
  
  // Efecto de abrazo
  if (window.oso.hugging) {
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(window.oso.x + window.oso.width/2, window.oso.y + window.oso.height/2, 60, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Efecto de invencibilidad (parpadeo)
  if (window.oso.invincible > 0 && window.oso.invincible % 10 < 5) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(window.oso.x, window.oso.y, window.oso.width, window.oso.height);
    ctx.globalAlpha = 1;
  }
}

function drawSpecialEffects() {
  // Aquí puedes agregar efectos especiales adicionales
}
