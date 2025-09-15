// Variables globales del juego
let player, enemies = [], hearts = [], platforms = [], friends = [], items = [], projectiles = [], background;
let keys = {};
let score = 0;
let lives = 3;
let currentLevel = 1;
let currentSubLevel = 1;
let gameStarted = false;
let heartsCollected = 0;
let unicornPower = 0;
let unicornActive = false;
let bossHealth = 5;
let bossMaxHealth = 5;
let bossAttackTimer = 0;
let bossFlashTimer = 0;
let bossIsFlashing = false;
let loadedResources = 0;
let totalResources = Object.keys(imageUrls).length + Object.keys(soundUrls).length;
let sounds = {};
let images = {};
let shootCooldown = 0;

// Inicializar el juego
function init() {
    // Configurar eventos de teclado
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        // Saltar con espacio o flecha arriba
        if ((e.key === ' ' || e.key === 'ArrowUp') && player && player.grounded) {
            player.velocityY = -gameConfig.playerJumpForce;
            playSound('jump');
        }
        
        // Llamar al unicornio con la tecla 'X'
        if ((e.key === 'x' || e.key === 'X') && heartsCollected >= 3 && !unicornActive) {
            activateUnicorn();
        }
        
        // Abrazar con la tecla 'Z'
        if ((e.key === 'z' || e.key === 'Z') && player && player.grounded) {
            player.isHugging = true;
            setTimeout(() => {
                if (player) player.isHugging = false;
            }, 500);
            playSound('hug');
            checkHug();
        }
        
        // Disparar con la tecla 'C'
        if ((e.key === 'c' || e.key === 'C') && unicornActive && shootCooldown <= 0) {
            shootHeart();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    // Configurar bot
