// audio.js - Gestión de audio

const sounds = {
    // Sonidos desactivados temporalmente
};

window.playSound = function(soundName) {
    console.log(`🔊 Sonido: ${soundName} (sonidos desactivados temporalmente)`);
};

window.toggleSound = function() {
    gameState.soundEnabled = !gameState.soundEnabled;
    
    if (gameState.soundEnabled) {
        soundToggle.textContent = "🔊";
    } else {
        soundToggle.textContent = "🔇";
    }
};
