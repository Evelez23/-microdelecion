// game.js - Lógica principal del juego

// Variables globales
let canvas, ctx;
let scoreElement, livesElement, levelElement, startScreen, startButton;
let loadingScreen, loadingProgress, loadingText, coverImage, hintElement;
let soundToggle, unicornPowerElement, unicornPowerLevelElement;

let gameState = {
    score: 0,
    lives: 3,
    level: 1,
    gameStarted: false,
    soundEnabled: false
};

let oso = {
    x: 100,
    y: 380,
    width: 80,
    height: 80,
    vx: 0,
    vy: 0,
    speed: 4,
    jumpForce: 13,
    gravity: 0.6,
    grounded: true,
    action: "idle",
    direction: 1,
    hugging: false,
    hugCooldown: 0,
    invincible: 0,
    hasUnicorn: false
};

let unicorn = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    active: false,
    power: 100,
    cooldown: 0
};

let platforms = [
    {x: 0, y: 450, width: 800, height: 50},
    {x: 200, y: 350, width: 100, height: 20},
    {x: 400, y: 300, width: 100, height: 20},
    {x: 600, y: 250, width: 100, height: 20}
];

let friends = [], enemies = [], items = [];
let projectiles = [], particles = [];
let hintTimer = 0;
let keys = {};

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
            shootHeart();
        }
    });
    
    // Iniciar juego
    startButton.addEventListener("click", startGame);
    
    // Control de sonido
    soundToggle.addEventListener("click", toggleSound);
}

// ... (el resto de las funciones del juego: shootHeart, startGame, resetLevel, etc.) ...

// Iniciar cuando la página esté cargada
window.addEventListener('load', initGame);
