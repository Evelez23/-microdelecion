// sprites.js - Gestión de sprites e imágenes

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
    osoyuni: new Image(),
    uni_run: new Image(),
    uni_shup: new Image(),
    uni_corazon: new Image()
};

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
    osoyuni: `${baseUrl}Amigos/osoyuni.png`,
    uni_run: `${baseUrl}Amigos/unirrun.png`,
    uni_shup: `${baseUrl}Amigos/unirshup.png`,
    uni_corazon: `${baseUrl}Amigos/lovepower.png`
};

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
