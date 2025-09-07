// game.js - Lógica principal del juego

// Variables globales
let canvas, ctx;
let scoreElement, livesElement, levelElement, startScreen, startButton;
let loadingScreen, loadingProgress, loadingText, coverImage, hintElement;
let soundToggle, unicornPowerElement, unicornPowerLevelElement;

// Hacer funciones globales asignándolas a window
window.startGame = function() {
  gameState.gameStarted = true;
  startScreen.style.display = "none";
  resetLevel();
  
  showHint("Acércate a los amigos y presiona ESPACIO para abrazarlos", 5000);
  
  gameLoop();
};

window.resetLevel = function() {
  oso.x = 100;
  oso.y = 380;
  oso.vx = 0;
  oso.vy = 0;
  oso.action = "idle";
  oso.hugging = false;
  oso.invincible = 0;
  
  oso.hasUnicorn = false;
  unicornPowerElement.style.display = 'none';

  friends = [];
  const friendTypes = ['ardilla', 'conejo', 'pajarito'];
  for (let i = 0; i < 5 + gameState.level; i++) {
    const typeIndex = Math.floor(Math.random() * friendTypes.length);
    friends.push({
      x: Math.random() * 700 + 50,
      y: 380,
      width: 60,
      height: 60,
      hugged: false,
      type: friendTypes[typeIndex],
      floating: 0,
      floatDir: Math.random() > 0.5 ? 1 : -1
    });
  }
  
  enemies = [];
  if (gameState.level > 1) {
    const enemyTypes = ['Enemigos_01', 'Enemigos_02', 'Enemigos_03'];
    for (let i = 0; i < gameState.level - 1; i++) {
      const typeIndex = Math.floor(Math.random() * enemyTypes.length);
      enemies.push({
        x: Math.random() * 700 + 50,
        y: 380,
        width: 50,
        height: 50,
        vx: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()),
        type: enemyTypes[typeIndex]
      });
    }
  }
  
  items = [];
  for (let i = 0; i < 3 + gameState.level; i++) {
    items.push({
      x: Math.random() * 700 + 50,
      y: Math.random() * 300 + 100,
      width: 30,
      height: 30,
      collected: false,
      type: 'miel'
    });
  }

  if (gameState.level >= 2) {
      items.push({
          x: Math.random() * 700 + 50,
          y: 380,
          width: 80,
          height: 80,
          collected: false,
          type: 'osoyuni'
      });
      showHint("¡Mira! Un unicornio mágico ha aparecido. Acércate a él para montarlo", 5000);
  }
};

window.showHint = function(text, duration) {
  hintElement.textContent = text;
  hintElement.style.display = "block";
  hintTimer = duration / 16.67;
};

window.shootHeart = function() {
  if (unicorn.cooldown <= 0 && unicorn.power > 0) {
      let heartSpeed = 10;
      let heartSize = 25;
      let heartVx = oso.direction * heartSpeed;

      let startX = oso.direction === 1 ? oso.x + oso.width : oso.x - heartSize;

      projectiles.push({
          x: startX,
          y: oso.y + oso.height / 3,
          vx: heartVx,
          width: heartSize,
          height: heartSize
      });

      unicorn.power -= 10;
      unicorn.cooldown = 15;
      playSound('shot');
  }
};

// ... (el resto de las funciones también necesitan window.) ...

// Inicialización del juego
function initGame() {
    console.log("🎮 Iniciando juego Oso Abrazos...");
    
    // Obtener elementos del DOM
    canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("❌ No se encontró el elemento canvas");
        return;
    }
    
    ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("❌ No se pudo obtener el contexto 2D del canvas");
        return;
    }
    
    // Obtener otros elementos
    scoreElement = document.getElementById("score");
    livesElement = document.getElementById("lives");
    levelElement = document.getElementById("level");
    startScreen = document.getElementById("startScreen");
    startButton = document.getElementById("startButton");
    loadingScreen = document.getElementById("loadingScreen");
    loadingProgress = document.getElementById("loadingProgress");
    loadingText = document.getElementById("loadingText");
    coverImage = document.getElementById("coverImage");
    hintElement = document.getElementById("hint");
    soundToggle = document.getElementById("soundToggle");
    unicornPowerElement = document.getElementById("unicornPower");
    unicornPowerLevelElement = document.getElementById("unicornPowerLevel");
    
    console.log("✅ Canvas y contexto inicializados correctamente");
    
    // Configurar event listeners
    setupEventListeners();
    
    // Iniciar carga de recursos
    loadResources();
    
    // Iniciar loop del juego
    gameLoop();
}

function setupEventListeners() {
    // Event listeners de teclado
    window.addEventListener("keydown", e => {
        keys[e.key] = true;
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "z"].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    window.addEventListener("keyup", e => keys[e.key] = false);
    
    // Disparar corazones con el mouse
    canvas.addEventListener("mousedown", e => {
        if (oso.hasUnicorn) {
            window.shootHeart();
        }
    });
    
    // Iniciar juego
    startButton.addEventListener("click", window.startGame);
    
    // Control de sonido
    soundToggle.addEventListener("click", toggleSound);
}

// Iniciar cuando la página esté cargada
window.addEventListener('load', initGame);
