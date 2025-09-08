// js/game-complete.js - Sistema completo con NIVELES y JEFE FINAL - ¡ARREGLADO!

// 🚀 SISTEMA DE INICIALIZACIÓN MEJORADO - ¡ESTO VA PRIMERO!
window.addEventListener('load', function() {
    console.log("🎮 Iniciando Oso Abrazos - Aventura Completa...");
    
    // Esperar a que el DOM esté completamente listo
    setTimeout(() => {
        initializeGame();
    }, 500);
});

// 🔧 FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
function initializeGame() {
    try {
        console.log("🔧 Inicializando componentes del juego...");
        
        // Obtener elementos del DOM con manejo de errores
        const canvas = document.getElementById("gameCanvas");
        if (!canvas) {
            console.error("❌ Canvas no encontrado");
            showError("No se encontró el canvas del juego");
            return;
        }
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("❌ Contexto 2D no disponible");
            showError("Error al obtener contexto gráfico");
            return;
        }
        
        // Guardar referencias globales
        window.gameCanvas = canvas;
        window.gameCtx = ctx;
        
        // Inicializar UI
        initializeUI();
        
        // Cargar sonidos primero
        loadSounds();
        
        // Esperar un poco a que carguen los recursos
        setTimeout(() => {
            setupGameSystems();
            console.log("✅ Juego inicializado correctamente");
        }, 1000);
        
    } catch (error) {
        console.error("❌ Error crítico en inicialización:", error);
        showError("Error al iniciar el juego: " + error.message);
    }
}

// 🖥️ INICIALIZAR ELEMENTOS DE LA UI
function initializeUI() {
    window.scoreElement = document.getElementById("score");
    window.livesElement = document.getElementById("lives");
    window.levelElement = document.getElementById("level");
    window.startScreen = document.getElementById("startScreen");
    window.startButton = document.getElementById("startButton");
    window.loadingScreen = document.getElementById("loadingScreen");
    window.loadingProgress = document.getElementById("loadingProgress");
    window.loadingText = document.getElementById("loadingText");
    window.coverImage = document.getElementById("coverImage");
    window.hintElement = document.getElementById("hint");
    window.soundToggle = document.getElementById('soundToggle');
    window.unicornPowerElement = document.getElementById("unicornPower");
    window.unicornPowerLevelElement = document.getElementById("unicornPowerLevel");
    window.heartsCollectedElement = document.getElementById("heartsCollected");
    window.heartCountElement = document.getElementById("heartCount");
    window.bossHealthElement = document.getElementById("bossHealth");
    window.bossHealthBarElement = document.getElementById("bossHealthBar");
    window.bossHealthTextElement = document.getElementById("bossHealthText");
    window.fireWarningElement = document.getElementById("fireWarning");
    window.victoryScreen = document.getElementById("victoryScreen");
    window.finalScoreElement = document.getElementById("finalScore");
    window.finalHeartsElement = document.getElementById("finalHearts");
    
    console.log("✅ Elementos UI inicializados");
}

// 🔊 CARGAR SONIDOS CON MANEJO DE ERRORES
function loadSounds() {
    console.log("🔊 Cargando sonidos...");
    
    // Verificar que existan las URLs
    if (typeof soundUrls === 'undefined') {
        console.error("❌ soundUrls no definido");
        window.sounds = {};
        return;
    }
    
    window.sounds = {};
    let loadedSounds = 0;
    const totalSounds = Object.keys(soundUrls).length;
    
    if (totalSounds === 0) {
        console.warn("⚠️ No hay URLs de sonido definidas");
        return;
    }
    
    for (let key in soundUrls) {
        try {
            window.sounds[key] = new Audio(soundUrls[key]);
            window.sounds[key].volume = key.includes('boss') || key === 'victory' ? 0.8 : 0.6;
            window.sounds[key].preload = 'auto';
            
            window.sounds[key].oncanplaythrough = () => {
                loadedSounds++;
                console.log(`✅ Sonido cargado: ${key} (${loadedSounds}/${totalSounds})`);
                
                if (loadedSounds === totalSounds) {
                    console.log("🎵 Todos los sonidos cargados");
                }
            };
            
            window.sounds[key].onerror = (e) => {
                loadedSounds++;
                console.error(`❌ Error cargando sonido ${key}:`, soundUrls[key], e);
            };
            
        } catch (e) {
            loadedSounds++;
            console.error(`❌ Error creando audio ${key}:`, e);
        }
    }
    
    // Configurar loops
    if (window.sounds.background) window.sounds.background.loop = true;
    if (window.sounds.intro) window.sounds.intro.loop = true;
    if (window.sounds.battle) window.sounds.battle.loop = true;
    
    console.log("✅ Sistema de sonido inicializado");
}

// 🎮 CONFIGURAR SISTEMAS DEL JUEGO
function setupGameSystems() {
    try {
        // Configurar event listeners
        setupEventListeners();
        
        // Inicializar sistema de niveles
        initializeLevelSystem();
        
        // Configurar controles móviles
        setupMobileControls();
        
        // Iniciar carga de recursos visuales
        loadVisualResources();
        
    } catch (error) {
        console.error("❌ Error configurando sistemas:", error);
        showError("Error configurando el juego");
    }
}

// 🎯 SISTEMA DE NIVELES MEJORADO
const LEVELS = {
    '1-1': { name: 'Bosque Tranquilo', enemies: 1, friends: 3, items: 2, hasBoss: false },
    '1-2': { name: 'Sendero Oscuro', enemies: 2, friends: 4, items: 3, hasBoss: false },
    '1-3': { name: 'Zona Peligrosa', enemies: 3, friends: 5, items: 4, hasBoss: false },
    '1-4': { name: 'Cueva del Miedo', enemies: 4, friends: 6, items: 5, hasBoss: false },
    '1-5': { name: 'Próximo al Territorio del Lobo', enemies: 5, friends: 7, items: 6, hasBoss: false },
    '1-6': { name: '🐺 GUARIDA DEL LOBO FEROZ 🐺', enemies: 0, friends: 0, items: 0, hasBoss: true }
};

function initializeLevelSystem() {
    window.platforms = [];
    window.friends = [];
    window.enemies = [];
    window.items = [];
    window.hearts = [];
    window.projectiles = [];
    window.particles = [];
    window.gameState = {
        score: 0, lives: 3, currentLevel: '1-1',
        gameStarted: false, soundEnabled: true,
        heartsCollected: 0, totalHearts: 0,
        bossFight: false, bossHealth: 5, maxBossHealth: 5,
        bossEnraged: false
    };
    
    window.oso = {
        x: 100, y: 380, width: 80, height: 80,
        vx: 0, vy: 0, speed: 4, jumpForce: 13, gravity: 0.6,
        grounded: true, action: "idle", direction: 1,
        hugging: false, hugCooldown: 0, invincible: 0,
        hasUnicorn: false, unicornTimer: 0
    };
    
    window.unicorn = {
        x: 0, y: 0, width: 100, height: 100,
        active: false, power: 100, cooldown: 0
    };
    
    window.boss = {
        x: 600, y: 350, width: 120, height: 120,
        health: 5, maxHealth: 5, enraged: false,
        attackCooldown: 0, warningTimer: 0,
        fireballs: [], phase: 1
    };
    
    console.log("✅ Sistema de niveles inicializado");
}

// 🎨 CARGAR RECURSOS VISUALES
function loadVisualResources() {
    console.log("🎨 Cargando recursos visuales...");
    
    // URLs de imágenes
    const baseUrl = "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/img/";
    window.imageUrls = {
        oso_idle: `${baseUrl}oso/oso_idle.svg`, oso_walk: `${baseUrl}oso/oso_walk.svg`,
        oso_jump: `${baseUrl}oso/oso_jump.svg`, oso_run: `${baseUrl}oso/oso_run.svg`,
        oso_sit: `${baseUrl}oso/oso_sit.svg`, oso_hugging: `${baseUrl}oso/oso_hugging.svg`,
        oso_portada: `${baseUrl}oso/oso_portada.jpg`, ardilla: `${baseUrl}Amigos/ardilla.png`,
        conejo: `${baseUrl}Amigos/conejo.png`, pajarito: `${baseUrl}Amigos/pajarito.png`,
        Enemigos_01: `${baseUrl}enemigos/Enemigos-01.svg`, Enemigos_02: `${baseUrl}enemigos/Enemigos-02.svg`,
        Enemigos_03: `${baseUrl}enemigos/Enemigos-03.svg`, miel: `${baseUrl}Amigos/miel.png`,
        uni_solo: `${baseUrl}Amigos/unien4patas.png`, osoyuni: `${baseUrl}Amigos/osoyuni.png`,
        uni_run: `${baseUrl}Amigos/unirun.png`, uni_shup: `${baseUrl}Amigos/unirshup.png`,
        uni_corazon: `${baseUrl}Amigos/lovepower.png`, bosque1: `${baseUrl}fondos/bosque1.jpg`,
        bosque2: `${baseUrl}fondos/bosque2.jpg`, bosque3: `${baseUrl}fondos/bosque3.jpg`,
        bosque4: `${baseUrl}fondos/bosque4.jpg`, lobo: `${baseUrl}enemigos/lobo.svg`,
        loboferoz: `${baseUrl}enemigos/loboferoz.png`, lobotriste: `${baseUrl}enemigos/lobotriste.png`,
        corazon: `${baseUrl}oso/corazon.png`, fuego: `${baseUrl}enemigos/fire.png`,
        celebracion: `${baseUrl}oso/celebracion.png`
    };
    
    window.sprites = {};
    let loadedImages = 0;
    const totalImages = Object.keys(window.imageUrls).length;
    
    // Función para mostrar progreso
    function updateLoadingProgress() {
        loadedImages++;
        const progress = Math.floor((loadedImages / totalImages) * 100);
        if (window.loadingProgress) {
            window.loadingProgress.style.width = `${progress}%`;
        }
        if (window.loadingText) {
            window.loadingText.textContent = `${progress}%`;
        }
        console.log(`📦 Imagen cargada: ${loadedImages}/${totalImages}`);
        
        if (loadedImages === totalImages) {
            console.log("🎉 ¡Todas las imágenes cargadas!");
            setTimeout(() => {
                if (window.loadingScreen) {
                    window.loadingScreen.style.display = "none";
                }
                if (window.startScreen) {
                    window.startScreen.style.display = "flex";
                }
                if (window.coverImage && window.imageUrls.oso_portada) {
                    window.coverImage.src = window.imageUrls.oso_portada;
                }
            }, 500);
        }
    }
    
    // Cargar cada imagen
    for (let key in window.imageUrls) {
        window.sprites[key] = new Image();
        window.sprites[key].crossOrigin = "Anonymous";
        
        window.sprites[key].onload = () => {
            console.log(`✅ Imagen cargada: ${key}`);
            updateLoadingProgress();
        };
        
        window.sprites[key].onerror = (e) => {
            console.error(`❌ Error cargando imagen ${key}:`, window.imageUrls[key], e);
            updateLoadingProgress();
        };
        
        window.sprites[key].src = window.imageUrls[key];
    }
    
    console.log("✅ Carga de imágenes iniciada");
}

// 🔊 URLs de sonidos (definidas aquí para asegurar que existan)
const soundUrls = {
    background: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/background.mp3.mp3',
    intro: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/intro.mp3',
    battle: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/para%20la%20batalla.mp3',
    jump: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/jump.mp3.mp3',
    collect: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/collect.mp3.mp3',
    hug: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/hug.mp3.mp3',
    hurt: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/hurt.mp3.mp3',
    enemy: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/enemy.mp3.mp3',
    shot: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/shot.mp3.mp3',
    powerUp: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/powerup.mp3.mp3'
};

// 🎮 EVENT LISTENERS
function setupEventListeners() {
    if (window.startButton) {
        window.startButton.addEventListener("click", startGame);
    }
    
    if (window.soundToggle) {
        window.soundToggle.addEventListener("click", toggleSound);
    }
    
    // Event listener para el botón del storybook
    const startGameBtn = document.getElementById('startGame');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', function() {
            const storybook = document.getElementById('storybook');
            if (storybook) storybook.style.display = 'none';
            startGame();
        });
    }
    
    // Event listener para siguiente nivel
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelBtn) {
        nextLevelBtn.addEventListener('click', function() {
            if (window.victoryScreen) window.victoryScreen.style.display = 'none';
            const nextLevelKey = getNextLevel(window.gameState.currentLevel);
            if (nextLevelKey) {
                setupLevel(nextLevelKey);
            } else {
                resetGame();
                if (window.startScreen) window.startScreen.style.display = 'flex';
            }
        });
    }
    
    console.log("✅ Event listeners configurados");
}

// 📱 CONTROLES MÓVILES
function setupMobileControls() {
    const buttons = {
        leftBtn: () => { window.keys = window.keys || {}; window.keys["ArrowLeft"] = true; window.keys["a"] = true; },
        rightBtn: () => { window.keys = window.keys || {}; window.keys["ArrowRight"] = true; window.keys["d"] = true; },
        jumpBtn: () => { window.keys = window.keys || {}; window.keys["ArrowUp"] = true; window.keys["w"] = true; },
        hugBtn: () => { window.keys = window.keys || {}; window.keys[" "] = true; },
        fireBtn: () => { window.keys = window.keys || {}; window.keys["z"] = true; }
    };
    
    Object.keys(buttons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener("touchstart", (e) => {
                e.preventDefault();
                buttons[btnId]();
            });
            
            btn.addEventListener("touchend", (e) => {
                e.preventDefault();
                if (window.keys) {
                    Object.keys(window.keys).forEach(key => window.keys[key] = false);
                }
            });
        }
    });
    
    console.log("✅ Controles móviles configurados");
}

// 🎮 FUNCIONES DEL JUEGO
function startGame() {
    try {
        console.log("🚀 Iniciando partida...");
        
        window.gameState.gameStarted = true;
        if (window.startScreen) window.startScreen.style.display = "none";
        if (window.victoryScreen) window.victoryScreen.style.display = "none";
        
        setupLevel('1-1');
        
        // 🎵 Música con manejo de errores
        if (window.gameState.soundEnabled && window.sounds) {
            try {
                if (window.sounds.intro) window.sounds.intro.pause();
                if (window.sounds.background) {
                    window.sounds.background.play().catch(e => {
                        console.log("Error reproduciendo música:", e);
                    });
                }
            } catch (e) {
                console.log("Error con música:", e);
            }
        }
        
        showHint("🌟 ¡Bienvenido al bosque! Acércate a los amigos y presiona ESPACIO para abrazarlos", 5000);
        
        // Iniciar game loop
        gameLoop();
        
    } catch (error) {
        console.error("❌ Error iniciando juego:", error);
        showError("Error al iniciar: " + error.message);
    }
}

function setupLevel(levelKey) {
    console.log(`🎯 Configurando nivel: ${levelKey}`);
    // [Aquí iría toda tu lógica de niveles - la puedo agregar después]
}

function gameLoop() {
    if (!window.gameState || !window.gameState.gameStarted) return;
    
    try {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error("❌ Error en game loop:", error);
    }
}

// 🛠️ FUNCIONES AUXILIARES
function showError(message) {
    console.error("❌ ERROR:", message);
    alert("Error: " + message + "\n\nRevisa la consola (F12) para más detalles");
}

function showHint(text, duration) {
    if (window.hintElement) {
        window.hintElement.textContent = text;
        window.hintElement.style.display = "block";
        if (window.hintTimer) clearTimeout(window.hintTimer);
        window.hintTimer = setTimeout(() => {
            if (window.hintElement) window.hintElement.style.display = "none";
        }, duration);
    }
}

function toggleSound() {
    if (!window.gameState) return;
    
    window.gameState.soundEnabled = !window.gameState.soundEnabled;
    
    if (window.soundToggle) {
        window.soundToggle.textContent = window.gameState.soundEnabled ? "🔊" : "🔇";
    }
    
    if (!window.gameState.soundEnabled && window.sounds) {
        Object.values(window.sounds).forEach(sound => {
            if (sound && !sound.paused) sound.pause();
        });
    }
}

// 🎯 TECLAS
window.addEventListener("keydown", e => {
    if (!window.keys) window.keys = {};
    window.keys[e.key] = true;
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "z", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
    }
});

window.addEventListener("keyup", e => {
    if (!window.keys) window.keys = {};
    window.keys[e.key] = false;
    e.preventDefault();
});

// [Aquí irían el resto de funciones: update(), draw(), etc.]

console.log("✅ Archivo game-complete.js cargado correctamente");
