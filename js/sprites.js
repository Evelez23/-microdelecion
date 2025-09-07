// sprites.js - Gestión de sprites e imágenes

const sprites = {
    // ... sprites ...
};

const baseUrl = "https://raw.githubusercontent.com/Evelez23/-microdelecion/main/img/";
const imageUrls = {
    // ... URLs ...
};

let totalResources = Object.keys(imageUrls).length;
let loadedResources = 0;

window.loadResources = function() {
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
};
