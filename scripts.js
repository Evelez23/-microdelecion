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

// Resto de tus funciones existentes (pct, gravBadge, humanAgeSex)
// ... (mantén todo lo que ya tienes debajo de esto)

// Inicialización
document.addEventListener('DOMContentLoaded', setActiveNav);
