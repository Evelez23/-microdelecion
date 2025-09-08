// js/game-complete.js - Sistema completo con niveles y jefe final

window.addEventListener('load', function() {
    console.log("🎮 Iniciando Oso Abrazos - Aventura Completa...");
    
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    const scoreElement = document.getElementById("score");
    const livesElement = document.getElementById("lives");
    const levelElement = document.getElementById("level");
    const startScreen = document.getElementById("startScreen");
    const startButton = document.getElementById("startButton");
    const loadingScreen = document.getElementById("loadingScreen");
    const loadingProgress = document.getElementById("loadingProgress");
    const loadingText = document.getElementById("loadingText");
    const coverImage = document.getElementById("coverImage");
    const hintElement = document.getElementById("hint");
    const soundToggle = document.getElementById('soundToggle');
    const unicornPowerElement = document.getElementById("unicornPower");
    const unicornPowerLevelElement = document.getElementById("unicornPowerLevel");
    const heartsCollectedElement = document.getElementById("heartsCollected");
    const heartCountElement = document.getElementById("heartCount");
    const bossHealthElement = document.getElementById("bossHealth");
    const bossHealthBarElement = document.getElementById("bossHealthBar");
    const bossHealthTextElement = document.getElementById("bossHealthText");
    const fireWarningElement = document.getElementById("fireWarning");
    const victoryScreen = document.getElementById("victoryScreen");
    const finalScoreElement = document.getElementById("finalScore");
    const finalHeartsElement = document.getElementById("finalHearts");

    // 🔥 NUEVO: Sistema de niveles mejorado
    const LEVELS = {
        '1-1': { name: 'Bosque Tranquilo', enemies: 1, friends: 3, items: 2, hasBoss: false },
        '1-2': { name: 'Sendero Oscuro', enemies: 2, friends: 4, items: 3, hasBoss: false },
        '1-3': { name: 'Zona Peligrosa', enemies: 3, friends: 5, items: 4, hasBoss: false },
        '1-4': { name: 'Cueva del Miedo', enemies: 4, friends: 6, items: 5, hasBoss: false },
        '1-5': { name: 'Próximo al Territorio del Lobo', enemies: 5, friends: 7, items: 6, hasBoss: false },
        '1-6': { name: '🐺 GUARIDA DEL LOBO FEROZ 🐺', enemies: 0, friends: 0, items: 0, hasBoss: true }
    };

    // Sprites con todas las imágenes
    const sprites = {
        oso_idle: new Image(), oso_walk: new Image(), oso_jump: new Image(),
        oso_run: new Image(), oso_sit: new Image(), oso_hugging: new Image(),
        oso_portada: new Image(), ardilla: new Image(), conejo: new Image(),
        pajarito: new Image(), Enemigos_01: new Image(), Enemigos_02: new Image(),
        Enemigos_03: new Image(), miel: new Image(), uni_solo: new Image(),
        osoyuni: new Image(), uni_run: new Image(), uni_shup: new Image(),
        uni_corazon: new Image(), bosque1: new Image(), bosque2: new Image(),
        bosque3: new Image(), bosque4: new Image(), lobo: new Image(),
        loboferoz: new Image(), lobotriste: new Image(), corazon: new Image(),
        fuego: new Image(), celebracion: new Image()
    };

    // URLs actualizadas
    const baseUrl = "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/img/";
    const imageUrls = {
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

    // 🔊 Sonidos mejorados
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
        powerUp: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/powerup.mp3.mp3',
        bossRoar: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/boss_roar.mp3',
        fire: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/fire.mp3',
        victory: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/sounds/victory.mp3'
    };

    const sounds = {};

    // 🎮 Estado del juego mejorado
    let gameState = {
        score: 0,
        lives: 3,
        currentLevel: '1-1',
        gameStarted: false,
        soundEnabled: true,
        heartsCollected: 0,
        totalHearts: 0,
        bossFight: false,
        bossHealth: 5,
        maxBossHealth: 5,
        bossEnraged: false
    };

    // 🐻 Estado del oso
    let oso = {
        x: 100, y: 380, width: 80, height: 80,
        vx: 0, vy: 0, speed: 4, jumpForce: 13, gravity: 0.6,
        grounded: true, action: "idle", direction: 1,
        hugging: false, hugCooldown: 0, invincible: 0,
        hasUnicorn: false, unicornTimer: 0
    };

    // 🦄 Estado del unicornio
    let unicorn = {
        x: 0, y: 0, width: 100, height: 100,
        active: false, power: 100, cooldown: 0
    };

    // 🐺 Jefe: Lobo Feroz
    let boss = {
        x: 600, y: 350, width: 120, height: 120,
        health: 5, maxHealth: 5, enraged: false,
        attackCooldown: 0, warningTimer: 0,
        fireballs: [], phase: 1
    };

    // Elementos del juego
    let platforms = [];
    let friends = [];
    let enemies = [];
    let items = [];
    let projectiles = [];
    let particles = [];
    let hearts = []; // 💝 Corazones especiales para el jefe
    let hintTimer = 0;
    let keys = {};
    let fondoActual = 'bosque1';

    // 🔊 Funciones de audio mejoradas
    function loadSounds() {
        console.log("🔊 Cargando sonidos...");
        let loadedSounds = 0;
        const totalSounds = Object.keys(soundUrls).length;
        
        for (let key in soundUrls) {
            sounds[key] = new Audio(soundUrls[key]);
            sounds[key].volume = key.includes('boss') || key === 'victory' ? 0.8 : 0.6;
            sounds[key].preload = 'auto';
            
            sounds[key].oncanplaythrough = () => {
                loadedSounds++;
                console.log(`✅ Sonido cargado: ${key} (${loadedSounds}/${totalSounds})`);
            };
            
            sounds[key].onerror = (e) => {
                loadedSounds++;
                console.error(`❌ Error cargando sonido ${key}:`, soundUrls[key], e);
            };
        }
        
        sounds.background.loop = true;
        sounds.intro.loop = true;
        sounds.battle.loop = true;
    }

    function playSound(soundName) {
        if (gameState.soundEnabled && sounds[soundName]) {
            try {
                if (soundName !== 'background' && soundName !== 'intro' && soundName !== 'battle') {
                    const soundClone = new Audio(sounds[soundName].src);
                    soundClone.volume = sounds[soundName].volume;
                    soundClone.play().catch(e => console.log("Error reproduciendo sonido: ", e));
                } else {
                    sounds[soundName].play().catch(e => console.log("Error reproduciendo música: ", e));
                }
            } catch (error) {
                console.error("Error con el sonido: ", error);
            }
        }
    }

    // 🎮 Sistema de niveles completo
    function getNextLevel(currentLevel) {
        const levels = Object.keys(LEVELS);
        const currentIndex = levels.indexOf(currentLevel);
        return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
    }

    function setupLevel(levelKey) {
        const level = LEVELS[levelKey];
        gameState.currentLevel = levelKey;
        gameState.bossFight = level.hasBoss;
        
        levelElement.textContent = `${levelKey} - ${level.name}`;
        document.getElementById('levelIndicator').textContent = `Nivel ${levelKey}`;
        
        if (level.hasBoss) {
            // 🔥 NIVEL DEL JEFE
            setupBossLevel();
        } else {
            // 🌲 NIVELES NORMALES
            setupNormalLevel(level);
        }
    }

    function setupNormalLevel(level) {
        bossHealthElement.style.display = 'none';
        fireWarningElement.style.display = 'none';
        heartsCollectedElement.style.display = 'none';
        
        // Plataformas adaptadas al nivel
        platforms = [
            {x: 0, y: 450, width: 800, height: 50},
            {x: 150, y: 350, width: 120, height: 20},
            {x: 350, y: 300, width: 120, height: 20},
            {x: 550, y: 250, width: 120, height: 20}
        ];
        
        // Generar amigos
        friends = [];
        const friendTypes = ['ardilla', 'conejo', 'pajarito'];
        for (let i = 0; i < level.friends; i++) {
            friends.push({
                x: 100 + (i * 120),
                y: 380,
                width: 60, height: 60,
                hugged: false,
                type: friendTypes[i % friendTypes.length],
                floating: 0, floatDir: Math.random() > 0.5 ? 1 : -1
            });
        }
        
        // Generar enemigos
        enemies = [];
        const enemyTypes = ['Enemigos_01', 'Enemigos_02', 'Enemigos_03'];
        for (let i = 0; i < level.enemies; i++) {
            enemies.push({
                x: 200 + (i * 150),
                y: 380,
                width: 50, height: 50,
                vx: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 0.5),
                type: enemyTypes[i % enemyTypes.length]
            });
        }
        
        // Generar items
        items = [];
        for (let i = 0; i < level.items; i++) {
            items.push({
                x: 100 + (i * 130),
                y: 200 + Math.random() * 150,
                width: 30, height: 30,
                collected: false, type: 'miel'
            });
        }
        
        // Añadir unicornio en niveles avanzados
        if (gameState.currentLevel >= '1-3') {
            items.push({
                x: 400, y: 300,
                width: 80, height: 80,
                collected: false, type: 'uni_solo'
            });
        }
        
        showHint(`¡Bienvenido al ${level.name}! Abraza a todos los amigos para avanzar`, 4000);
    }

    function setupBossLevel() {
        // 🔥 CONFIGURACIÓN DEL JEFE
        bossHealthElement.style.display = 'block';
        heartsCollectedElement.style.display = 'flex';
        heartsCollectedElement.style.flexDirection = 'column';
        heartsCollectedElement.style.gap = '5px';
        
        // Resetear valores del jefe
        boss.health = boss.maxHealth;
        boss.enraged = false;
        boss.phase = 1;
        boss.attackCooldown = 0;
        boss.fireballs = [];
        gameState.heartsCollected = 0;
        gameState.totalHearts = 0;
        
        updateBossHealth();
        
        // Plataformas especiales para el jefe
        platforms = [
            {x: 0, y: 450, width: 800, height: 50},
            {x: 100, y: 350, width: 100, height: 20},
            {x: 300, y: 300, width: 100, height: 20},
            {x: 500, y: 350, width: 100, height: 20},
            {x: 650, y: 250, width: 100, height: 20}
        ];
        
        // Limpiar enemigos normales
        enemies = [];
        friends = [];
        
        // Generar corazones especiales
        hearts = [];
        for (let i = 0; i < 3; i++) {
            hearts.push({
                x: 150 + (i * 200),
                y: 200 + Math.random() * 100,
                width: 40, height: 40,
                collected: false, respawnTimer: 0
            });
        }
        
        // Posicionar al jefe
        boss.x = 600;
        boss.y = 350;
        
        showHint("🔥 ¡CUIDADO! El Lobo Feroz te está observando... Recolecta 3 corazones para invocar al unicornio", 6000);
        
        // 🎵 Cambiar a música de batalla
        if (gameState.soundEnabled) {
            sounds.background.pause();
            playSound('battle');
        }
    }

    // 🐺 Sistema del jefe
    function updateBoss() {
        if (!gameState.bossFight) return;
        
        // Movimiento del jefe
        if (oso.x < boss.x) boss.x -= 2;
        if (oso.x > boss.x) boss.x += 2;
        
        // Ataque del jefe
        if (boss.attackCooldown <= 0) {
            // Advertencia antes del ataque
            if (boss.warningTimer <= 0) {
                fireWarningElement.style.display = 'block';
                boss.warningTimer = 60; // 1 segundo de advertencia
                playSound('bossRoar');
            } else {
                boss.warningTimer--;
                if (boss.warningTimer <= 0) {
                    // Lanzar fuego
                    launchFireball();
                    boss.attackCooldown = 180; // 3 segundos entre ataques
                    fireWarningElement.style.display = 'none';
                }
            }
        } else {
            boss.attackCooldown--;
        }
        
        // Actualizar fuego
        for (let i = boss.fireballs.length - 1; i >= 0; i--) {
            let fire = boss.fireballs[i];
            fire.x += fire.vx;
            fire.y = boss.y + boss.height / 2;
            
            if (fire.x < -50 || fire.x > canvas.width + 50) {
                boss.fireballs.splice(i, 1);
                continue;
            }
            
            // Colisión con oso
            if (checkCollision(fire, oso) && oso.invincible <= 0) {
                boss.fireballs.splice(i, 1);
                hurtOso();
                createParticles(oso.x + oso.width/2, oso.y + oso.height/2, 15, "#FF4500");
            }
        }
        
        // Fases del jefe
        if (boss.health <= 2 && !boss.enraged) {
            boss.enraged = true;
            boss.phase = 2;
            showHint("😡 ¡El lobo está enfurecido! Sus ataques son más rápidos", 3000);
        }
    }

    function launchFireball() {
        const fireball = {
            x: boss.x,
            y: boss.y + boss.height / 2,
            width: 40, height: 30,
            vx: oso.x < boss.x ? -8 : 8
        };
        
        boss.fireballs.push(fireball);
        playSound('fire');
    }

    function updateBossHealth() {
        const healthPercent = (boss.health / boss.maxHealth) * 100;
        bossHealthBarElement.style.width = `${healthPercent}%`;
        bossHealthTextElement.textContent = `${boss.health}/${boss.maxHealth}`;
        
        if (boss.enraged) {
            bossHealthElement.classList.add('boss-enraged');
        }
    }

    function damageBoss() {
        boss.health--;
        updateBossHealth();
        createParticles(boss.x + boss.width/2, boss.y + boss.height/2, 20, "#FF69B4");
        playSound('enemy');
        
        if (boss.health <= 0) {
            // 🎉 ¡VICTORIA!
            victoryBossFight();
        } else {
            // Retroceso del jefe
            boss.x += oso.direction * 50;
        }
    }

    function victoryBossFight() {
        gameState.bossFight = false;
        showHint("🎉 ¡Has derrotado al Lobo Feroz! ¡El bosque está a salvo!", 5000);
        
        // Mostrar pantalla de victoria
        victoryScreen.style.display = 'flex';
        finalScoreElement.textContent = gameState.score;
        finalHeartsElement.textContent = gameState.heartsCollected;
        
        // 🎵 Música de victoria
        if (gameState.soundEnabled) {
            sounds.battle.pause();
            playSound('victory');
        }
        
        // Cambiar sprite del jefe a derrotado
        setTimeout(() => {
            // Aquí podrías cambiar al sprite triste del lobo
        }, 2000);
    }

    // 💝 Sistema de corazones para el jefe
    function updateHearts() {
        if (!gameState.bossFight) return;
        
        for (let i = hearts.length - 1; i >= 0; i--) {
            let heart = hearts[i];
            
            if (!heart.collected && checkCollision(oso, heart)) {
                heart.collected = true;
                gameState.heartsCollected++;
                gameState.score += 200;
                heartCountElement.textContent = gameState.heartsCollected;
                createParticles(heart.x + heart.width/2, heart.y + heart.height/2, 10, "#FF1493");
                playSound('collect');
                
                // Invocar unicornio si tiene 3 corazones
                if (gameState.heartsCollected >= 3 && !oso.hasUnicorn) {
                    oso.hasUnicorn = true;
                    unicorn.active = true;
                    unicorn.power = 100;
                    unicornPowerElement.style.display = 'flex';
                    oso.width = 100;
                    oso.height = 100;
                    playSound('powerUp');
                    showHint("🦄 ¡El Unicornio de la Amistad ha aparecido! Usa Z para disparar rayos de amor", 5000);
                }
            }
            
            // Regenerar corazones después de tiempo
            if (heart.collected && heart.respawnTimer <= 0) {
                heart.respawnTimer = 300; // 5 segundos
            } else if (heart.collected && heart.respawnTimer > 0) {
                heart.respawnTimer--;
                if (heart.respawnTimer <= 0) {
                    heart.collected = false;
                }
            }
        }
    }

    // 🎨 Renderizado mejorado
    function drawBoss() {
        if (!gameState.bossFight) return;
        
        const sprite = boss.enraged ? sprites.loboferoz : sprites.lobo;
        
        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
            ctx.save();
            if (boss.enraged) {
                ctx.globalAlpha = 0.9 + Math.sin(Date.now() / 100) * 0.1;
            }
            
            // Efecto de brillo cuando está herido
            if (boss.health <= 2) {
                ctx.shadowColor = "#FF0000";
                ctx.shadowBlur = 20;
            }
            
            ctx.drawImage(sprite, boss.x, boss.y, boss.width, boss.height);
            ctx.restore();
        } else {
            ctx.fillStyle = boss.enraged ? "#8B0000" : "#4B0082";
            ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        }
        
        // Barra de vida sobre el jefe
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(boss.x, boss.y - 20, boss.width, 10);
        
        const healthWidth = (boss.health / boss.maxHealth) * boss.width;
        ctx.fillStyle = boss.health > 2 ? "#4CAF50" : "#F44336";
        ctx.fillRect(boss.x, boss.y - 20, healthWidth, 10);
    }

    function drawFireballs() {
        for (let fire of boss.fireballs) {
            const sprite = sprites.fuego;
            
            if (sprite && sprite.complete && sprite.naturalWidth > 0) {
                ctx.save();
                ctx.globalAlpha = 0.8;
                ctx.shadowColor = "#FF4500";
                ctx.shadowBlur = 15;
                ctx.drawImage(sprite, fire.x, fire.y, fire.width, fire.height);
                ctx.restore();
            } else {
                ctx.fillStyle = "#FF4500";
                ctx.shadowColor = "#FF6347";
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(fire.x + fire.width/2, fire.y + fire.height/2, fire.width/2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function drawHearts() {
        for (let heart of hearts) {
            if (!heart.collected) {
                const sprite = sprites.corazon;
                
                if (sprite && sprite.complete && sprite.naturalWidth > 0) {
                    ctx.save();
                    ctx.globalAlpha = 0.9 + Math.sin(Date.now() / 200) * 0.1;
                    ctx.drawImage(sprite, heart.x, heart.y, heart.width, heart.height);
                    ctx.restore();
                } else {
                    ctx.fillStyle = "#FF1493";
                    ctx.beginPath();
                    ctx.arc(heart.x + heart.width/2, heart.y + heart.height/2, heart.width/2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    // 🎮 Sistema de control mejorado
    function update() {
        if (!gameState.gameStarted) return;
        
        if (hintTimer > 0) {
            hintTimer--;
            if (hintTimer <= 0) {
                hintElement.style.display = "none";
            }
        }
        
        if (oso.invincible > 0) oso.invincible--;
        
        // Movimiento del oso
        oso.vx = 0;
        if ((keys["ArrowRight"] || keys["d"]) && !oso.hugging) {
            oso.vx = oso.hasUnicorn ? oso.speed * 1.2 : oso.speed;
            oso.action = oso.grounded ? (oso.hasUnicorn ? "uni_run" : "run") : "jump";
            oso.direction = 1;
        } else if ((keys["ArrowLeft"] || keys["a"]) && !oso.hugging) {
            oso.vx = -(oso.hasUnicorn ? oso.speed * 1.2 : oso.speed);
            oso.action = oso.grounded ? (oso.hasUnicorn ? "uni_run" : "run") : "jump";
            oso.direction = -1;
        } else if (!oso.hugging) {
            oso.action = oso.grounded ? (oso.hasUnicorn ? "osoyuni" : "idle") : "jump";
        }
        
        // Salto
        if ((keys["ArrowUp"] || keys["w"]) && oso.grounded && !oso.hugging) {
            oso.vy = -oso.jumpForce;
            oso.grounded = false;
            oso.action = "jump";
            createParticles(oso.x + oso.width/2, oso.y + oso.height, 5, "#8BC34A");
            playSound('jump');
        }
        
        // Disparar (solo con unicornio)
        if (keys["z"] && oso.hasUnicorn && unicorn.cooldown <= 0 && unicorn.power > 0) {
            shootHeart();
        }
        
        // Abrazar
        if (keys[" "] && oso.hugCooldown <= 0 && oso.grounded) {
            oso.action = "hugging";
            oso.hugging = true;
            oso.hugCooldown = 30;
            oso.vx = 0;
            
            let huggedFriend = false;
            const hugRange = oso.hasUnicorn ? 120 : 100;
            
            for (let friend of friends) {
                if (!friend.hugged && checkCollision({
                    x: oso.x - (hugRange - oso.width) / 2,
                    y: oso.y - (hugRange - oso.height) / 2,
                    width: hugRange, height: hugRange
                }, friend)) {
                    friend.hugged = true;
                    gameState.score += 100;
                    huggedFriend = true;
                    createParticles(friend.x + friend.width/2, friend.y + friend.height/2, 10, "#FFD700");
                    playSound('hug');
                    createTextParticle(friend.x + friend.width/2, friend.y, "+100", "#FFD700");
                }
            }
        }
        
        if (oso.hugCooldown > 0) {
            oso.hugCooldown--;
            if (oso.hugCooldown === 0) oso.hugging = false;
        }
        
        // Física
        oso.vy += oso.gravity;
        oso.x += oso.vx;
        
        if (oso.x < 0) oso.x = 0;
        if (oso.x + oso.width > canvas.width) oso.x = canvas.width - oso.width;
        
        oso.y += oso.vy;
        
        // Colisiones con plataformas
        oso.grounded = false;
        for (let platform of platforms) {
            if (checkCollision(oso, platform) && oso.vy > 0) {
                oso.y = platform.y - oso.height;
                oso.vy = 0;
                oso.grounded = true;
                if (oso.action === "jump") oso.action = "idle";
            }
        }
        
        if (oso.y + oso.height > canvas.height) {
            oso.y = canvas.height - oso.height;
            oso.vy = 0;
            oso.grounded = true;
            if (oso.action === "jump") oso.action = "idle";
        }
        
        // Actualizar elementos del nivel
        if (!gameState.bossFight) {
            updateNormalLevel();
        } else {
            updateBoss();
            updateHearts();
        }
        
        // Actualizar partículas
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].type === 'text') {
                particles[i].y -= 1;
                particles[i].life--;
            } else {
                particles[i].x += particles[i].vx;
                particles[i].y += particles[i].vy;
                particles[i].life--;
            }
            
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        // Verificar victoria en niveles normales
        if (!gameState.bossFight) {
            let allHugged = friends.every(friend => friend.hugged);
            if (allHugged && friends.length > 0) {
                nextLevel();
            }
        }
        
        // Actualizar UI
        scoreElement.textContent = gameState.score;
        livesElement.textContent = "❤️".repeat(gameState.lives);
        
        if (oso.hasUnicorn && unicorn.power < 100) {
            unicorn.power += 0.3;
        }
        if (unicornPowerElement.style.display !== 'none') {
            unicornPowerLevelElement.style.width = `${unicorn.power}%`;
        }
    }

    function updateNormalLevel() {
        // Animar amigos
        for (let friend of friends) {
            if (!friend.hugged) {
                friend.floating += 0.05;
                friend.y += Math.sin(friend.floating) * 0.5 * friend.floatDir;
            }
        }
        
        // Mover enemigos
        for (let enemy of enemies) {
            enemy.x += enemy.vx;
            if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
                enemy.vx *= -1;
            }
            
            if (checkCollision(oso, enemy) && !oso.hugging && oso.invincible <= 0) {
                hurtOso();
            }
            
            if (checkCollision(oso, enemy) && oso.hugging) {
                enemy.vx = 0;
                createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 15, "#E91E63");
                enemies.splice(enemies.indexOf(enemy), 1);
                gameState.score += 200;
                playSound('enemy');
                createTextParticle(enemy.x + enemy.width/2, enemy.y, "+200", "#E91E63");
            }
        }
        
        // Items
        for (let i = items.length - 1; i >= 0; i--) {
            let item = items[i];
            if (!item.collected && checkCollision(oso, item)) {
                item.collected = true;
                if (item.type === 'miel') {
                    gameState.score += 50;
                    createParticles(item.x + item.width/2, item.y + item.height/2, 8, "#FF9800");
                    playSound('collect');
                    createTextParticle(item.x + item.width/2, item.y, "+50", "#FF9800");
                } else if (item.type === 'uni_solo') {
                    oso.hasUnicorn = true;
                    unicorn.active = true;
                    unicorn.power = 100;
                    unicornPowerElement.style.display = 'flex';
                    oso.width = 100;
                    oso.height = 100;
                    playSound('powerUp');
                    showHint("🦄 ¡Has montado el unicornio! Usa Z para disparar rayos de amor", 5000);
                }
                items.splice(i, 1);
            }
        }
        
        // Proyectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
            let p = projectiles[i];
            p.x += p.vx;
            
            if (p.x < -50 || p.x > canvas.width + 50) {
                projectiles.splice(i, 1);
                continue;
            }
            
            for (let j = enemies.length - 1; j >= 0; j--) {
                let enemy = enemies[j];
                if (checkCollision(p, enemy)) {
                    createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 15, "#FF69B4");
                    enemies.splice(j, 1);
                    projectiles.splice(i, 1);
                    gameState.score += 300;
                    playSound('enemy');
                    createTextParticle(enemy.x + enemy.width/2, enemy.y, "+300", "#FF69B4");
                    break;
                }
            }
        }
        
        if (unicorn.cooldown > 0) unicorn.cooldown--;
    }

    function shootHeart() {
        if (unicorn.cooldown <= 0 && unicorn.power > 0) {
            const heartSpeed = 10;
            const heartSize = 25;
            const heartVx = oso.direction * heartSpeed;
            const startX = oso.direction === 1 ? oso.x + oso.width : oso.x - heartSize;
            
            projectiles.push({
                x: startX,
                y: oso.y + oso.height / 3,
                vx: heartVx,
                width: heartSize,
                height: heartSize,
                type: 'unicorn'
            });
            
            unicorn.power -= 10;
            unicorn.cooldown = 15;
            playSound('shot');
            createParticles(startX, oso.y + oso.height / 3, 5, "#FF69B4");
        }
    }

    function hurtOso() {
        gameState.lives--;
        createParticles(oso.x + oso.width/2, oso.y + oso.height/2, 20, "#FF5252");
        createTextParticle(oso.x + oso.width/2, oso.y, "-1 Vida", "#FF5252");
        playSound('hurt');
        oso.invincible = 120;
        
        if (gameState.lives <= 0) {
            gameOver();
        } else {
            oso.x = 100;
            oso.y = 380;
        }
    }

    function nextLevel() {
        const nextLevelKey = getNextLevel(gameState.currentLevel);
        
        if (nextLevelKey) {
            gameState.currentLevel = nextLevelKey;
            gameState.score += 500; // Bonus por completar nivel
            showHint(`🎉 ¡Nivel completado! Bienvenido al ${LEVELS[nextLevelKey].name}`, 4000);
            
            // 🎵 Cambiar música si es el nivel del jefe
            if (nextLevelKey === '1-6' && gameState.soundEnabled) {
                sounds.background.pause();
                playSound('battle');
            }
            
            setupLevel(nextLevelKey);
        } else {
            // 🏆 JUEGO COMPLETADO
            victoryGameComplete();
        }
    }

    function victoryGameComplete() {
        gameState.gameStarted = false;
        victoryScreen.style.display = 'flex';
        finalScoreElement.textContent = gameState.score;
        finalHeartsElement.textContent = gameState.heartsCollected;
        
        if (gameState.soundEnabled) {
            sounds.background.pause();
            playSound('victory');
        }
        
        showHint("🏆 ¡FELICITACIONES! Has completado toda la aventura", 10000);
    }

    function gameOver() {
        gameState.gameStarted = false;
        startScreen.style.display = "flex";
        startButton.textContent = "🔄 Jugar de nuevo";
        
        if (gameState.soundEnabled) {
            sounds.background.pause();
            sounds.battle.pause();
            sounds.intro.pause();
        }
        
        const gameOverDiv = document.getElementById("gameOverText") || document.createElement("div");
        gameOverDiv.id = "gameOverText";
        gameOverDiv.innerHTML = `
            <h2>💀 ¡Game Over!</h2>
            <p>Puntuación final: ${gameState.score}</p>
            <p>Nivel alcanzado: ${gameState.currentLevel}</p>
        `;
        gameOverDiv.style.textAlign = "center";
        gameOverDiv.style.marginTop = "20px";
        gameOverDiv.style.color = "#FFD700";
        
        if (!document.getElementById("gameOverText")) {
            startScreen.appendChild(gameOverDiv);
        }
    }

    // 🎨 Sistema de dibujo mejorado
    function draw() {
        if (!gameState.gameStarted) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        
        // Plataformas
        for (let platform of platforms) {
            const gradient = ctx.createLinearGradient(0, platform.y, 0, platform.y + platform.height);
            gradient.addColorStop(0, "#8D6E63");
            gradient.addColorStop(1, "#5D4037");
            ctx.fillStyle = gradient;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            ctx.fillStyle = "#3E2723";
            ctx.fillRect(platform.x, platform.y, platform.width, 3);
        }
        
        // Items
        for (let item of items) {
            drawItem(item);
        }
        
        // Corazones del jefe
        if (gameState.bossFight) {
            drawHearts();
        }
        
        // Amigos
        for (let friend of friends) {
            if (!friend.hugged) {
                drawFriend(friend);
            }
        }
        
        // Enemigos
        for (let enemy of enemies) {
            drawEnemy(enemy);
        }
        
        // Proyectiles
        for (let p of projectiles) {
            drawProjectile(p);
        }
        
        // Fuego del jefe
        if (gameState.bossFight) {
            drawFireballs();
        }
        
        // Oso
        drawOsoSprite();
        
        // Jefe
        if (gameState.bossFight) {
            drawBoss();
        }
        
        // Partículas
        for (let particle of particles) {
            ctx.globalAlpha = particle.life / 30;
            ctx.fillStyle = particle.color;
            
            if (particle.type === 'text') {
                ctx.font = 'bold 18px Comic Sans MS';
                ctx.fillText(particle.text, particle.x, particle.y);
            } else {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
        
        // Efecto de abrazo
        if (oso.hugging) {
            ctx.strokeStyle = "#FFD700";
            ctx.lineWidth = 4;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(oso.x + oso.width/2, oso.y + oso.height/2, 70, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    function drawBackground() {
        // Fondo según nivel
        const fondosPorNivel = ['bosque1', 'bosque2', 'bosque3', 'bosque4'];
        let fondoIndex;
        
        if (gameState.bossFight) {
            fondoIndex = 3; // Fondo más oscuro para el jefe
        } else {
            const levelNum = parseInt(gameState.currentLevel.split('-')[1]);
            fondoIndex = Math.min(levelNum - 1, fondosPorNivel.length - 1);
        }
        
        const fondo = sprites[fondosPorNivel[fondoIndex]];
        
        if (fondo && fondo.complete && fondo.naturalWidth > 0) {
            ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
        } else {
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            if (gameState.bossFight) {
                gradient.addColorStop(0, "#2C1810");
                gradient.addColorStop(1, "#8B0000");
            } else {
                gradient.addColorStop(0, "#87CEEB");
                gradient.addColorStop(1, "#E0F7FA");
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Nubes animadas
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        for (let i = 0; i < 5; i++) {
            const x = (Date.now() / 20000 + i * 0.2) % 1.5 * canvas.width - 100;
            const y = 30 + i * 35;
            drawCloud(x, y, 20 + i * 3);
        }
    }

    function drawCloud(x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.7, y - size * 0.4, size * 0.8, 0, Math.PI * 2);
        ctx.arc(x + size * 1.4, y, size * 1.1, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawOsoSprite() {
        let spriteName;
        
        if (oso.hasUnicorn) {
            if (oso.hugging) {
                spriteName = "oso_hugging";
            } else {
                spriteName = (oso.vx !== 0) ? 'uni_run' : 'osoyuni';
            }
        } else {
            spriteName = `oso_${oso.action}`;
        }
        
        const sprite = sprites[spriteName] || sprites.oso_idle;

        if (oso.invincible > 0 && oso.invincible % 6 < 3) {
            ctx.globalAlpha = 0.5;
        }

        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
            ctx.save();
            if (oso.direction === -1) {
                ctx.scale(-1, 1);
                ctx.drawImage(sprite, -oso.x - oso.width, oso.y, oso.width, oso.height);
            } else {
                ctx.drawImage(sprite, oso.x, oso.y, oso.width, oso.height);
            }
            ctx.restore();
        } else {
            // Fallback si no hay sprite
            ctx.fillStyle = oso.hasUnicorn ? "#E91E63" : "#8B4513";
            ctx.fillRect(oso.x, oso.y, oso.width, oso.height);
            
            // Ojos
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(oso.x + 20, oso.y + 20, 5, 0, Math.PI * 2);
            ctx.arc(oso.x + oso.width - 20, oso.y + 20, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }

    // [Resto de funciones de dibujo: drawFriend, drawEnemy, drawItem, drawProjectile, etc.]

    // 🔧 Funciones auxiliares
    function checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
                obj1.x + obj1.width > obj2.x &&
                obj1.y < obj2.y + obj2.height &&
                obj1.y + obj1.height > obj2.y;
    }

    function createParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x, y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 2,
                size: Math.random() * 6 + 2,
                color: color,
                life: 40
            });
        }
    }

    function createTextParticle(x, y, text, color) {
        particles.push({
            x: x, y: y,
            text: text, color: color,
            life: 80, type: 'text'
        });
    }

    function showHint(text, duration) {
        hintElement.textContent = text;
        hintElement.style.display = "block";
        hintTimer = duration / 16.67;
    }

    // 🎮 Control de sonido
    function toggleSound() {
        gameState.soundEnabled = !gameState.soundEnabled;
        
        if (gameState.soundEnabled) {
            soundToggle.textContent = "🔊";
            if (gameState.bossFight) {
                playSound('battle');
            } else if (gameState.gameStarted) {
                playSound('background');
            } else {
                playSound('intro');
            }
        } else {
            soundToggle.textContent = "🔇";
            Object.values(sounds).forEach(sound => {
                if (!sound.paused) sound.pause();
            });
        }
    }

    // 🎮 Inicialización
    function startGame() {
        gameState.gameStarted = true;
        startScreen.style.display = "none";
        victoryScreen.style.display = "none";
        
        setupLevel('1-1');
        
        if (gameState.soundEnabled) {
            sounds.intro.pause();
            playSound('background');
        }
        
        showHint("🌟 ¡Bienvenido al bosque! Acércate a los amigos y presiona ESPACIO para abrazarlos", 5000);
        
        gameLoop();
    }

    function resetGame() {
        gameState = {
            score: 0, lives: 3, currentLevel: '1-1',
            gameStarted: false, soundEnabled: true,
            heartsCollected: 0, totalHearts: 0,
            bossFight: false, bossHealth: 5, maxBossHealth: 5,
            bossEnraged: false
        };
        
        oso = {
            x: 100, y: 380, width: 80, height: 80,
            vx: 0, vy: 0, speed: 4, jumpForce: 13, gravity: 0.6,
            grounded: true, action: "idle", direction: 1,
            hugging: false, hugCooldown: 0, invincible: 0,
            hasUnicorn: false, unicornTimer: 0
        };
        
        unicorn = { x: 0, y: 0, width: 100, height: 100, active: false, power: 100, cooldown: 0 };
        boss = { x: 600, y: 350, width: 120, height: 120, health: 5, maxHealth: 5, enraged: false, attackCooldown: 0, warningTimer: 0, fireballs: [], phase: 1 };
        
        projectiles = [];
        particles = [];
        hearts = [];
        
        scoreElement.textContent = "0";
        livesElement.textContent = "❤️❤️❤️";
        levelElement.textContent = "1-1";
        heartCountElement.textContent = "0";
        unicornPowerElement.style.display = 'none';
        heartsCollectedElement.style.display = 'none';
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // 🎮 Eventos
    startButton.addEventListener("click", startGame);
    soundToggle.addEventListener("click", toggleSound);
    
    window.addEventListener("keydown", e => {
        keys[e.key] = true;
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "z", "w", "a", "s", "d"].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    window.addEventListener("keyup", e => {
        keys[e.key] = false;
        e.preventDefault();
    });
    
    canvas.addEventListener("mousedown", e => {
        if (oso.hasUnicorn && gameState.gameStarted) {
            shootHeart();
        }
    });

    document.getElementById('startGame').addEventListener('click', function() {
        document.getElementById('storybook').style.display = 'none';
        startGame();
    });

    document.getElementById('nextLevelBtn').addEventListener('click', function() {
        victoryScreen.style.display = 'none';
        const nextLevelKey = getNextLevel(gameState.currentLevel);
        if (nextLevelKey) {
            setupLevel(nextLevelKey);
        } else {
            resetGame();
            startScreen.style.display = 'flex';
        }
    });

    // 📱 Controles móviles
    function setupMobileControls() {
        const buttons = {
            leftBtn: () => { keys["ArrowLeft"] = true; keys["a"] = true; },
            rightBtn: () => { keys["ArrowRight"] = true; keys["d"] = true; },
            jumpBtn: () => { keys["ArrowUp"] = true; keys["w"] = true; },
            hugBtn: () => { keys[" "] = true; },
            fireBtn: () => { keys["z"] = true; }
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
                    Object.keys(keys).forEach(key => keys[key] = false);
                });
            }
        });
    }

    // 🚀 Inicialización
    loadResources();
    setupMobileControls();
    
    // Verificar estado de carga
    setTimeout(() => {
        console.log("=== ESTADO DEL JUEGO ===");
        console.log("Niveles disponibles:", Object.keys(LEVELS));
        console.log("Sonidos cargados:", Object.keys(sounds).filter(key => sounds[key].readyState >= 2));
    }, 3000);
});
