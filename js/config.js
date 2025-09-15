// Configuración del juego - URLs de recursos
const imageUrls = {
    bear: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/oso/oso_idle.svg',
    bearJump: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/oso/oso_jump.svg',
    bearHug: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/oso/oso_hugging.svg',
    wolf: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/enemigos/lobo.svg',
    wolfAngry: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/enemigos/loboferoz.png',
    wolfHurt: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/enemigos/lobotriste.png',
    heart: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/Amigos/lovepower.png',
    unicorn: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/Amigos/unirshup.png',
    bearWithUnicorn: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/Amigos/osoyuni.png',
    background1: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/fondos/bosque1.jpg',
    background2: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/fondos/bosque2.jpg',
    background3: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/fondos/bosque3.jpg',
    background4: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/fondos/bosque4.jpg',
    background5: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/fondos/background_1_2.jpeg',
    backgroundBoss: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/fondos/background%20final.jpeg',
    enemy1: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/enemigos/Enemigos-01.svg',
    enemy2: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/enemigos/Enemigos-02.svg',
    enemy3: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/极/img/enemigos/Enemigos-03.svg',
    fireball: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/enemigos/fire.png',
    squirrel: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/Amigos/ardilla.png',
    rabbit: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/Amigos/conejo.png',
    bird: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/极igos/pajarito.png',
    honey: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/img/Amigos/miel.png'
};

// URLs para sonidos
const soundUrls = {
    background: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/sounds/background.mp3.mp3',
    jump: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/sounds/jump.mp3.mp3',
    collect: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/sounds/collect.mp3.mp3',
    hug: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/sounds/hug.mp3.mp3',
    hurt: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/sounds/hurt.mp3.mp3',
    enemy: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/sounds/enemy.mp3.mp3',
    powerup: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/sounds/powerup.mp3.mp3',
    bossBattle: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/sounds/para%20la%20batalla.mp3',
    victory: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/sounds/power-up-game-sound-effect-359227.mp3',
    shoot: 'https://raw.githubusercontent.com/Evelez23/-oso.abrazos-/main/sounds/shot.mp3.mp3'
};

// Configuración de niveles
const LEVELS = {
    "1-1": { name: "Bosque Inicial", friends: 3, enemies: 0, items: 2, hearts: 3, hasBoss: false },
    "1-2": { name: "Claro Soleado", friends: 4, enemies: 3, items: 3, hearts: 0, hasBoss: false },
    "1-3": { name: "Cueva Misteriosa", friends: 5, enemies: 4, items: 4, hearts: 0, hasBoss: false },
    "2-1": { name: "Montañas Altas", friends: 4, enemies: 5, items: 3, hearts: 3, hasBoss: false },
    "2-2": { name: "Cascada Brillante", friends: 5, enemies: 5, items: 4, hearts: 0, hasBoss: false },
    "2-3": { name: "Guarida del Lobo", friends: 0, enemies: 0, items: 0, hearts: 0, hasBoss: true }
};

// Variables globales del juego
let gameConfig = {
    playerSpeed: 5,
    playerJumpForce: 15,
    gravity: 0.7,
    bossHealth: 5,
    unicornPowerDuration: 300,
    shootCooldown: 20,
    invincibilityDuration: 120
};
