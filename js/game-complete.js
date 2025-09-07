// js/game-complete.js - TODO el código JavaScript corregido

// Esperar a que todo esté completamente cargado
window.addEventListener('load', function() {
    console.log("🎮 Iniciando juego Oso Abrazos...");
    
    // Obtener elementos del DOM
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("❌ No se encontró el elemento canvas");
        return;
    }
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("❌ No se pudo obtener el contexto 2D del canvas");
        return;
    }
    
    console.log("✅ Canvas y contexto inicializados correctamente");
    
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
    const soundToggle = document.getElementById("soundToggle");
    const unicornPowerElement = document.getElementById("unicornPower");
    const unicornPowerLevelElement = document.getElementById("unicornPowerLevel");

    // Sprites
    const sprites = {
      oso_idle: new Image(),
      oso_walk: new Image(),
      oso_jump: new Image(),
      oso_run: new Image(),
      oso_sit: new Image(),
      oso_hugging: new Image(),
      oso_portada: new Image(),
      ardilla: new Image(),
      conejo: new Image(),
      pajarito: new Image(),
      Enemigos_01: new Image(),
      Enemigos_02: new Image(),
      Enemigos_03: new Image(),
      miel: new Image(),
      uni_solo: new Image(),    // Unicornio solo
      osoyuni: new Image(),     // Oso montando unicornio
      uni_run: new Image(),
      uni_shup: new Image(),
      uni_corazon: new Image(),
      // Fondos
      bosque1: new Image(),
      bosque2: new Image(),
      bosque3: new Image(),
      bosque4: new Image()
    };
    
    // URLs CORREGIDAS
    const baseUrl = "https://raw.githubusercontent.com/Evelez23/-microdelecion/main/img/";
    const imageUrls = {
      oso_idle: `${baseUrl}oso/oso_idle.svg`,
      oso_walk: `${baseUrl}oso/oso_walk.svg`,
      oso_jump: `${baseUrl}oso/oso_jump.svg`,
      oso_run: `${baseUrl}oso/oso_run.svg`,
      oso_sit: `${baseUrl}oso/oso_sit.svg`,
      oso_hugging: `${baseUrl}oso/oso_hugging.svg`,
      oso_portada: `${baseUrl}oso/oso_portada.jpg`,
      ardilla: `${baseUrl}Amigos/ardilla.png`,
      conejo: `${baseUrl}Amigos/conejo.png`,
      pajarito: `${baseUrl}Amigos/pajarito.png`,
      Enemigos_01: `${baseUrl}enemigos/Enemigos-01.svg`,
      Enemigos_02: `${baseUrl}enemigos/Enemigos-02.svg`,
      Enemigos_03: `${baseUrl}enemigos/Enemigos-03.svg`,
      miel: `${baseUrl}Amigos/miel.png`,
      uni_solo: `${baseUrl}Amigos/unien4patas.png`,  // Unicornio solo
      osoyuni: `${baseUrl}Amigos/osoyuni.png`,       // Oso montando unicornio
      uni_run: `${baseUrl}Amigos/unirun.png`,
      uni_shup: `${baseUrl}Amigos/unirshup.png`,
      uni_corazon: `${baseUrl}Amigos/lovepower.png`,
      // Fondos
      bosque1: `${baseUrl}fondos/bosque1.jpg`,
      bosque2: `${baseUrl}fondos/bosque2.jpg`,
      bosque3: `${baseUrl}fondos/bosque3.jpg`,
      bosque4: `${baseUrl}fondos/bosque4.jpg`
    };

    // Sonidos desactivados temporalmente
    const sounds = {};

    // Estado del juego
    let gameState = {
      score: 0,
      lives: 3,
      level: 1,
      gameStarted: false,
      soundEnabled: false
    };

    // Estado del oso
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

    // Estado del unicornio
    let unicorn = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        active: false,
        power: 100,
        cooldown: 0
    };

    // Elementos del juego
    let platforms = [
      {x: 0, y: 450, width: 800, height: 50},
      {x: 200, y: 350, width: 100, height: 20},
      {x: 400, y: 300, width: 100, height: 20},
      {x: 600, y: 250, width: 100, height: 20}
    ];

    let friends = [];
    let enemies = [];
    let items = [];
    let projectiles = [];
    let particles = [];
    let hintTimer = 0;
    let keys = {};
    let fondoActual = 'bosque1';

    // Teclas
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

    function shootHeart() {
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
    }

    // Iniciar juego
    startButton.addEventListener("click", startGame);

    // Control de sonido
    soundToggle.addEventListener("click", toggleSound);

    function toggleSound() {
      gameState.soundEnabled = !gameState.soundEnabled;
      
      if (gameState.soundEnabled) {
        soundToggle.textContent = "🔊";
      } else {
        soundToggle.textContent = "🔇";
      }
    }

    // Precargar recursos
    let totalResources = Object.keys(imageUrls).length;
    let loadedResources = 0;

    function loadResources() {
      console.log("🔄 Iniciando carga de recursos...");
      
      for (let key in imageUrls) {
        const img = sprites[key];
        img.crossOrigin = "Anonymous";
        
        img.onload = () => {
          loadedResources++;
          const progress = Math.floor((loadedResources / totalResources) * 100);
          loadingProgress.style.width = `${progress}%`;
          loadingText.textContent = `${progress}%`;
          
          console.log(`✅ ${key} cargado: ${imageUrls[key]}`);
          
          if (loadedResources === totalResources) {
            console.log("🎉 ¡Todos los recursos cargados!");
            setTimeout(() => {
              loadingScreen.style.display = "none";
              startScreen.style.display = "flex";
              coverImage.src = imageUrls.oso_portada;
            }, 500);
          }
        };
        
        img.onerror = (e) => {
          console.error(`❌ ERROR cargando ${key}:`, imageUrls[key]);
          loadedResources++;
          
          if (loadedResources === totalResources) {
            loadingScreen.style.display = "none";
            startScreen.style.display = "flex";
          }
        };
        
        console.log(`📦 Cargando: ${key} -> ${imageUrls[key]}`);
        img.src = imageUrls[key];
      }
    }

    function startGame() {
      gameState.gameStarted = true;
      startScreen.style.display = "none";
      resetLevel();
      
      showHint("Acércate a los amigos y presiona ESPACIO para abrazarlos", 5000);
      
      gameLoop();
    }

    function resetLevel() {
      oso.x = 100;
      oso.y = 380;
      oso.vx = 0;
      oso.vy = 0;
      oso.action = "idle";
      oso.hugging = false;
      oso.invincible = 0;
      
      // Reiniciar estado del unicornio
      oso.hasUnicorn = false;
      oso.width = 80;
      oso.height = 80;
      unicornPowerElement.style.display = 'none';

      // Generar amigos
      friends = [];
      const friendTypes = ['ardilla', 'conejo', 'pajarito'];
      for (let i = 0; i < 5 + gameState.level; i++) {
        const typeIndex = Math.floor(Math.random() * friendTypes.length);
        let friendX;
        let attempts = 0;
        
        // Evitar que los amigos aparezcan muy cerca del oso
        do {
            friendX = Math.random() * 700 + 50;
            attempts++;
        } while (Math.abs(friendX - oso.x) < 100 && attempts < 20);
        
        friends.push({
          x: friendX,
          y: 380,
          width: 60,
          height: 60,
          hugged: false,
          type: friendTypes[typeIndex],
          floating: 0,
          floatDir: Math.random() > 0.5 ? 1 : -1
        });
      }
      
      // Generar enemigos
      enemies = [];
      if (gameState.level > 1) {
        const enemyTypes = ['Enemigos_01', 'Enemigos_02', 'Enemigos_03'];
        for (let i = 0; i < gameState.level - 1; i++) {
          let enemyX;
          let attempts = 0;
          
          // Evitar que los enemigos aparezcan muy cerca del oso
          do {
              enemyX = Math.random() * 700 + 50;
              attempts++;
          } while (Math.abs(enemyX - oso.x) < 200 && attempts < 20);
          
          enemies.push({
            x: enemyX,
            y: 380,
            width: 50,
            height: 50,
            vx: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()),
            type: enemyTypes[Math.floor(Math.random() * enemyTypes.length)]
          });
        }
      }
      
      // Generar items (miel)
      items = [];
      for (let i = 0; i < 3 + gameState.level; i++) {
        let itemX;
        let attempts = 0;
        
        do {
            itemX = Math.random() * 700 + 50;
            attempts++;
        } while (Math.abs(itemX - oso.x) < 100 && attempts < 20);
        
        items.push({
          x: itemX,
          y: Math.random() * 300 + 100,
          width: 30,
          height: 30,
          collected: false,
          type: 'miel'
        });
      }

      // Generar unicornio en nivel 2+
      if (gameState.level >= 2) {
          let unicornX;
          let attempts = 0;
          
          do {
              unicornX = Math.random() * 700 + 50;
              attempts++;
          } while (Math.abs(unicornX - oso.x) < 150 && attempts < 20);
          
          items.push({
              x: unicornX,
              y: 380,
              width: 80,
              height: 80,
              collected: false,
              type: 'uni_solo'
          });
          showHint("¡Mira! Un unicornio mágico ha aparecido. Acércate a él para montarlo", 5000);
      }
    }

    function showHint(text, duration) {
      hintElement.textContent = text;
      hintElement.style.display = "block";
      hintTimer = duration / 16.67;
    }

    function update() {
      if (!gameState.gameStarted) return;
      
      if (hintTimer > 0) {
        hintTimer--;
        if (hintTimer <= 0) {
          hintElement.style.display = "none";
        }
      }
      
      if (oso.invincible > 0) oso.invincible--;
      
      oso.vx = 0;
      if ((keys["ArrowRight"] || keys["d"]) && !oso.hugging) {
        oso.vx = oso.speed;
        oso.action = oso.grounded ? "run" : "jump";
        oso.direction = 1;
      } else if ((keys["ArrowLeft"] || keys["a"]) && !oso.hugging) {
        oso.vx = -oso.speed;
        oso.action = oso.grounded ? "run" : "jump";
        oso.direction = -1;
      } else if (!oso.hugging) {
        oso.action = oso.grounded ? "idle" : "jump";
      }

      if (oso.hasUnicorn) {
        oso.action = (oso.vx !== 0) ? 'uni_run' : 'osoyuni';
        if (keys["z"] && unicorn.cooldown <= 0) {
            shootHeart();
        }
      }
      
      if ((keys["ArrowUp"] || keys["w"]) && oso.grounded && !oso.hugging) {
        oso.vy = -oso.jumpForce;
        oso.grounded = false;
        oso.action = "jump";
        createParticles(oso.x + oso.width/2, oso.y + oso.height, 5, "#8BC34A");
        playSound('jump');
      }
      
     if (keys[" "] && oso.hugCooldown <= 0 && oso.grounded) {
        oso.action = "hugging";
        oso.hugging = true;
        oso.hugCooldown = 30;
        oso.vx = 0;
        
        let huggedFriend = false;
        
        // Aumentar el rango de detección del abrazo
        const hugRange = 100;
        
        for (let friend of friends) {
          if (!friend.hugged) {
            // Crear un área de detección más grande para el abrazo
            const hugArea = {
              x: oso.x - (hugRange - oso.width) / 2,
              y: oso.y - (hugRange - oso.height) / 2,
              width: hugRange,
              height: hugRange
            };
            
            const friendArea = {
              x: friend.x,
              y: friend.y,
              width: friend.width,
              height: friend.height
            };
            
            if (checkCollision(hugArea, friendArea)) {
              friend.hugged = true;
              gameState.score += 100;
              huggedFriend = true;
              createParticles(friend.x + friend.width/2, friend.y + friend.height/2, 10, "#FFD700");
              playSound('hug');
              
              createTextParticle(friend.x + friend.width/2, friend.y, "+100", "#FFD700");
            }
          }
        }
      }
      
      if (oso.hugCooldown > 0) {
        oso.hugCooldown--;
        if (oso.hugCooldown === 0) {
          oso.hugging = false;
        }
      }
      
      oso.vy += oso.gravity;
      oso.x += oso.vx;
      
      if (oso.x < 0) oso.x = 0;
      if (oso.x + oso.width > canvas.width) oso.x = canvas.width - oso.width;
      
      oso.y += oso.vy;
      
      oso.grounded = false;
      for (let platform of platforms) {
        if (
          oso.x + oso.width > platform.x &&
          oso.x < platform.x + platform.width &&
          oso.y + oso.height > platform.y &&
          oso.y + oso.height <= platform.y + platform.height + oso.vy &&
          oso.vy > 0
        ) {
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
      
      for (let friend of friends) {
        friend.floating += 0.05;
        friend.y += Math.sin(friend.floating) * 0.5 * friend.floatDir;
      }
      
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
            // Cambiar tamaño del oso cuando monta el unicornio
            oso.width = 100;
            oso.height = 100;
            playSound('powerUp');
            showHint("¡Has montado el unicornio! Usa Z o el mouse para disparar corazones", 5000);
          }
          items.splice(i, 1);
        }
      }

      for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        p.x += p.vx;

        if (p.x < -p.width || p.x > canvas.width + p.width) {
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

      if (unicorn.cooldown > 0) {
          unicorn.cooldown--;
      }
      
      if (oso.hasUnicorn && unicorn.power < 100) {
          unicorn.power += 0.2;
      }
      unicornPowerLevelElement.style.width = `${unicorn.power}%`;

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
      
      let allHugged = true;
      for (let friend of friends) {
        if (!friend.hugged) {
          allHugged = false;
          break;
        }
      }
      
      if (allHugged && friends.length > 0) {
        gameState.level++;
        levelElement.textContent = gameState.level;
        showHint(`¡Nivel ${gameState.level}! Encuentra y abraza a más amigos`, 3000);
        resetLevel();
      }
      
      scoreElement.textContent = gameState.score;
      livesElement.textContent = "❤️".repeat(gameState.lives);
    }

    function playSound(soundName) {
      console.log(`🔊 Sonido: ${soundName} (sonidos desactivados temporalmente)`);
    }

    function drawOsoSprite() {
      let spriteName;
      
      if (oso.hasUnicorn) {
        spriteName = (oso.vx !== 0) ? 'uni_run' : 'osoyuni';
      } else {
        spriteName = `oso_${oso.action}`;
      }
      
      const sprite = sprites[spriteName] || sprites.oso_idle;

      if (oso.invincible > 0 && oso.invincible % 6 < 3) {
        ctx.globalAlpha = 0.5;
      }

      if (sprite.complete && sprite.naturalWidth > 0) {
        ctx.save();
        if (oso.direction === -1) {
          ctx.scale(-1, 1);
          ctx.drawImage(sprite, -oso.x - oso.width, oso.y, oso.width, oso.height);
        } else {
          ctx.drawImage(sprite, oso.x, oso.y, oso.width, oso.height);
        }
        ctx.restore();
      } else {
        ctx.fillStyle = "#3E2723";
        ctx.fillRect(oso.x, oso.y, oso.width, oso.height);
        
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(oso.action, oso.x, oso.y - 5);
      }
      
      ctx.globalAlpha = 1;
    }

    function drawFriend(friend) {
      const sprite = sprites[friend.type];
      
      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(sprite, friend.x, friend.y, friend.width, friend.height);
      } else {
        ctx.fillStyle = "#4FC3F7";
        ctx.beginPath();
        ctx.arc(friend.x + friend.width/2, friend.y + friend.height/2, friend.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        ctx.fillText(friend.type, friend.x, friend.y - 5);
      }
      
      if (!friend.hugged) {
        ctx.fillStyle = "#FF5252";
        ctx.beginPath();
        ctx.moveTo(friend.x + friend.width/2, friend.y - 15 + Math.sin(Date.now()/300) * 5);
        ctx.bezierCurveTo(
          friend.x + friend.width/2, friend.y - 25 + Math.sin(Date.now()/300) * 5,
          friend.x + friend.width/2 + 10, friend.y - 30 + Math.sin(Date.now()/300) * 5,
          friend.x + friend.width/2 + 10, friend.y - 20 + Math.sin(Date.now()/300) * 5
        );
        ctx.bezierCurveTo(
          friend.x + friend.width/2 + 10, friend.y - 15 + Math.sin(Date.now()/300) * 5,
          friend.x + friend.width/2, friend.y - 10 + Math.sin(Date.now()/300) * 5,
          friend.x + friend.width/2, friend.y - 15 + Math.sin(Date.now()/300) * 5
        );
        ctx.bezierCurveTo(
          friend.x + friend.width/2, friend.y - 10 + Math.sin(Date.now()/300) * 5,
          friend.x + friend.width/2 - 10, friend.y - 15 + Math.sin(Date.now()/300) * 5,
          friend.x + friend.width/2 - 10, friend.y - 20 + Math.sin(Date.now()/300) * 5
        );
                ctx.bezierCurveTo(
          friend.x + friend.width/2 - 10, friend.y - 30 + Math.sin(Date.now()/300) * 5,
          friend.x + friend.width/2, friend.y - 25 + Math.sin(Date.now()/300) * 5,
          friend.x + friend.width/2, friend.y - 15 + Math.sin(Date.now()/300) * 5
        );
        ctx.fill();
      }
    }

    function drawEnemy(enemy) {
      const sprite = sprites[enemy.type];
      
      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.save();
        if (enemy.vx < 0) {
          ctx.scale(-1, 1);
          ctx.drawImage(sprite, -enemy.x - enemy.width, enemy.y, enemy.width, enemy.height);
        } else {
          ctx.drawImage(sprite, enemy.x, enemy.y, enemy.width, enemy.height);
        }
        ctx.restore();
      } else {
        ctx.fillStyle = "#F44336";
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.width/2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawItem(item) {
        if (!item.collected) {
            const sprite = sprites[item.type] || null;
            if (sprite && sprite.complete && sprite.naturalWidth > 0) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(sprite, item.x, item.y, item.width, item.height);
            } else {
                ctx.fillStyle = "#FFB300";
                ctx.beginPath();
                ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
                ctx.fill();
                
                if (item.type === 'uni_solo') {
                  ctx.fillStyle = "#FF69B4";
                  ctx.beginPath();
                  ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
                  ctx.fill();
                }
            }
        }
    }

    function drawProjectile(p) {
        const sprite = sprites.uni_corazon;
        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
            ctx.drawImage(sprite, p.x, p.y, p.width, p.height);
        } else {
            ctx.fillStyle = "#FF69B4";
            ctx.beginPath();
            ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function draw() {
      if (!gameState.gameStarted) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawBackground();
      
      for (let platform of platforms) {
        ctx.fillStyle = "#8D6E63";
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.fillStyle = "#5D4037";
        ctx.fillRect(platform.x, platform.y, platform.width, 5);
      }
      
      for (let item of items) {
          drawItem(item);
      }
      
      for (let friend of friends) {
        if (!friend.hugged) {
          drawFriend(friend);
        }
      }
      
      for (let enemy of enemies) {
        drawEnemy(enemy);
      }

      for (let p of projectiles) {
          drawProjectile(p);
      }
      
      drawOsoSprite();
      
      for (let particle of particles) {
        ctx.globalAlpha = particle.life / 30;
        ctx.fillStyle = particle.color;
        
        if (particle.type === 'text') {
          ctx.font = '16px Comic Sans MS';
          ctx.fillText(particle.text, particle.x, particle.y);
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      
      if (oso.hugging) {
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(oso.x + oso.width/2, oso.y + oso.height/2, 60, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function drawBackground() {
      // Usar fondo diferente según el nivel
      const fondosPorNivel = ['bosque1', 'bosque2', 'bosque3', 'bosque4'];
      const fondoIndex = Math.min(gameState.level - 1, fondosPorNivel.length - 1);
      fondoActual = fondosPorNivel[fondoIndex];
      
      const fondo = sprites[fondoActual];
      
      if (fondo && fondo.complete && fondo.naturalWidth > 0) {
        // Dibujar el fondo de bosque
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
      } else {
        // Fallback al gradient antiguo si el fondo no está cargado
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#87CEEB");
        gradient.addColorStop(1, "#E0F7FA");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Montañas (solo si no hay fondo)
        ctx.fillStyle = "#78909C";
        ctx.beginPath();
        ctx.moveTo(0, 400);
        ctx.lineTo(200, 400);
        ctx.lineTo(100, 300);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(150, 400);
        ctx.lineTo(350, 400);
        ctx.lineTo(250, 280);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(600, 400);
        ctx.lineTo(800, 400);
        ctx.lineTo(700, 320);
        ctx.fill();
      }
      
      // Nubes (siempre visibles)
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let i = 0; i < 5; i++) {
        const x = (Date.now() / 30000 + i * 0.2) % 1 * canvas.width * 2 - canvas.width;
        const y = 50 + i * 40;
        drawCloud(x, y);
      }
    }

    function drawCloud(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.arc(x + 15, y - 10, 15, 0, Math.PI * 2);
      ctx.arc(x + 35, y, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkCollision(obj1, obj2) {
      return obj1.x < obj2.x + obj2.width &&
             obj1.x + obj1.width > obj2.x &&
             obj1.y < obj2.y + obj2.height &&
             obj1.y + obj1.height > obj2.y;
    }

    function createParticles(x, y, count, color) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          size: Math.random() * 5 + 2,
          color: color,
          life: 30
        });
      }
    }

    function createTextParticle(x, y, text, color) {
      particles.push({
        x: x,
        y: y,
        text: text,
        color: color,
        life: 60,
        type: 'text'
      });
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

    function gameOver() {
      gameState.gameStarted = false;
      startScreen.style.display = "flex";
      startButton.textContent = "Jugar de nuevo";
      
      const gameOverText = document.createElement("div");
      gameOverText.innerHTML = `<h2>¡Game Over!</h2><p>Puntuación final: ${gameState.score}</p>`;
      gameOverText.style.textAlign = "center";
      gameOverText.style.marginTop = "20px";
      gameOverText.style.color = "#FFD700";
      
      if (!document.getElementById("gameOverText")) {
        gameOverText.id = "gameOverText";
        startScreen.appendChild(gameOverText);
      } else {
        document.getElementById("gameOverText").innerHTML = gameOverText.innerHTML;
      }
      
      gameState.score = 0;
      gameState.lives = 3;
      gameState.level = 1;
      scoreElement.textContent = "0";
      levelElement.textContent = "1";
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    // Iniciar carga de recursos
    loadResources();
});
