
function $(q, ctx=document){ return ctx.querySelector(q) }
function $all(q, ctx=document){ return Array.from(ctx.querySelectorAll(q)) }
function setActiveNav(){
  const path = location.pathname.split('/').pop();
  $all('nav a').forEach(a => { if(a.getAttribute('href') === path) a.classList.add('active'); });
}
const EXPECTED = ["Nombre","Edad","Sexo","Localización","Síntomas","Gravedad"];
const ALIASES = {
  "Localizacion":"Localización",
  "Localidad":"Localización",
  "Sintomas":"Síntomas",
  "Grado":"Gravedad",
  "Gravedad clínica":"Gravedad"
};
function normalizeRow(row){
  const out = {};
  for(const k in row){ out[ALIASES[k] || k] = row[k]; }
  EXPECTED.forEach(k => { if(!(k in out)) out[k] = "" });
  const e = Number(out["Edad"]); if(!isNaN(e)) out["Edad"] = e;
  return out;
}
// Reemplaza la función readExcel por esta versión que puede cargar tanto XLSX como JSON
async function readExcel(url) {
  // Si es JSON, lo cargamos directamente
  if(url.endsWith('.json')) {
    const res = await fetch(url);
    if(!res.ok) throw new Error("No se pudo cargar "+url);
    return await res.json();
  }
  
  // Si es XLSX, mantenemos el código original
  const res = await fetch(url, {cache:'no-store'});
  if(!res.ok) throw new Error("No se pudo cargar "+url);
  const ab = await res.arrayBuffer();
  const wb = XLSX.read(ab, {type:'array'});
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, {defval:""}).map(normalizeRow);
}

// Luego modifica loadDataset para usar archivos JSON
async function loadDataset(){
  const [nov, val] = await Promise.all([
    readExcel('casos_no_validados.json').catch(()=>[]),
    readExcel('casos_validados.json').catch(()=>[]),
  ]);
  const tagNov = nov.map(r => ({...r, __origen:'Sin validar'}));
  const tagVal = val.map(r => ({...r, __origen:'Validado'}));
  return [...tagVal, ...tagNov];
}
}
async function loadDataset(){
  const [nov, val] = await Promise.all([
    readExcel('casos_no_validados.xlsx').catch(()=>[]),
    readExcel('casos_validados.xlsx').catch(()=>[]),
  ]);
  const tagNov = nov.map(r => ({...r, __origen:'Sin validar'}));
  const tagVal = val.map(r => ({...r, __origen:'Validado'}));
  return [...tagVal, ...tagNov];
}
function pct(part, total){ return total ? Math.round((part/total)*100) : 0 }
function gravBadge(g){
  const s = (g||'').toLowerCase();
  if(s.includes('grave')) return 'badge high';
  if(s.includes('moderad')) return 'badge med';
  return 'badge ok';
}
function humanAgeSex(r){
  const edad = Number(r['Edad'])||0;
  const sexo = (r['Sexo']||'').toString().trim().toUpperCase();
  const esNino = edad < 18;
  if(sexo === 'M') return esNino ? 'niño' : 'adulto';
  if(sexo === 'F') return esNino ? 'niña' : 'adulta';
  return esNino ? 'menor' : 'persona adulta';
}
document.addEventListener('DOMContentLoaded', setActiveNav);
