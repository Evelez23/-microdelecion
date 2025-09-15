// ============= CONFIGURACIÓN Y VARIABLES GLOBALES =============
const baseUrl = "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main";

// Configuración de recursos
const RESOURCES = {
  sprites: {
    idle: `${baseUrl}/img/oso/oso_idle.svg`,
    walk: `${baseUrl}/img/oso/oso_walk.svg`,
    jump: `${baseUrl}/img/oso/oso_jump.svg`,
    run: `${baseUrl}/img/oso/oso_run.svg`,
    hug: `${baseUrl}/img/oso/oso_hugging.svg`,
    sit: `${baseUrl}/img/oso/oso_sit.svg`,
    back: `${baseUrl}/img/oso/oso_back.svg`,
    portada: `${baseUrl}/img/oso/oso_portada.png`,
    celebration: `${baseUrl}/img/oso/celebracion.png`,
    heart: `${baseUrl}/img/oso/corazon.png`,
    uniyosocombat: `${baseUrl}/img/oso/uniyosocombat.png`,
    osoyuni: `${baseUrl}/img/Amigos/osoyuni.png`,
    
    // Enemigos
    lobo: `${baseUrl}/img/enemigos/lobo.svg`,
    loboferoz: `${baseUrl}/img/enemigos/loboferoz.png`,
    lobotriste: `${baseUrl}/img/enemigos/lobotriste.png`,
    fire: `${baseUrl}/img/enemigos/fire.png`,
    
    // Amigos
    ardilla: `${baseUrl}/img/Amigos/ardilla.png`,
    conejo: `${baseUrl}/img/Amigos/conejo.png`,
    pajarito: `${baseUrl}/img/Amigos/pajarito.png`,
    unien4patas: `${baseUrl}/img/Amigos/unien4patas.png`,
    unirshup: `${baseUrl}/img/Amigos/unirshup.png`,
    unirun: `${baseUrl}/img/Amigos/unirun.png`,
    lovepower: `${baseUrl}/img/Amigos/lovepower.png`,
    miel: `${baseUrl}/img/Amigos/miel.png`,
    
    // Fondos
    portada: `${baseUrl}/img/oso/oso_portada.png`,
    fondo1_1: `${baseUrl}/img/fondos/background_1_1.jpeg`,
    fondo1_2: `${baseUrl}/img/fondos/background_1_2.jpeg`,
    fondo1_3: `${baseUrl}/img/fondos/background_1_3.jpeg`,
    fondo2_1: `${baseUrl}/img/fondos/background_2_1.jpeg`,
    fondo2_2: `${baseUrl}/img/fondos/background_2_2.jpeg`,
    fondo2_3: `${baseUrl}/img/fondos/background_2_3.jpeg`,
    bosque1: `${baseUrl}/img/fondos/bosque1.jpg`,
    bosque2: `${baseUrl}/img/fondos/bosque2.jpg`,
    bosque3: `${baseUrl}/img/fondos/bosque3.jpg`,
    bosque4: `${baseUrl}/img/fondos/bosque4.jpg`,
    background_final: `${baseUrl}/img/fondos/background%20final.jpeg`
  },
  sounds: {
    intro: `${baseUrl}/sounds/intro.mp3`,
    background: `${baseUrl}/sounds/background.mp3.mp3`,
    collect: `${baseUrl}/sounds/collect.mp3.mp3`,
    enemy: `${baseUrl}/sounds/enemy.mp3.mp3`,
    hug: `${baseUrl}/sounds/hug.mp3.mp3`,
    hurt: `${baseUrl}/sounds/hurt.mp3.mp3`,
    jump: `${baseUrl}/sounds/jump.mp3.mp3`,
    batalla: `${baseUrl}/sounds/para%20la%20batalla.mp3`,
    powerup: `${baseUrl}/sounds/powerup.mp3.mp3`,
    shot: `${baseUrl}/sounds/shot.mp3.mp3`
  }
};

// Estados del juego
const GAME_STATES = {
  MENU: 0,
  LOADING: 1,
  PLAYING: 2,
  PAUSED: 3,
  VICTORY: 4,
  GAME_OVER: 5
};

// Variables globales
let canvas, ctx;
let gameState = GAME_STATES.MENU;
let currentLevel = 1;
let subLevel = 1;
let score = 0;
let lives = 3;
let player, enemies = [], friends = [], collectibles = [], platforms = [], projectiles = [];
let backgroundImages = {};
let sounds = {};
let sprites = {};
let unicornPower = 0;
let heartsCollected = 0;
let boss = null;
let bossHealth = 5;
let isBossEnraged = false;
let bossAttackTimer = 0;
let bossAttackInterval = 3000; // 3 segundos
let lastTime = 0;
let loadingProgress = 0;
let totalResources = 0;
let loadedResources = 0;
let backgroundMusic = null;

// ============= INICIALIZACIÓN =============
function init() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  
  // Ajustar tamaño del canvas
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Configurar eventos
  setupEventListeners();
  
  // Mostrar pantalla inicial
  showStartScreen();
}

function resizeCanvas() {
  const container = document.getElementById('gameContainer');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  // Redibujar si estamos en el juego
  if (gameState === GAME_STATES.PLAYING) {
    draw();
  }
}

function setupEventListeners() {
  // Botón de inicio
  document.getElementById('startButton').addEventListener('click', startGame);
  
  // Botón de sonido
  document.getElementById('soundToggle').addEventListener('click', toggleSound);
  
  // Botones de victoria
  document.getElementById('nextLevelBtn').addEventListener('click', restartGame);
  
  // Controles de teclado
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  // Controles táctiles para móviles
  setupTouchControls();
}

// ============= GESTIÓN DE RECURSOS =============
async function loadResources() {
  gameState = GAME_STATES.LOADING;
  document.getElementById('loadingScreen').style.display = 'flex';
  
  // Calcular recursos totales
  totalResources = Object.keys(RESOURCES.sprites).length + Object.keys(RESOURCES.sounds).length;
  
  try {
    // Cargar sprites
    for (const [key, url] of Object.entries(RESOURCES.sprites)) {
      await loadImage(key, url);
      updateLoadingProgress();
    }
    
    // Cargar sonidos
    for (const [key, url] of Object.entries(RESOURCES.sounds)) {
      await loadSound(key, url);
      updateLoadingProgress();
    }
    
    // Configurar la imagen de victoria
    document.getElementById('victoryImage').src = sprites.uniyosocombat.src;
    
    // Ocultar pantalla de carga
    document.getElementById('loadingScreen').style.display = 'none';
    
    // Iniciar juego
    initGame();
    
  } catch (error) {
    console.error("Error cargando recursos:", error);
    document.getElementById('loadingDetails').innerHTML = 
      `<div class="error-message">Error cargando recursos: ${error.message}</div>`;
  }
}

function loadImage(key, url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      sprites[key] = img;
      resolve();
    };
    img.onerror = () => reject(new Error(`Error cargando imagen: ${url}`));
    img.src = url;
  });
}

function loadSound(key, url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener('canplaythrough', () => {
      sounds[key] = audio;
      resolve();
    });
    audio.onerror = () => reject(new Error(`Error cargando sonido: ${url}`));
    audio.src = url;
  });
}

function updateLoadingProgress() {
  loadedResources++;
  loadingProgress = Math.floor((loadedResources / totalResources) * 100);
  document.getElementById('loadingProgress').style.width = `${loadingProgress}%`;
  document.getElementById('loadingText').textContent = `${loadingProgress}%`;
  
  const details = document.getElementById('loadingDetails');
  if (loadingProgress % 10 === 0) {
    const messages = [
      "Cargando recursos gráficos...",
      "Preparando personajes...",
      "Cargando efectos de sonido...",
      "Generando niveles...",
      "¡Casi listo para la aventura!"
    ];
    details.textContent = messages[Math.floor(Math.random() * messages.length)];
  }
}

// ============= PANTALLAS DEL JUEGO =============
function showStartScreen() {
  document.getElementById('startScreen').style.display = 'flex';
  document.getElementById('coverImage').src = sprites.portada.src;
  
  // Reproducir música de introducción si está disponible
  if (sounds.intro) {
    sounds.intro.loop = true;
    sounds.intro.volume = 0.7;
    sounds.intro.play().catch(e => console.log("Audio bloqueado hasta interacción del usuario"));
  }
}

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  
  // Detener música de introducción si está sonando
  if (sounds.intro) {
    sounds.intro.pause();
    sounds.intro.currentTime = 0;
  }
  
  // Cargar recursos
  loadResources();
}

function showVictoryScreen() {
  gameState = GAME_STATES.VICTORY;
  document.getElementById('victoryScreen').style.display = 'flex';
  document.getElementById('finalScore').textContent = score;
  document.getElementById('finalHearts').textContent = heartsCollected;
  
  // Reproducir sonido de victoria si está disponible
  if (sounds.powerup) {
    sounds.powerup.currentTime = 0;
    sounds.powerup.play();
  }
}

// ============= LÓGICA PRINCIPAL DEL JUEGO =============
function initGame() {
  gameState = GAME_STATES.PLAYING;
  
  // Inicializar jugador
  player = {
    x: 100,
    y: canvas.height - 150,
    width: 80,
    height: 100,
    speed: 5,
    jumpForce: 15,
    velocityY: 0,
    isJumping: false,
    isOnGround: false,
    facing: 'right',
    state: 'idle',
    sprite: sprites.idle,
    frame: 0,
    frameCounter: 0
  };
  
  // Configurar nivel
  setupLevel(currentLevel, subLevel);
  
  // Iniciar música de fondo
  if (sounds.background) {
    backgroundMusic = sounds.background;
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.6;
    backgroundMusic.play().catch(e => console.log("Audio bloqueado hasta interacción del usuario"));
  }
  
  // Iniciar bucle del juego
  requestAnimationFrame(gameLoop);
}

function setupLevel(level, subLevel) {
  // Reiniciar arrays
  enemies = [];
  friends = [];
  collectibles = [];
  platforms = [];
  projectiles = [];
  boss = null;
  bossHealth = 5;
  isBossEnraged = false;
  
  // Actualizar indicador de nivel
  const levelText = `Nivel ${level}-${subLevel}`;
  document.getElementById('level').textContent = levelText;
  document.getElementById('levelIndicator').textContent = levelText;
  
  // Configurar nivel según el número
  if (level === 1) {
    // Niveles 1-1, 1-2, 1-3
    setupLevel1(subLevel);
  } else if (level === 2) {
    // Niveles 2-1, 2-2, 2-3 (batalla con el lobo)
    setupLevel2(subLevel);
    
    // Cambiar música en el nivel 2-3
    if (subLevel === 3 && sounds.batalla && backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic = sounds.batalla;
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.7;
      backgroundMusic.play();
    }
  }
  
  // Mostrar barra de salud del jefe en niveles de jefe
  if ((level === 2 && subLevel === 3) || level === 3) {
    document.getElementById('bossHealth').style.display = 'block';
    updateBossHealth();
  } else {
    document.getElementById('bossHealth').style.display = 'none';
  }
  
  // Mostrar poder del unicornio si está disponible
  if (unicornPower > 0) {
    document.getElementById('unicornPower').style.display = 'block';
    document.getElementById('unicornPowerLevel').style.width = `${unicornPower}%`;
  }
  
  // Mostrar contador de corazones si se han recolectado
  if (heartsCollected > 0) {
    document.getElementById('heartsCollected').style.display = 'block';
    document.getElementById('heartCount').textContent = heartsCollected;
  }
}

function setupLevel1(subLevel) {
  // Configuración para los niveles 1-1, 1-2, 1-3
  // (Implementar según la lógica de tu juego)
  
  // Plataformas básicas
  platforms = [
    {x: 0, y: canvas.height - 50, width: canvas.width, height: 50},
    {x: 200, y: canvas.height - 150, width: 100, height: 20},
    {x: 400, y: canvas.height - 200, width: 100, height: 20},
    {x: 600, y: canvas.height - 250, width: 100, height: 20}
  ];
  
  // Amigos (animales del bosque)
  friends = [
    {x: 250, y: canvas.height - 170, width: 50, height: 50, type: 'ardilla', hugged: false},
    {x: 450, y: canvas.height - 220, width: 50, height: 50, type: 'conejo', hugged: false},
    {x: 650, y: canvas.height - 270, width: 50, height: 50, type: 'pajarito', hugged: false}
  ];
  
  // Coleccionables (miel)
  collectibles = [
    {x: 300, y: canvas.height - 200, width: 30, height: 30, type: 'miel', collected: false},
    {x: 500, y: canvas.height - 250, width: 30, height: 30, type: 'miel', collected: false}
  ];
  
  // Enemigos básicos
  enemies = [
    {x: 350, y: canvas.height - 80, width: 60, height: 60, type: 'basic', speed: 2, direction: 1},
    {x: 550, y: canvas.height - 80, width: 60, height: 60, type: 'basic', speed: 2, direction: -1}
  ];
}

function setupLevel2(subLevel) {
  // Configuración para los niveles 2-1, 2-2, 2-3
  // (Implementar según la lógica de tu juego)
  
  // Plataformas para nivel de batalla
  platforms = [
    {x: 0, y: canvas.height - 50, width: canvas.width, height: 50}
  ];
  
  if (subLevel === 3) {
    // Nivel de batalla con el lobo
    boss = {
      x: canvas.width - 150,
      y: canvas.height - 150,
      width: 120,
      height: 120,
      type: 'lobo',
      state: 'idle',
      attackTimer: 0,
      attackCooldown: 120,
      fireBalls: []
    };
    
    // Mostrar advertencia de fuego
    document.getElementById('fireWarning').style.display = 'block';
    
    // Ocultar advertencia después de 3 segundos
    setTimeout(() => {
      document.getElementById('fireWarning').style.display = 'none';
    }, 3000);
  } else {
    // Niveles 2-1 y 2-2
    enemies = [
      {x: 300, y: canvas.height - 80, width: 70, height: 70, type: 'advanced', speed: 3, direction: 1},
      {x: 500, y: canvas.height - 80, width: 70, height: 70, type: 'advanced', speed: 3, direction: -1}
    ];
    
    // Coleccionables (corazones)
    collectibles = [
      {x: 200, y: canvas.height - 200, width: 40, height: 40, type: 'heart', collected: false},
      {x: 400, y: canvas.height - 200, width: 40, height: 40, type: 'heart', collected: false},
      {x: 600, y: canvas.height - 200, width: 40, height: 40, type: 'heart', collected: false}
    ];
  }
}

function gameLoop(timestamp) {
  // Calcular delta time
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  // Actualizar y dibujar el juego
  if (gameState === GAME_STATES.PLAYING) {
    update(deltaTime);
    draw();
  }
  
  // Continuar el bucle
  requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
  // Actualizar jugador
  updatePlayer();
  
  // Actualizar enemigos
  updateEnemies();
  
  // Actualizar proyectiles
  updateProjectiles();
  
  // Actualizar jefe (si existe)
  if (boss) {
    updateBoss(deltaTime);
  }
  
  // Verificar colisiones
  checkCollisions();
  
  // Verificar condiciones de victoria/derrota
  checkGameConditions();
}

function draw() {
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar fondo según el nivel
  drawBackground();
  
  // Dibujar plataformas
  drawPlatforms();
  
  // Dibujar coleccionables
  drawCollectibles();
  
  // Dibujar amigos
  drawFriends();
  
  // Dibujar enemigos
  drawEnemies();
  
  // Dibujar proyectiles
  drawProjectiles();
  
  // Dibujar jefe
  if (boss) {
    drawBoss();
  }
  
  // Dibujar jugador
  drawPlayer();
  
  // Dibujar efectos especiales
  drawSpecialEffects();
}

// ============= ACTUALIZACIÓN DE ENTIDADES =============
function updatePlayer() {
  // (Implementar lógica de movimiento y física del jugador)
}

function updateEnemies() {
  // (Implementar lógica de movimiento de enemigos)
}

function updateProjectiles() {
  // (Implementar lógica de movimiento de proyectiles)
}

function updateBoss(deltaTime) {
  // Lógica específica del jefe (lobo)
  if (!boss) return;
  
  boss.attackTimer += deltaTime;
  
  // Ataque del jefe cada cierto tiempo
  if (boss.attackTimer > boss.attackCooldown) {
    bossAttack();
    boss.attackTimer = 0;
    
    // Reducir el tiempo entre ataques si está enfurecido
    if (isBossEnraged && boss.attackCooldown > 60) {
      boss.attackCooldown -= 10;
    }
  }
  
  // Mover bolas de fuego
  for (let i = boss.fireBalls.length - 1; i >= 0; i--) {
    const fireBall = boss.fireBalls[i];
    fireBall.x += fireBall.speedX;
    fireBall.y += fireBall.speedY;
    
    // Eliminar bolas de fuego que salen de la pantalla
    if (fireBall.x < -50 || fireBall.x > canvas.width + 50 ||
        fireBall.y < -50 || fireBall.y > canvas.height + 50) {
      boss.fireBalls.splice(i, 1);
    }
  }
}

function bossAttack() {
  if (!boss) return;
  
  // Crear una nueva bola de fuego
  const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
  const speed = 5;
  
  boss.fireBalls.push({
    x: boss.x + boss.width / 2,
    y: boss.y + boss.height / 2,
    radius: 20,
    speedX: Math.cos(angle) * speed,
    speedY: Math.sin(angle) * speed,
    type: 'fire'
  });
  
  // Reproducir sonido de ataque si está disponible
  if (sounds.shot) {
    sounds.shot.currentTime = 0;
    sounds.shot.play();
  }
}

// ============= DIBUJADO DE ENTIDADES =============
function drawBackground() {
  // Dibujar fondo según el nivel actual
  let bgImage;
  
  if (currentLevel === 1) {
    if (subLevel === 1) bgImage = sprites.fondo1_1;
    else if (subLevel === 2) bgImage = sprites.fondo1_2;
    else bgImage = sprites.fondo1_3;
  } else if (currentLevel === 2) {
    if (subLevel === 1) bgImage = sprites.fondo2_1;
    else if (subLevel === 2) bgImage = sprites.fondo2_2;
    else bgImage = sprites.fondo2_3;
  }
  
  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    // Fondo por defecto
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawPlayer() {
  // (Implementar dibujado del jugador con sprites)
}

function drawBoss() {
  if (!boss) return;
  
  // Determinar qué sprite usar según el estado del jefe
  let bossSprite;
  if (isBossEnraged) {
    bossSprite = sprites.loboferoz;
    
    // Aplicar efecto visual de enfurecimiento
    ctx.save();
    if (Math.floor(boss.attackTimer / 200) % 2 === 0) {
      ctx.filter = 'brightness(1.5)';
    }
  } else if (bossHealth <= 2) {
    bossSprite = sprites.lobotriste;
  } else {
    bossSprite = sprites.lobo;
  }
  
  // Dibujar el jefe
  if (bossSprite) {
    ctx.drawImage(bossSprite, boss.x, boss.y, boss.width, boss.height);
  }
  
  // Dibujar bolas de fuego
  for (const fireBall of boss.fireBalls) {
    if (sprites.fire) {
      ctx.drawImage(
        sprites.fire, 
        fireBall.x - fireBall.radius, 
        fireBall.y - fireBall.radius,
        fireBall.radius * 2,
        fireBall.radius * 2
      );
    } else {
      // Dibujar círculo de fuego si no hay sprite
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.arc(fireBall.x, fireBall.y, fireBall.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(fireBall.x, fireBall.y, fireBall.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  if (isBossEnraged) {
    ctx.restore();
  }
}

function drawSpecialEffects() {
  // (Implementar efectos especiales como destellos)
}

// ============= COLISIONES Y FÍSICA =============
function checkCollisions() {
  // (Implementar detección de colisiones)
}

// ============= MANEJO DE EVENTOS =============
function handleKeyDown(e) {
  // (Implementar controles de teclado)
}

function handleKeyUp(e) {
  // (Implementar liberación de teclas)
}

function setupTouchControls() {
  // (Implementar controles táctiles para dispositivos móviles)
}

// ============= EFECTOS ESPECIALES =============
function flashEffect(target) {
  // Aplicar efecto de destello
  target.classList.add('flash-effect');
  
  // Remover la clase después de la animación
  setTimeout(() => {
    target.classList.remove('flash-effect');
  }, 500);
}

function transformToUnicorn() {
  // Cambiar al sprite de oso + unicornio
  player.sprite = sprites.osoyuni;
  player.width *= 1.2;
  player.height *= 1.2;
  
  // Aplicar efecto visual de transformación
  const playerElement = document.getElementById('gameContainer');
  playerElement.classList.add('unicorn-transformation');
  
  // Reproducir sonido de transformación si está disponible
  if (sounds.powerup) {
    sounds.powerup.currentTime = 0;
    sounds.powerup.play();
  }
  
  // Aumentar poder del unicornio
  unicornPower = 100;
  document.getElementById('unicornPower').style.display = 'block';
  document.getElementById('unicornPowerLevel').style.width = '100%';
}

function updateBossHealth() {
  const healthBar = document.getElementById('bossHealthBar');
  const healthText = document.getElementById('bossHealthText');
  
  if (healthBar && healthText) {
    const percentage = (bossHealth / 5) * 100;
    healthBar.style.width = `${percentage}%`;
    healthText.textContent = `${bossHealth}/5`;
    
    // Cambiar a modo enfurecido si la salud es baja
    if (bossHealth <= 2 && !isBossEnraged) {
      isBossEnraged = true;
      healthBar.classList.add('boss-enraged');
      
      // Efecto de destello en el lobo
      flashEffect(document.getElementById('bossHealth'));
    }
  }
}

// ============= UTILIDADES =============
function toggleSound() {
  const soundButton = document.getElementById('soundToggle');
  const isMuted = soundButton.textContent === '🔇';
  
  if (isMuted) {
    // Activar sonido
    soundButton.textContent = '🔊';
    Howler.mute(false);
    
    if (backgroundMusic) {
      backgroundMusic.muted = false;
    }
    
    // Reactivar todos los sonidos
    for (const sound of Object.values(sounds)) {
      sound.muted = false;
    }
  } else {
    // Silenciar sonido
    soundButton.textContent = '🔇';
    Howler.mute(true);
    
    if (backgroundMusic) {
      backgroundMusic.muted = true;
    }
    
    // Silenciar todos los sonidos
    for (const sound of Object.values(sounds)) {
      sound.muted = true;
    }
  }
}

function checkGameConditions() {
  // Verificar victoria
  if (bossHealth <= 0) {
    showVictoryScreen();
    return;
  }
  
  // Verificar derrota
  if (lives <= 0) {
    gameState = GAME_STATES.GAME_OVER;
    // Mostrar pantalla de game over
  }
}

function restartGame() {
  // Reiniciar variables del juego
  currentLevel = 1;
  subLevel = 1;
  score = 0;
  lives = 3;
  unicornPower = 0;
  heartsCollected = 0;
  
  // Actualizar UI
  document.getElementById('score').textContent = score;
  document.getElementById('lives').textContent = '❤️❤️❤️';
  document.getElementById('unicornPower').style.display = 'none';
  document.getElementById('heartsCollected').style.display = 'none';
  document.getElementById('victoryScreen').style.display = 'none';
  
  // Reiniciar juego
  initGame();
}

// ============= INICIAR JUEGO =============
// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
