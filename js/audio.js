// audio.js - Gestión de audio

const sounds = {
    // Sonidos desactivados temporalmente
};

function playSound(soundName) {
    console.log(`🔊 Sonido: ${soundName} (sonidos desactivados temporalmente)`);
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    
    if (gameState.soundEnabled) {
        soundToggle.textContent = "🔊";
    } else {
        soundToggle.textContent = "🔇";
    }
}
