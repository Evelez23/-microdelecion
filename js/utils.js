// utils.js - Funciones de utilidad general

function getProxyUrl(url) {
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
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

function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 10, 15, 0, Math.PI * 2);
    ctx.arc(x + 35, y, 25, 0, Math.PI * 2);
    ctx.fill();
}
