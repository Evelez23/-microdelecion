// ======================
// FUNCIONES BÁSICAS
// ======================
function $(q, ctx = document) { return ctx.querySelector(q) }
function $all(q, ctx = document) { return Array.from(ctx.querySelectorAll(q)) }

// ======================
// NORMALIZACIÓN DE DATOS
// ======================
function normalizeData(record) {
  return {
    "nombre": record["Nombre"] || "",
    "edad": Number(record["Edad"] || 0),
    "genero": record["Sexo"] === 'M' ? 'Masculino' : 'Femenino',
    "localizacion": record["Localización"] || "",
    "sintomas": record["Síntomas"] || "",
    "gravedad": record["Gravedad"] || "",
    "__origen": "data"
  };
}

function normalizeNoValidado(record) {
  return {
    "nombre": record["Nombre"] || "",
    "edad": Number(record["Edad"] || 0),
    "genero": record["Género"] || "",
    "localizacion": record["Localizacion"] || "",
    "sintomas": record["síntomas principales"] || "",
    "gravedad": record["Nivel de afectación"] || "",
    "__origen": "no-validado"
  };
}

function normalizeValidado(record) {
  return {
    "nombre": record["Nombre"] || "",
    "edad": Number(record["Edad "] || 0),
    "genero": record["Género"] === 'M' ? 'Masculino' : record["Género"] === 'F' ? 'Femenino' : record["Género"],
    "localizacion": record["Localización"] || "",
    "sintomas": record["síntomas principales  "] || "",
    "gravedad": record["Nivel de afectación"] || "",
    "__origen": "validado"
  };
}

// ======================
// CARGA DE DATOS
// ======================
async function loadDataset() {
  try {
    const [data, noValidados, validados] = await Promise.all([
      loadData('data.json').then(res => res.map(normalizeData)),
      loadData('casos_no_validados.json').then(res => res.map(normalizeNoValidado)),
      loadData('casos_validados.json').then(res => res.map(normalizeValidado))
    ]);

    return [
      ...data,
      ...noValidados,
      ...validados
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
// ======================
// CARGA DE DATOS SIN DUPLICADOS
// ======================
async function loadDataset() {
  try {
    const [data, noValidados, validados] = await Promise.all([
      loadData('data.json'),
      loadData('casos_no_validados.json'),
      loadData('casos_validados.json')
    ]);

    // Normalizar todos los registros
    const allRecords = [
      ...data.map(r => normalizeRecord({ ...r, __origen: "data" })),
      ...noValidados.map(r => normalizeRecord({ ...r, __origen: "no-validado" })),
      ...validados.map(r => normalizeRecord({ ...r, __origen: "validado" }))
    ];

    // Eliminar duplicados usando un Map
    const uniqueRecordsMap = new Map();
    
    allRecords.forEach(record => {
      if (!uniqueRecordsMap.has(record.id)) {
        uniqueRecordsMap.set(record.id, record);
      } else {
        // Priorizar registros validados sobre no validados
        const existing = uniqueRecordsMap.get(record.id);
        if (record.__origen === "validado" && existing.__origen !== "validado") {
          uniqueRecordsMap.set(record.id, record);
        }
      }
    });

    // Convertir Map a array y ordenar por nombre
    return Array.from(uniqueRecordsMap.values()).sort((a, b) => 
      a.nombre.localeCompare(b.nombre)
    );
  } catch (error) {
    console.error('Error cargando dataset:', error);
    return [];
  }
}
