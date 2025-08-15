// Funciones básicas
function $(q, ctx=document) { return ctx.querySelector(q) }
function $all(q, ctx=document) { return Array.from(ctx.querySelectorAll(q)) }

// Configuración de datos
const DATA_URLS = {
  validados: 'casos_validados.json',
  noValidados: 'casos_no_validados.json'
};

// Cargador de datos mejorado
async function loadDataset() {
  try {
    const [validados, noValidados] = await Promise.all([
      loadData(DATA_URLS.validados),
      loadData(DATA_URLS.noValidados)
    ]);
    
    return [
      ...validados.map(r => ({ ...r, __origen: 'Validado' })),
      ...noValidados.map(r => ({ ...r, __origen: 'Sin validar' }))
    ];
  } catch (error) {
    console.error('Error cargando dataset:', error);
    return [];
  }
}

async function loadData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al cargar ${url}`);
  return await response.json();
}

function setActiveNav() {
  const path = location.pathname.split('/').pop();
  $all('nav a').forEach(a => { 
    if(a.getAttribute('href') === path) a.classList.add('active'); 
  });
}
// Agrega esto a scripts.js si no está
function humanAgeSex(r) {
  const edad = Number(r['Edad'])||0;
  const sexo = (r['Sexo']||'').toString().trim().toUpperCase();
  const esNino = edad < 18;
  if(sexo === 'M') return esNino ? 'niño' : 'adulto';
  if(sexo === 'F') return esNino ? 'niña' : 'adulta';
  return esNino ? 'menor' : 'persona adulta';
}
// Resto de tus funciones existentes (pct, gravBadge, humanAgeSex)
// ... (mantén todo lo que ya tienes debajo de esto)

// Inicialización
document.addEventListener('DOMContentLoaded', setActiveNav);
