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
function showStorybook() {
  const startScreen = document.getElementById('startScreen');
  const storybook = document.getElementById('storybook');
  
  if (startScreen) startScreen.style.display = 'none';
  if (storybook) storybook.style.display = 'flex';
}

function backToMenu() {
  const storybook = document.getElementById('storybook');
  const startScreen = document.getElementById('startScreen');
  
  if (storybook) storybook.style.display = 'none';
  if (startScreen) startScreen.style.display = 'flex';
}

function startGame() {
  const storybook = document.getElementById('storybook');
  if (storybook) storybook.style.display = 'none';
  
  window.gameState.gameStarted = true;
  window.gameState.score = 0;
  window.gameState.lives = 3;
  window.gameState.heartsCollected = 0;
  
  // Iniciar música de fondo si está habilitada
  if (window.gameState.soundEnabled && sounds.background) {
    sounds.background.play().catch(e => console.log("Audio autoplay prevented: ", e));
  }
  
  // Configurar nivel inicial
  setupLevel("1-1");
  
  // Iniciar bucle del juego
  if (!window.gameLoopRunning) {
    window.gameLoopRunning = true;
    gameLoop();
  }
}

function nextLevel() {
  const victoryScreen = document.getElementById('victoryScreen');
  if (victoryScreen) victoryScreen.style.display = 'none';
  
  const nextLevelKey = getNextLevel(window.gameState.currentLevel);
  
  if (nextLevelKey) {
    setupLevel(nextLevelKey);
  } else {
    // Reiniciar juego si no hay más niveles
    startGame();
  }
}

function toggleSound() {
  window.gameState.soundEnabled = !window.gameState.soundEnabled;
  const soundToggle = document.getElementById('soundToggle');
  
  if (soundToggle) {
    soundToggle.textContent = window.gameState.soundEnabled ? "🔊" : "🔇";
  }
  
  if (window.gameState.soundEnabled && sounds.background) {
    sounds.background.play().catch(e => console.log("Audio autoplay prevented: ", e));
  } else if (sounds.background) {
    sounds.background.pause();
  }
}

function showHint(text, duration) {
  const hintElement = document.getElementById('hint');
  if (!hintElement) return;
  
  hintElement.textContent = text;
  hintElement.style.opacity = '1';
  
  setTimeout(() => {
    hintElement.style.opacity = '0';
  }, duration);
}

function playSound(soundName) {
  if (window.gameState.soundEnabled && sounds[soundName]) {
    try {
      const sound = new Audio(sounds[soundName].src);
      sound.volume = sounds[soundName].volume;
      sound.play().catch(e => console.log("Sound error: ", e));
    } catch (e) {
      console.log("Error reproduciendo sonido: ", e);
    }
  }
}

// ============= FUNCIONES DE CARGA =============
function loadResources() {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingProgress = document.getElementById('loadingProgress');
  const loadingText = document.getElementById('loadingText');
  const loadingDetails = document.getElementById('loadingDetails');
  const startScreen = document.getElementById('startScreen');
  const coverImage = document.getElementById('coverImage');
  
  // Cargar imagen de portada directamente primero
  if (coverImage) {
    coverImage.src = "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/oso/oso_portada.png";
  }
  
  for (let key in imageUrls) {
    sprites[key].onload = () => {
      loadedResources++;
      const progress = Math.floor((loadedResources / totalResources) * 100);
      if (loadingProgress) loadingProgress.style.width = `${progress}%`;
      if (loadingText) loadingText.textContent = `${progress}%`;
      
      if (loadedResources === totalResources) {
        setTimeout(() => {
          if (loadingScreen) loadingScreen.style.display = "none";
          if (startScreen) startScreen.style.display = "flex";
        }, 500);
      }
    };
    
    sprites[key].onerror = () => {
      loadedResources++;
      failedResources++;
      
      const progress = Math.floor((loadedResources / totalResources) * 100);
      if (loadingProgress) loadingProgress.style.width = `${progress}%`;
      if (loadingText) loadingText.textContent = `${progress}%`;
      
      if (loadingDetails) {
        loadingDetails.innerHTML += `<p class="error-message">Error cargando: ${key} - <a href="${imageUrls[key]}" target="_blank">Ver URL</a></p>`;
      }
      
      if (loadedResources === totalResources) {
        if (loadingScreen) loadingScreen.style.display = "none";
        if (startScreen) startScreen.style.display = "flex";
        
        // Mostrar advertencia si hay errores
        if (failedResources > 0) {
          alert(`⚠️ Algunos recursos no se pudieron cargar (${failedResources}/${totalResources}). El juego puede no verse correctamente.`);
        }
      }
    };
    
    sprites[key].src = imageUrls[key];
  }
}

// ============= FUNCIONES PRINCIPALES DEL JUEGO =============
function setupLevel(levelKey) {
  console.log(`🎯 Configurando nivel: ${levelKey}`);
  
  const level = window.LEVELS[levelKey];
  if (!level) {
    console.error("❌ Nivel no encontrado:", levelKey);
    return;
  }
  
  window.gameState.currentLevel = levelKey;
  window.gameState.bossFight = level.hasBoss;
  
  // Actualizar UI
  const levelElement = document.getElementById('level');
  if (levelElement) {
    levelElement.textContent = `${levelKey} - ${level.name}`;
  }
  
  const levelIndicator = document.getElementById('levelIndicator');
  if (levelIndicator) {
    levelIndicator.textContent = `Nivel ${levelKey}`;
  }
  
  if (level.hasBoss) {
    setupBossLevel();
  } else {
    setupNormalLevel(level);
  }
}
function setupNormalLevel(level) {
  console.log("🌲 Configurando nivel normal");
  
  // Ocultar elementos de jefe
  const bossHealthElement = document.getElementById('bossHealth');
  const fireWarningElement = document.getElementById('fireWarning');
  const heartsCollectedElement = document.getElementById('heartsCollected');
  const unicornPowerElement = document.getElementById('unicornPower');
  
  if (bossHealthElement) bossHealthElement.style.display = 'none';
  if (fireWarningElement) fireWarningElement.style.display = 'none';
  if (heartsCollectedElement) heartsCollectedElement.style.display = 'none';
  if (unicornPowerElement) unicornPowerElement.style.display = 'none';
  
  // Configurar plataformas básicas
  window.platforms = [
    { x: 0, y: 450, width: 800, height: 50 },
    { x: 200, y: 350, width: 100, height: 20 },
    { x: 400, y: 300, width: 100, height: 20 },
    { x: 600, y: 350, width: 100, height: 20 }
  ];
  
  // Configurar amigos
  window.friends = [];
  for (let i = 0; i < level.friends; i++) {
    const friendType = i % 3;
    let sprite;
    let friendName;
    
    switch (friendType) {
      case 0:
        sprite = sprites.squirrel;
        friendName = "ardilla";
        break;
      case 1:
        sprite = sprites.rabbit;
        friendName = "conejo";
        break;
      case 2:
        sprite = sprites.bird;
        friendName = "pájaro";
        break;
    }
    
    window.friends.push({
      x: 150 + i * 150,
      y: 380,
      width: 50,
      height: 50,
      sprite: sprite,
      type: friendType,
      name: friendName,
      hugged: false,
      floating: 0,
      floatDir: Math.random() > 0.5 ? 1 : -1
    });
  }
  
  // Configurar enemigos básicos
  window.enemies = [];
  for (let i = 0; i < level.enemies; i++) {
    const enemyType = i % 3;
    let sprite;
    
    switch (enemyType) {
      case 0:
        sprite = sprites.enemy1;
        break;
      case 1:
        sprite = sprites.enemy2;
        break;
      case 2:
        sprite = sprites.enemy3;
        break;
    }
    
    window.enemies.push({
      x: 600 + (i * 100),
      y: 380,
      width: 60,
      height: 60,
      sprite: sprite,
      direction: -1,
      speed: 1 + Math.random() * 0.5,
      damage: 1,
      moveRange: 100 + Math.random() * 50,
      startX: 600 + (i * 100),
      moveCooldown: 0
    });
  }
  
  // Configurar items (miel)
  window.items = [];
  for (let i = 0; i < level.items; i++) {
    window.items.push({
      x: 150 + i * 200,
      y: 250,
      width: 30,
      height: 30,
      collected: false
    });
  }
  
  // Configurar corazones
  window.hearts = [];
  for (let i = 0; i < 3; i++) {
    window.hearts.push({
      x: 250 + i * 200,
      y: 300,
      width: 30,
      height: 30,
      collected: false
    });
  }
  
  // Configurar posición del oso
  window.oso.x = 100;
  window.oso.y = 380;
  window.oso.vx = 0;
  window.oso.vy = 0;
  window.oso.grounded = false;
  window.oso.hugging = false;
  window.oso.hasUnicorn = false;
  window.oso.invincible = 120;
  
  // Configurar unicornio
  window.unicorn.active = false;
  window.unicorn.power = 0;
  
  // Limpiar proyectiles y partículas
  window.projectiles = [];
  window.particles = [];
  
  // Mostrar indicación
  showHint("Acércate a los amigos y presiona ESPACIO para abrazarlos", 5000);
}

function setupBossLevel() {
  console.log("🐺 Configurando nivel de jefe");
  
  // Mostrar elementos de jefe
  const bossHealthElement = document.getElementById('bossHealth');
  const heartsCollectedElement = document.getElementById('heartsCollected');
  const unicornPowerElement = document.getElementById('unicornPower');
  
  if (bossHealthElement) bossHealthElement.style.display = 'block';
  if (heartsCollectedElement) heartsCollectedElement.style.display = 'block';
  
  // Configurar plataformas
  window.platforms = [
    { x: 0, y: 450, width: 800, height: 50 }
  ];
  
  // Configurar jefe
  window.boss = {
    x: 600, y: 350,
    width: 120, height: 120,
    health: 5,
    maxHealth: 5,
    enraged: false,
    phase: 1,
    attackCooldown: 100,
    warningTimer: 0,
    fireballs: []
  };
  
  // Configurar posición del oso
  window.oso.x = 100;
  window.oso.y = 380;
  window.oso.vx = 0;
  window.oso.vy = 0;
  window.oso.grounded = false;
  window.oso.hugging = false;
  window.oso.invincible = 120;
  
  // Limpiar otros elementos
  window.friends = [];
  window.enemies = [];
  window.items = [];
  window.projectiles = [];
  window.particles = [];
  
  // Mostrar indicación
  showHint("¡Derrota al Lobo Feroz! Recolecta corazones para invocar al Unicornio.", 5000);
  
  // Actualizar salud del jefe
  updateBossHealth();
}

function updateBossHealth() {
  const bossHealthBar = document.getElementById('bossHealthBar');
  const bossHealthText = document.getElementById('bossHealthText');
  
  if (bossHealthBar && bossHealthText) {
    const healthPercent = (window.boss.health / window.boss.maxHealth) * 100;
    bossHealthBar.style.width = `${healthPercent}%`;
    bossHealthText.textContent = `${window.boss.health}/${window.boss.maxHealth}`;
    
    // Aplicar efecto de enfado si tiene poca vida
    if (window.boss.health <= 2 && !window.boss.enraged) {
      bossHealthBar.parentElement.classList.add('boss-enraged');
    }
  }
}

function gameLoop() {
  if (window.gameState.gameStarted) {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

function update() {
  // Esta función necesita ser implementada
  console.log("Actualizando juego...");
}

function draw() {
  // Esta función necesita ser implementada
  console.log("Dibujando juego...");
}
// ... (resto de las funciones del juego)

// ============= INICIAR JUEGO =============
console.log("Juego Oso Abrazos cargado correctamente");
// Después de cargar los recursos, verifica cuales fallaron
function createMissingSprites() {
  const missingSprites = [];
  
  for (let key in sprites) {
    if (!sprites[key].complete || sprites[key].naturalHeight === 0) {
      missingSprites.push(key);
      console.warn("Creando placeholder para:", key);
      
      // Crear un placeholder de color según el tipo
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      if (key.includes('background') || key.includes('fondo')) {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 100, 100);
      } else if (key.includes('oso')) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, 100, 100);
      } else if (key.includes('lobo')) {
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 100, 100);
      } else {
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(0, 0, 100, 100);
      }
      
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText(key, 10, 50);
      
      sprites[key].src = canvas.toDataURL();
    }
  }
  
  if (missingSprites.length > 0) {
    console.log("Sprites con placeholders:", missingSprites);
  }
}
function loadResources() {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingProgress = document.getElementById('loadingProgress');
  const loadingText = document.getElementById('loadingText');
  const loadingDetails = document.getElementById('loadingDetails');
  const startScreen = document.getElementById('startScreen');
  const coverImage = document.getElementById('coverImage');
  
  // Cargar imagen de portada directamente primero
  if (coverImage) {
    coverImage.src = `${baseUrl}/img/oso/oso_portada.png`;
    console.log("Cargando portada:", `${baseUrl}/img/oso/oso_portada.png`);
  }
  
  for (let key in imageUrls) {
    console.log("Intentando cargar:", key, "desde:", imageUrls[key]);
    
    sprites[key].onload = () => {
      loadedResources++;
      const progress = Math.floor((loadedResources / totalResources) * 100);
      if (loadingProgress) loadingProgress.style.width = `${progress}%`;
      if (loadingText) loadingText.textContent = `${progress}%`;
      
      console.log("✅ Imagen cargada:", key);
      
      if (loadedResources === totalResources) {
        setTimeout(() => {
          if (loadingScreen) loadingScreen.style.display = "none";
          if (startScreen) startScreen.style.display = "flex";
          console.log("✅ Todos los recursos cargados");
        }, 500);
      }
    };
    
    sprites[key].onerror = () => {
      loadedResources++;
      failedResources++;
      
      const progress = Math.floor((loadedResources / totalResources) * 100);
      if (loadingProgress) loadingProgress.style.width = `${progress}%`;
      if (loadingText) loadingText.textContent = `${progress}%`;
      
      console.error("❌ Error cargando:", key, "desde:", imageUrls[key]);
      
      if (loadingDetails) {
        loadingDetails.innerHTML += `<p class="error-message">Error cargando: ${key} - <a href="${imageUrls[key]}" target="_blank">Ver URL</a></p>`;
      }
      
      if (loadedResources === totalResources) {
        if (loadingScreen) loadingScreen.style.display = "none";
        if (startScreen) startScreen.style.display = "flex";
        
        // Mostrar advertencia si hay errores
        if (failedResources > 0) {
          alert(`⚠️ Algunos recursos no se pudieron cargar (${failedResources}/${totalResources}). El juego puede no verse correctamente.`);
        }
      }
    };
    
    sprites[key].src = imageUrls[key];
  }
}
