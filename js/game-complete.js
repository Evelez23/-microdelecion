/* ============================================================
   Oso Abrazos - game-complete.js (versión corregida e integrada)
   ============================================================ */

// Esta versión está diseñada para integrarse con el juego principal
// y soluciona los problemas de movimiento de enemigos y sistema de vidas

(function () {
  // Solo ejecutar si el canvas existe
  if (!document.getElementById("gameCanvas")) return;
  
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // ========================
  // Configuración general
  // ========================
  const GAME_WIDTH = canvas.width;
  const GAME_HEIGHT = canvas.height;

  // Integración con el juego principal
  let currentLevel = window.gameState ? window.gameState.currentLevel : "1-1";
  let score = window.gameState ? window.gameState.score : 0;
  let lives = window.gameState ? window.gameState.lives : 3;
  let isGameOver = false;

  // ========================
  // Clases mejoradas para integración
  // ========================
  class Player {
    constructor() {
      this.x = 100;
      this.y = GAME_HEIGHT - 120;
      this.width = 60;
      this.height = 60;
      this.speedY = 0;
      this.gravity = 0.6;
      this.jumpPower = -12;
      this.grounded = true;
      this.sprite = window.sprites ? window.sprites.idle : null;
      this.invincible = 0; // Para evitar daño inicial
    }

    update() {
      this.y += this.speedY;
      if (!this.grounded) this.speedY += this.gravity;

      if (this.y + this.height >= GAME_HEIGHT - 20) {
        this.y = GAME_HEIGHT - 20 - this.height;
        this.speedY = 0;
        this.grounded = true;
      }
      
      // Reducir tiempo de invencibilidad
      if (this.invincible > 0) this.invincible--;
    }

    jump() {
      if (this.grounded) {
        this.speedY = this.jumpPower;
        this.grounded = false;
        if (window.playSound) window.playSound("jump");
      }
    }

    draw() {
      if (this.sprite && this.sprite.complete) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
      } else {
        ctx.fillStyle = "brown";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
      
      // Efecto de invencibilidad (parpadeo)
      if (this.invincible > 0 && this.invincible % 10 < 5) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
      }
    }
  }

  class Enemy {
  constructor(x, y, type = 0) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speedX = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2);
    this.type = type;
    
    // Asignar sprite según tipo
    if (window.sprites) {
      switch(type) {
        case 0: this.sprite = window.sprites.enemy1; break;
        case 1: this.sprite = window.sprites.enemy2; break;
        case 2: this.sprite = window.sprites.enemy3; break;
        default: this.sprite = window.sprites.enemy1;
      }
    } else {
      this.sprite = null;
    }
    
    this.moveRange = 150 + Math.random() * 100;
    this.startX = x;
    this.moveCooldown = 0;
  }

  update() {
    // Movimiento lateral
    if (this.moveCooldown <= 0) {
      this.x += this.speedX;
      
      // Cambiar dirección si supera el rango de movimiento
      if (Math.abs(this.x - this.startX) > this.moveRange) {
        this.speedX *= -1;
        this.moveCooldown = 30; // Pequeña pausa al cambiar dirección
      }
    } else {
      this.moveCooldown--;
    }
    
    // Mantener dentro de los límites de la pantalla
    if (this.x < 20) {
      this.x = 20;
      this.speedX *= -1;
      this.moveCooldown = 30;
    }
    if (this.x > GAME_WIDTH - this.width - 20) {
      this.x = GAME_WIDTH - this.width - 20;
      this.speedX *= -1;
      this.moveCooldown = 30;
    }
  }

  draw() {
    if (this.sprite && this.sprite.complete) {
      // Voltear sprite según dirección
      ctx.save();
      if (this.speedX < 0) {
        ctx.scale(-1, 1);
        ctx.drawImage(this.sprite, -this.x - this.width, this.y, this.width, this.height);
      } else {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
      }
      ctx.restore();
    } else {
      ctx.fillStyle = "purple";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

   // Añadir estas imágenes a la lista de sprites
sprites.bossPhase1 = new Image();
sprites.bossPhase2 = new Image();
sprites.bossPhase3 = new Image();

// Añadir estas URLs a imageUrls
imageUrls.bossPhase1 = "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/41296616cc8e88066d9db7c38be0939b9302996a/img/enemigos/lobo.svg";
imageUrls.bossPhase2 = "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/img/enemigos/loboferoz.png";
imageUrls.bossPhase3 = "https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/refs/heads/main/img/enemigos/lobotriste.png";

// Modificar la función updateBoss para manejar las fases
function updateBoss() {
  // Reducir cooldown de ataque
  if (window.boss.attackCooldown > 0) {
    window.boss.attackCooldown--;
  }
  
  // Reducir timer de advertencia
  if (window.boss.warningTimer > 0) {
    window.boss.warningTimer--;
    
    // Ocultar advertencia cuando el timer llega a 0
    if (window.boss.warningTimer === 0) {
      const fireWarningElement = document.getElementById('fireWarning');
      if (fireWarningElement) fireWarningElement.style.display = 'none';
    }
  }
  
  // Determinar la fase del jefe según su salud
  if (window.boss.health >= 4) {
    window.boss.phase = 1; // Lobo normal
  } else if (window.boss.health >= 2) {
    window.boss.phase = 2; // Lobo feroz
    if (!window.boss.enraged) {
      window.boss.enraged = true;
      showHint("¡El lobo se ha enfurecido! ¡Ten cuidado!", 3000);
    }
  } else {
    window.boss.phase = 3; // Lobo triste/débil
  }
  
  // Atacar si el cooldown está listo
  if (window.boss.attackCooldown <= 0) {
    // Mostrar advertencia de ataque
    const fireWarningElement = document.getElementById('fireWarning');
    if (fireWarningElement) fireWarningElement.style.display = 'block';
    window.boss.warningTimer = 60;
    
    // Lanzar bola de fuego después de un breve retraso
    setTimeout(() => {
      if (window.gameState.bossFight && window.boss.health > 0) {
        window.boss.fireballs.push({
          x: window.boss.x,
          y: window.boss.y + window.boss.height/2,
          vx: -5,
          vy: 0,
          radius: 15,
          damage: 1
        });
        
        // Reproducir sonido de ataque
        playSound("enemy");
      }
    }, 1000);
    
    // Reiniciar cooldown de ataque (más rápido según la fase)
    let cooldownTime = 150;
    if (window.boss.phase === 2) cooldownTime = 100;
    if (window.boss.phase === 3) cooldownTime = 120;
    
    window.boss.attackCooldown = cooldownTime;
  }
  
  // Movimiento del jefe (solo en fases 1 y 2)
  if (window.boss.phase < 3) {
    window.boss.x += Math.sin(Date.now() / 200) * 0.5;
  }
}

// Modificar la función draw para dibujar la fase correcta del jefe
// Dibujar jefe si está activo
if (window.gameState.bossFight) {
  let bossSprite;
  
  switch (window.boss.phase) {
    case 1:
      bossSprite = sprites.bossPhase1;
      break;
    case 2:
      bossSprite = sprites.bossPhase2;
      break;
    case 3:
      bossSprite = sprites.bossPhase3;
      break;
    default:
      bossSprite = sprites.bossPhase1;
  }
  
  if (bossSprite && bossSprite.complete) {
    // Jefe siempre mirando hacia la izquierda
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(bossSprite, -window.boss.x - window.boss.width, window.boss.y, window.boss.width, window.boss.height);
    ctx.restore();
  } else {
    // Placeholder si el sprite no está cargado
    ctx.fillStyle = window.boss.phase === 2 ? '#FF0000' : (window.boss.phase === 3 ? '#888888' : '#808080');
    ctx.fillRect(window.boss.x, window.boss.y, window.boss.width, window.boss.height);
  }
}
  // ========================
  // Integración con el juego principal
  // ========================
  const player = new Player();
  let enemies = [];

  function spawnEnemy() {
    const type = Math.floor(Math.random() * 3);
    const y = GAME_HEIGHT - 70;
    const x = 100 + Math.random() * (GAME_WIDTH - 200); // Posición aleatoria
    enemies.push(new Enemy(x, y, type));
  }

  function updateGame() {
    if (isGameOver) return;
    
    player.update();
    enemies.forEach(e => e.update());

    // Detectar colisiones solo si el jugador no es invencible
    if (player.invincible <= 0) {
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (
          player.x < e.x + e.width &&
          player.x + player.width > e.x &&
          player.y < e.y + e.height &&
          player.height + player.y > e.y
        ) {
          // Reducir vidas y hacer invencible temporalmente
          if (window.gameState) window.gameState.lives--;
          if (window.playSound) window.playSound("hurt");
          player.invincible = 120; // 2 segundos de invencibilidad
          
          if (window.gameState && window.gameState.lives <= 0) {
            isGameOver = true;
            if (window.gameOver) window.gameOver();
          }
          break;
        }
      }
    }
  }

  function drawGame() {
    // Esta función se integra con el bucle principal del juego
    player.draw();
    enemies.forEach(e => e.draw());
  }

  function clearEnemies() {
    enemies = [];
  }

  // ========================
  // Integración con controles existentes
  // ========================
  function initIntegratedGame() {
    console.log("✅ Juego integrado inicializado");
    
    // Limpiar enemigos existentes
    clearEnemies();
    
    // Generar enemigos iniciales según el nivel
    const enemyCount = currentLevel === "2-3" ? 0 : 3 + (parseInt(currentLevel[0]) * 2);
    for (let i = 0; i < enemyCount; i++) {
      spawnEnemy();
    }
    
    // Configurar invencibilidad inicial
    player.invincible = 120;
    
    // Integrar con el bucle principal del juego
    if (window.integratedUpdate) {
      window.originalUpdate = window.update;
      window.update = function() {
        window.originalUpdate();
        updateGame();
      };
      
      window.originalDraw = window.draw;
      window.draw = function() {
        window.originalDraw();
        drawGame();
      };
    }
  }

  // ========================
  // Inicialización cuando el juego principal esté listo
  // ========================
  if (window.gameState) {
    // El juego principal ya está cargado
    initIntegratedGame();
  } else {
    // Esperar a que el juego principal se cargue
    const checkGameReady = setInterval(() => {
      if (window.gameState && window.update && window.draw) {
        clearInterval(checkGameReady);
        initIntegratedGame();
      }
    }, 100);
  }

  // Hacer funciones disponibles globalmente para integración
  window.integratedUpdate = updateGame;
  window.integratedDraw = drawGame;
  window.spawnEnemy = spawnEnemy;
  window.clearEnemies = clearEnemies;

})();

// Sonidos
const sounds = {
  background: new Audio(`${baseUrl}/sounds/background.mp3`),
  jump: new Audio(`${baseUrl}/sounds/jump.mp3`),
  collect: new Audio(`${baseUrl}/sounds/collect.mp3`),
  hug: new Audio(`${baseUrl}/sounds/hug.mp3`),
  hurt: new Audio(`${baseUrl}/sounds/hurt.mp3`),
  enemy: new Audio(`${baseUrl}/sounds/enemy.mp3`),
  powerup: new Audio(`${baseUrl}/sounds/powerup.mp3`),
  shot: new Audio(`${baseUrl}/sounds/shot.mp3`),
  bossBattle: new Audio(`${baseUrl}/sounds/para%20la%20batalla.mp3`),
  intro: new Audio(`${baseUrl}/sounds/intro.mp3`)
};
