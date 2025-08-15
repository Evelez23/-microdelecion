// ======================
// FUNCIONES BÁSICAS
// ======================
function $(q, ctx = document) { return ctx.querySelector(q) }
function $all(q, ctx = document) { return Array.from(ctx.querySelectorAll(q)) }

// ======================
// NORMALIZACIÓN DE DATOS
// ======================
function normalizeValidado(record) {
  return {
    "Nombre": record["Nombre"] || record["Nombre del paciente"] || "",
    "Edad": Number(record["Edad"] || record["Edad actual"] || 0),
    "Sexo": (record["Sexo"] || record["Género"] || "").toString().charAt(0).toUpperCase(),
    "Localización": record["Localización"] || record["Ciudad"] || record["Ubicación"] || "",
    "Síntomas": record["Síntomas"] || record["síntomas principales"] || record["Sintomas"] || "",
    "Gravedad": record["Gravedad"] || record["Nivel de afectación"] || record["Severidad"] || ""
  };
}

function normalizeNoValidado(record) {
  return {
    "Nombre": record["Nombre"] || "",
    "Edad": Number(record["Edad"] || 0),
    "Sexo": (record["Sexo"] || "").toString().charAt(0).toUpperCase(),
    "Localización": record["Localización"] || "",
    "Síntomas": record["Síntomas"] || "",
    "Gravedad": record["Gravedad"] || ""
  };
}

// ======================
// CARGA DE DATOS
// ======================
async function loadDataset() {
  try {
    const [validados, noValidados] = await Promise.all([
      loadData('casos_validados.json').then(data => data.map(normalizeValidado)),
      loadData('casos_no_validados.json').then(data => data.map(normalizeNoValidado))
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
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error ${response.status} al cargar ${url}`);
    return await response.json();
  } catch (error) {
    console.error(`Error procesando ${url}:`, error);
    return [];
  }
}

// ======================
// FUNCIONES DE UTILIDAD
// ======================
function pct(part, total) { 
  return total ? Math.round((part / total) * 100) : 0 
}

function gravBadge(g) {
  const s = (g || '').toLowerCase();
  if (s.includes('grave') || s.includes('sever')) return 'badge high';
  if (s.includes('moderad') || s.includes('medio')) return 'badge med';
  return 'badge ok';
}

function humanAgeSex(r) {
  const edad = Number(r['Edad']) || 0;
  const sexo = (r['Sexo'] || '').toString().trim().toUpperCase();
  const esNino = edad < 18;
  
  if (sexo === 'M') return esNino ? 'niño' : 'adulto';
  if (sexo === 'F') return esNino ? 'niña' : 'adulta';
  return esNino ? 'menor' : 'persona adulta';
}

// ======================
// NAVEGACIÓN
// ======================
function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  $all('nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });
}

// ======================
// INICIALIZACIÓN
// ======================
document.addEventListener('DOMContentLoaded', setActiveNav);
