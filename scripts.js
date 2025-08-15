
/* Helpers y animaciones */
function $(q, ctx=document){ return ctx.querySelector(q) }
function $all(q, ctx=document){ return Array.from(ctx.querySelectorAll(q)) }

function setActiveNav(){
  const path = location.pathname.split('/').pop();
  $all('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path) a.classList.add('active');
  });
}

/* Cargar JSON de datos */
async function loadData(){
  const res = await fetch('data.json', {cache:'no-store'});
  return res.json();
}

/* Exportar una tabla HTML a Excel (cliente) */
async function exportTableToExcel(tableId, filename='export.xlsx'){
  const table = document.getElementById(tableId);
  if(!table){ alert('Tabla no encontrada'); return; }
  const rows = [['Nombre','Edad','Sexo','Localización','Síntomas','Gravedad']];
  $all('tbody tr', table).forEach(tr => {
    const cells = $all('td', tr).map(td => td.innerText.trim());
    rows.push(cells);
  });

  // Construir un archivo xlsx simple usando SheetJS si está disponible; si no, CSV
  if(window.XLSX){
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, filename);
  }else{
    const csv = rows.map(r => r.map(v => `"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename.replace(/\.xlsx?$/i,'.csv');
    a.click();
    URL.revokeObjectURL(a.href);
  }
}

/* Formateo y utilidades */
function pct(part, total){ return total ? Math.round((part/total)*100) : 0 }
function gravBadge(g){
  const s = (g||'').toLowerCase();
  if(s.includes('grave')) return 'badge high';
  if(s.includes('moderad')) return 'badge med';
  return 'badge ok';
}

/* init */
document.addEventListener('DOMContentLoaded', setActiveNav);
