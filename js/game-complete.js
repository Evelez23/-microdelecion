// ============= FUNCIONES PRINCIPALES DEL JUEGO =============

function setupLevel(levelKey) {
    console.log(`🎯 Configurando nivel: ${levelKey}`);
    
    const level = LEVELS[levelKey];
    if (!level) {
        console.error("❌ Nivel no encontrado:", levelKey);
        return;
    }
    
    window.gameState.currentLevel = levelKey;
    window.gameState.bossFight = level.hasBoss;
    
    // Actualizar UI
    if (window.levelElement) {
        window.levelElement.textContent = `${levelKey} - ${level.name}`;
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
    if (window.bossHealthElement) window.bossHealthElement.style.display = 'none';
    if (window.fireWarningElement) window.fireWarningElement.style.display = 'none';
    if (window.heartsCollectedElement) window.heartsCollectedElement.style.display = 'none';
    
    // Plataformas
    window.platforms = [
        {x: 0, y: 450, width: 800, height: 50},
        {x: 150, y: 350, width: 120, height: 20},
        {x: 350, y: 300, width: 120, height: 20},
        {x: 550, y: 250, width: 120, height: 20}
    ];
    
    // Generar amigos
    window.friends = [];
    const friendTypes = ['ardilla', 'conejo', 'pajarito'];
    for (let i = 0; i < level.friends; i++) {
        window.friends.push({
            x: 100 + (i * 120),
            y: 380,
            width: 60, height: 60,
            hugged: false,
            type: friendTypes[i % friendTypes.length],
            floating: 0, floatDir: Math.random() > 0.5 ? 1 : -1
        });
    }
    
    // Generar enemigos
    window.enemies = [];
    const enemyTypes = ['Enemigos_01', 'Enemigos_02', 'Enemigos_03'];
    for (let i = 0; i < level.enemies; i++) {
        window.enemies.push({
            x: 200 + (i * 150),
            y: 380,
            width: 50, height: 50,
            vx: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 0.5),
            type: enemyTypes[i % enemyTypes.length]
        });
    }
    
    // Generar items
    window.items = [];
    for (let i = 0; i < level.items; i++) {
        window.items.push({
            x: 100 + (i * 130),
            y: 200 + Math.random() * 150,
            width: 30, height: 30,
            collected: false, type: 'miel'
        });
    }
    
    // Limpiar cosas de jefe
    window.hearts = [];
    window.boss.fireballs = [];
    
    showHint(`¡Bienvenido al ${level.name}! Abraza a todos los amigos para avanzar`, 4000);
}

function setupBossLevel() {
    console.log("🔥 Configurando nivel del jefe");
    
    // Mostrar elementos de jefe
    if (window.bossHealthElement) window.bossHealthElement.style.display = 'block';
    if (window.heartsCollectedElement) window.heartsCollectedElement.style.display = 'flex';
    
    // Resetear jefe
    window.boss.health = window.boss.maxHealth;
    window.boss.enraged = false;
    window.boss.phase = 1;
    window.boss.attackCooldown = 0;
    window.boss.warningTimer = 0;
    window.boss.fireballs = [];
    
    updateBossHealth();
    
    // Plataformas especiales
    window.platforms = [
        {x: 0, y: 450, width: 800, height: 50},
        {x: 100, y: 350, width: 100, height: 20},
        {x: 300, y: 300, width: 100, height: 20},
        {x: 500, y: 350, width: 100, height: 20},
        {x: 650, y: 250, width: 100, height: 20}
    ];
    
    // Limpiar nivel normal
    window.enemies = [];
    window.friends = [];
    window.items = [];
    
    // Generar corazones especiales
    window.hearts = [];
    for (let i = 0; i < 3; i++) {
        window.hearts.push({
            x: 150 + (i * 200),
            y: 200 + Math.random() * 100,
            width: 40, height: 40,
            collected: false, respawnTimer: 0
        });
    }
    
    // Posicionar jefe
    window.boss.x = 600;
    window.boss.y = 350;
    
    showHint("🔥 ¡CUIDADO! El Lobo Feroz te está observando... Recolecta 3 corazones para invocar al unicornio", 6000);
}

function updateBossHealth() {
    if (!window.bossHealthBarElement || !window.bossHealthTextElement) return;
    
    const healthPercent = (window.boss.health / window.boss.maxHealth) * 100;
    window.bossHealthBarElement.style.width = `${healthPercent}%`;
    window.bossHealthTextElement.textContent = `${window.boss.health}/${window.boss.maxHealth}`;
}

// 🎮 GAME LOOP PRINCIPAL
function update() {
    if (!window.gameState || !window.gameState.gameStarted) return;
    
    // Actualizar oso
    updateOso();
    
    // Actualizar elementos según tipo de nivel
    if (!window.gameState.bossFight) {
        updateNormalLevel();
    } else {
        updateBoss();
        updateHearts();
    }
    
    // Actualizar partículas
    updateParticles();
    
    // Verificar condiciones de victoria
    checkVictoryConditions();
    
    // Actualizar UI
    updateUI();
}

function updateOso() {
    if (!window.oso) return;
    
    // Movimiento
    window.oso.vx = 0;
    if (window.keys && ((window.keys["ArrowRight"] || window.keys["d"]) && !window.oso.hugging)) {
        window.oso.vx = window.oso.hasUnicorn ? window.oso.speed * 1.2 : window.oso.speed;
        window.oso.action = window.oso.grounded ? (window.oso.hasUnicorn ? "uni_run" : "run") : "jump";
        window.oso.direction = 1;
    } else if (window.keys && ((window.keys["ArrowLeft"] || window.keys["a"]) && !window.oso.hugging)) {
        window.oso.vx = -(window.oso.hasUnicorn ? window.oso.speed * 1.2 : window.oso.speed);
        window.oso.action = window.oso.grounded ? (window.oso.hasUnicorn ? "uni_run" : "run") : "jump";
        window.oso.direction = -1;
    }
    
    // Salto
    if (window.keys && (window.keys["ArrowUp"] || window.keys["w"]) && window.oso.grounded && !window.oso.hugging) {
        window.oso.vy = -window.oso.jumpForce;
        window.oso.grounded = false;
        window.oso.action = "jump";
        createParticles(window.oso.x + window.oso.width/2, window.oso.y + window.oso.height, 5, "#8BC34A");
        playSound('jump');
    }
    
    // Disparar con unicornio
    if (window.keys && window.keys["z"] && window.oso.hasUnicorn && window.unicorn.cooldown <= 0 && window.unicorn.power > 0) {
        shootHeart();
    }
    
    // Abrazar
    if (window.keys && window.keys[" "] && window.oso.hugCooldown <= 0 && window.oso.grounded) {
        window.oso.action = "hugging";
        window.oso.hugging = true;
        window.oso.hugCooldown = 30;
        window.oso.vx = 0;
        
        // Detectar amigos para abrazar
        const hugRange = window.oso.hasUnicorn ? 120 : 100;
        for (let friend of window.friends || []) {
            if (!friend.hugged && checkCollision({
                x: window.oso.x - (hugRange - window.oso.width) / 2,
                y: window.oso.y - (hugRange - window.oso.height) / 2,
                width: hugRange, height: hugRange
            }, friend)) {
                friend.hugged = true;
                window.gameState.score += 100;
                createParticles(friend.x + friend.width/2, friend.y + friend.height/2, 10, "#FFD700");
                playSound('hug');
                createTextParticle(friend.x + friend.width/2, friend.y, "+100", "#FFD700");
            }
        }
    }
    
    // Física
    if (window.oso.hugCooldown > 0) window.oso.hugCooldown--;
    window.oso.vy += window.oso.gravity;
    window.oso.x += window.oso.vx;
    
    // Límites
    if (window.oso.x < 0) window.oso.x = 0;
    if (window.oso.x + window.oso.width > 800) window.oso.x = 800 - window.oso.width;
    
    window.oso.y += window.oso.vy;
    
    // Colisiones con plataformas
    window.oso.grounded = false;
    for (let platform of window.platforms || []) {
        if (checkCollision(window.oso, platform) && window.oso.vy > 0) {
            window.oso.y = platform.y - window.oso.height;
            window.oso.vy = 0;
            window.oso.grounded = true;
            if (window.oso.action === "jump") window.oso.action = "idle";
        }
    }
    
    // Límite inferior
    if (window.oso.y + window.oso.height > 500) {
        window.oso.y = 500 - window.oso.height;
        window.oso.vy = 0;
        window.oso.grounded = true;
        if (window.oso.action === "jump") window.oso.action = "idle";
    }
}

function updateNormalLevel() {
    // Animar amigos
    for (let friend of window.friends || []) {
        if (!friend.hugged) {
            friend.floating += 0.05;
            friend.y += Math.sin(friend.floating) * 0.5 * friend.floatDir;
        }
    }
    
    // Mover enemigos
    for (let enemy of window.enemies || []) {
        enemy.x += enemy.vx;
        if (enemy.x <= 0 || enemy.x + enemy.width >= 800) {
            enemy.vx *= -1;
        }
        
        // Colisión con oso
        if (checkCollision(window.oso, enemy) && !window.oso.hugging && window.oso.invincible <= 0) {
            hurtOso();
        }
        
        // Abrazar enemigo
        if (checkCollision(window.oso, enemy) && window.oso.hugging) {
            enemy.vx = 0;
            createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 15, "#E91E63");
            const index = window.enemies.indexOf(enemy);
            if (index > -1) window.enemies.splice(index, 1);
            window.gameState.score += 200;
            playSound('enemy');
            createTextParticle(enemy.x + enemy.width/2, enemy.y, "+200", "#E91E63");
        }
    }
    
    if (window.unicorn.cooldown > 0) window.unicorn.cooldown--;
    if (window.oso.hasUnicorn && window.unicorn.power < 100) {
        window.unicorn.power += 0.3;
    }
}

function updateBoss() {
    if (!window.gameState.bossFight) return;
    
    // Movimiento del jefe
    if (window.oso.x < window.boss.x) window.boss.x -= 2;
    if (window.oso.x > window.boss.x) window.boss.x += 2;
    
    // Ataque del jefe
    if (window.boss.attackCooldown <= 0) {
        if (window.boss.warningTimer <= 0) {
            if (window.fireWarningElement) window.fireWarningElement.style.display = 'block';
            window.boss.warningTimer = 60;
            playSound('bossRoar');
        } else {
            window.boss.warningTimer--;
            if (window.boss.warningTimer <= 0) {
                launchFireball();
                window.boss.attackCooldown = window.boss.enraged ? 120 : 180;
                if (window.fireWarningElement) window.fireWarningElement.style.display = 'none';
            }
        }
    } else {
        window.boss.attackCooldown--;
    }
    
    // Actualizar fuego
    for (let i = window.boss.fireballs.length - 1; i >= 0; i--) {
        let fire = window.boss.fireballs[i];
        fire.x += fire.vx;
        fire.y = window.boss.y + window.boss.height / 2;
        
        if (fire.x < -50 || fire.x > 850) {
            window.boss.fireballs.splice(i, 1);
            continue;
        }
        
        if (checkCollision(fire, window.oso) && window.oso.invincible <= 0) {
            window.boss.fireballs.splice(i, 1);
            hurtOso();
            createParticles(window.oso.x + window.oso.width/2, window.oso.y + window.oso.height/2, 15, "#FF4500");
        }
    }
}

function updateHearts() {
    if (!window.gameState.bossFight) return;
    
    for (let heart of window.hearts || []) {
        if (!heart.collected && checkCollision(window.oso, heart)) {
            heart.collected = true;
            window.gameState.heartsCollected++;
            window.gameState.score += 200;
            if (window.heartCountElement) window.heartCountElement.textContent = window.gameState.heartsCollected;
            createParticles(heart.x + heart.width/2, heart.y + heart.height/2, 10, "#FF1493");
            playSound('collect');
            
            if (window.gameState.heartsCollected >= 3 && !window.oso.hasUnicorn) {
                window.oso.hasUnicorn = true;
                window.unicorn.active = true;
                window.unicorn.power = 100;
                if (window.unicornPowerElement) window.unicornPowerElement.style.display = 'flex';
                window.oso.width = 100;
                window.oso.height = 100;
                playSound('powerUp');
                showHint("🦄 ¡El Unicornio de la Amistad ha aparecido! Usa Z para disparar rayos de amor", 5000);
            }
        }
    }
}

function shootHeart() {
    if (!window.unicorn || window.unicorn.cooldown > 0 || window.unicorn.power <= 0) return;
    
    const heartSpeed = 10;
    const heartSize = 25;
    const heartVx = window.oso.direction * heartSpeed;
    const startX = window.oso.direction === 1 ? window.oso.x + window.oso.width : window.oso.x - heartSize;
    
    window.projectiles.push({
        x: startX, y: window.oso.y + window.oso.height / 3,
        vx: heartVx, width: heartSize, height: heartSize
    });
    
    window.unicorn.power -= 10;
    window.unicorn.cooldown = 15;
    playSound('shot');
    createParticles(startX, window.oso.y + window.oso.height / 3, 5, "#FF69B4");
    
    // Dañar al jefe si hay
    if (window.gameState.bossFight) {
        for (let i = 0; i < window.boss.fireballs.length; i++) {
            if (checkCollision(window.projectiles[window.projectiles.length-1], window.boss.fireballs[i])) {
                window.boss.fireballs.splice(i, 1);
                break;
            }
        }
        
        // Impacto en jefe
        if (checkCollision(window.projectiles[window.projectiles.length-1], window.boss)) {
            window.projectiles.pop();
            damageBoss();
        }
    }
}

function damageBoss() {
    if (!window.gameState.bossFight) return;
    
    window.boss.health--;
    updateBossHealth();
    createParticles(window.boss.x + window.boss.width/2, window.boss.y + window.boss.height/2, 20, "#FF69B4");
    playSound('enemy');
    
    if (window.boss.health <= 0) {
        victoryBossFight();
    } else {
        window.boss.x += window.oso.direction * 50;
    }
}

function victoryBossFight() {
    if (!window.gameState.bossFight) return;
    
    window.gameState.bossFight = false;
    showHint("🎉 ¡Has derrotado al Lobo Feroz! ¡El bosque está a salvo!", 5000);
    
    if (window.victoryScreen) {
        window.victoryScreen.style.display = 'flex';
        if (window.finalScoreElement) window.finalScoreElement.textContent = window.gameState.score;
        if (window.finalHeartsElement) window.finalHeartsElement.textContent = window.gameState.heartsCollected;
    }
    
    if (window.gameState.soundEnabled && window.sounds) {
        if (window.sounds.battle) window.sounds.battle.pause();
        playSound('victory');
    }
}

function launchFireball() {
    if (!window.boss) return;
    
    const fireball = {
        x: window.boss.x,
        y: window.boss.y + window.boss.height / 2,
        width: 40, height: 30,
        vx: window.oso.x < window.boss.x ? -8 : 8
    };
    
    window.boss.fireballs.push(fireball);
    playSound('fire');
}

function updateParticles() {
    for (let i = window.particles.length - 1; i >= 0; i--) {
        let p = window.particles[i];
        
        if (p.type === 'text') {
            p.y -= 1;
            p.life--;
        } else {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
        }
        
        if (p.life <= 0) {
            window.particles.splice(i, 1);
        }
    }
}

function checkVictoryConditions() {
    if (!window.gameState || !window.gameState.gameStarted) return;
    
    // Victoria en nivel normal
    if (!window.gameState.bossFight) {
        let allHugged = window.friends.every(friend => friend.hugged);
        if (allHugged && window.friends.length > 0) {
            nextLevel();
        }
    }
}

function updateUI() {
    if (window.scoreElement) window.scoreElement.textContent = window.gameState.score;
    if (window.livesElement) window.livesElement.textContent = "❤️".repeat(window.gameState.lives);
    if (window.unicornPowerLevelElement && window.unicornPowerElement.style.display !== 'none') {
        window.unicornPowerLevelElement.style.width = `${window.unicorn.power}%`;
    }
}

function nextLevel() {
    const nextLevelKey = getNextLevel(window.gameState.currentLevel);
    if (nextLevelKey) {
        window.gameState.score += 500;
        showHint(`🎉 ¡Nivel completado! Bienvenido a ${LEVELS[nextLevelKey].name}`, 4000);
        setupLevel(nextLevelKey);
    } else {
        victoryGameComplete();
    }
}

function getNextLevel(currentLevel) {
    const levels = Object.keys(LEVELS);
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
}

function victoryGameComplete() {
    window.gameState.gameStarted = false;
    if (window.victoryScreen) window.victoryScreen.style.display = 'flex';
    showHint("🏆 ¡FELICITACIONES! Has completado toda la aventura", 10000);
}

function hurtOso() {
    if (!window.gameState || !window.oso) return;
    
    window.gameState.lives--;
    createParticles(window.oso.x + window.oso.width/2, window.oso.y + window.oso.height/2, 20, "#FF5252");
    createTextParticle(window.oso.x + window.oso.width/2, window.oso.y, "-1 Vida", "#FF5252");
    playSound('hurt');
    window.oso.invincible = 120;
    
    if (window.gameState.lives <= 0) {
        gameOver();
    } else {
        window.oso.x = 100;
        window.oso.y = 380;
    }
}

function gameOver() {
    if (!window.gameState) return;
    
    window.gameState.gameStarted = false;
    if (window.startScreen) window.startScreen.style.display = "flex";
    if (window.startButton) window.startButton.textContent = "🔄 Jugar de nuevo";
    
    if (window.gameState.soundEnabled && window.sounds) {
        if (window.sounds.background) window.sounds.background.pause();
        if (window.sounds.battle) window.sounds.battle.pause();
        if (window.sounds.intro) window.sounds.intro.pause();
    }
}

// 🎨 FUNCIONES DE DIBUJO
function draw() {
    if (!window.gameCtx || !window.gameState || !window.gameState.gameStarted) return;
    
    const ctx = window.gameCtx;
    ctx.clearRect(0, 0, 800, 500);
    
    // Fondo
    drawBackground();
    
    // Plataformas
    for (let platform of window.platforms || []) {
        ctx.fillStyle = "#8D6E63";
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.fillStyle = "#5D4037";
        ctx.fillRect(platform.x, platform.y, platform.width, 3);
    }
    
    // Items
    for (let item of window.items || []) {
        drawItem(item);
    }
    
    // Corazones del jefe
    if (window.gameState.bossFight) {
        drawHearts();
    }
    
    // Amigos
    for (let friend of window.friends || []) {
        if (!friend.hugged) {
            drawFriend(friend);
        }
    }
    
    // Enemigos
    for (let enemy of window.enemies || []) {
        drawEnemy(enemy);
    }
    
    // Proyectiles
    for (let p of window.projectiles || []) {
        drawProjectile(p);
    }
    
    // Fuego del jefe
    if (window.gameState.bossFight) {
        drawFireballs();
    }
    
    // Oso
    drawOsoSprite();
    
    // Jefe
    if (window.gameState.bossFight) {
        drawBoss();
    }
    
    // Partículas
    for (let particle of window.particles || []) {
        ctx.globalAlpha = particle.life / 40;
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
    if (window.oso && window.oso.hugging) {
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 4;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(window.oso.x + window.oso.width/2, window.oso.y + window.oso.height/2, 70, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function drawBackground() {
    if (!window.gameCtx) return;
    const ctx = window.gameCtx;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 500);
    if (window.gameState && window.gameState.bossFight) {
        gradient.addColorStop(0, "#2C1810");
        gradient.addColorStop(1, "#8B0000");
    } else {
        gradient.addColorStop(0, "#87CEEB");
        gradient.addColorStop(1, "#E0F7FA");
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);
    
    // Nubes
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    for (let i = 0; i < 5; i++) {
        const x = (Date.now() / 20000 + i * 0.2) % 1.5 * 800 - 100;
        const y = 30 + i * 35;
        drawCloud(x, y, 20 + i * 3);
    }
}

function drawCloud(x, y, size) {
    if (!window.gameCtx) return;
    const ctx = window.gameCtx;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.7, y - size * 0.4, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x + size * 1.4, y, size * 1.1, 0, Math.PI * 2);
    ctx.fill();
}

function drawOsoSprite() {
    if (!window.gameCtx || !window.oso) return;
    const ctx = window.gameCtx;
    
    // Fallback simple
    ctx.fillStyle = window.oso.hasUnicorn ? "#E91E63" : "#8B4513";
    ctx.fillRect(window.oso.x, window.oso.y, window.oso.width, window.oso.height);
    
    // Ojos
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(window.oso.x + 20, window.oso.y + 20, 5, 0, Math.PI * 2);
    ctx.arc(window.oso.x + window.oso.width - 20, window.oso.y + 20, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawFriend(friend) {
    if (!window.gameCtx) return;
    const ctx = window.gameCtx;
    
    ctx.fillStyle = "#4FC3F7";
    ctx.beginPath();
    ctx.arc(friend.x + friend.width/2, friend.y + friend.height/2, friend.width/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Corazón si no ha sido abrazado
    if (!friend.hugged) {
        ctx.fillStyle = "#FF5252";
        ctx.font = "20px Arial";
        ctx.fillText("❤", friend.x + friend.width/2 - 10, friend.y - 10);
    }
}

function drawEnemy(enemy) {
    if (!window.gameCtx) return;
    const ctx = window.gameCtx;
    
    ctx.fillStyle = "#F44336";
    ctx.beginPath();
    ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.width/2, 0, Math.PI * 2);
    ctx.fill();
}

function drawItem(item) {
    if (!window.gameCtx || item.collected) return;
    const ctx = window.gameCtx;
    
    ctx.fillStyle = "#FFB300";
    ctx.beginPath();
    ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
    ctx.fill();
}

function drawProjectile(p) {
    if (!window.gameCtx) return;
    const ctx = window.gameCtx;
    
    ctx.fillStyle = "#FF69B4";
    ctx.beginPath();
    ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/2, 0, Math.PI * 2);
    ctx.fill();
}

function drawHearts() {
    if (!window.gameCtx) return;
    const ctx = window.gameCtx;
    
    for (let heart of window.hearts || []) {
        if (!heart.collected) {
            ctx.fillStyle = "#FF1493";
            ctx.beginPath();
            ctx.arc(heart.x + heart.width/2, heart.y + heart.height/2, heart.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawFireballs() {
    if (!window.gameCtx) return;
    const ctx = window.gameCtx;
    
    for (let fire of window.boss.fireballs || []) {
        ctx.fillStyle = "#FF4500";
        ctx.shadowColor = "#FF6347";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(fire.x + fire.width/2, fire.y + fire.height/2, fire.width/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function drawBoss() {
    if (!window.gameCtx || !window.boss) return;
    const ctx = window.gameCtx;
    
    ctx.fillStyle = window.boss.enraged ? "#8B0000" : "#4B0082";
    ctx.fillRect(window.boss.x, window.boss.y, window.boss.width, window.boss.height);
    
    // Barra de vida sobre el jefe
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(window.boss.x, window.boss.y - 20, window.boss.width, 10);
    
    const healthWidth = (window.boss.health / window.boss.maxHealth) * window.boss.width;
    ctx.fillStyle = window.boss.health > 2 ? "#4CAF50" : "#F44336";
    ctx.fillRect(window.boss.x, window.boss.y - 20, healthWidth, 10);
}

// 🔧 FUNCIONES AUXILIARES
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function createParticles(x, y, count, color) {
    if (!window.particles) window.particles = [];
    for (let i = 0; i < count; i++) {
        window.particles.push({
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
    if (!window.particles) window.particles = [];
    window.particles.push({
        x: x, y: y,
        text: text, color: color,
        life: 80, type: 'text'
    });
}

function playSound(soundName) {
    if (!window.gameState || !window.gameState.soundEnabled || !window.sounds || !window.sounds[soundName]) return;
    
    try {
        const sound = window.sounds[soundName];
        if (sound) {
            const soundClone = new Audio(sound.src);
            soundClone.volume = sound.volume || 0.6;
            soundClone.play().catch(e => console.log("Error reproduciendo sonido:", e));
        }
    } catch (e) {
        console.log("Error con sonido:", e);
    }
}

console.log("🎉 ¡Todas las funciones principales cargadas!");
