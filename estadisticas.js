
async function initStats(){
  const data = await loadDataset();
  const defs = [['TEA',/tea/i],['Hipotonía',/hipoton/i],['Disfagia',/disfagi/i],['Epilepsia',/epileps/i],['Cardiopatías',/cardiopat/i],['TDAH',/tdah/i]];
  const counts = defs.map(([l,rx]) => data.filter(r => rx.test(r['Síntomas']||'')).length);
  new Chart(document.getElementById('chartPrev').getContext('2d'), {
    type:'bar', data:{ labels: defs.map(d=>d[0]), datasets:[{ label:'Pacientes', data:counts }] }, options:{ responsive:true, scales:{ y:{ beginAtZero:true } } }
  });
  const h = data.filter(r => (r['Sexo']||'').toUpperCase()==='M').length;
  const m = data.filter(r => (r['Sexo']||'').toUpperCase()==='F').length;
  new Chart(document.getElementById('chartSexo').getContext('2d'), {
    type:'doughnut', data:{ labels:['Masculino','Femenino'], datasets:[{ data:[h,m] }] }, options:{ responsive:true }
  });
  if(window.anime){
    anime({ targets: '.panel', opacity:[0,1], translateY:[10,0], delay: anime.stagger(80), duration:700, easing:'easeOutQuad' });
  }
}
document.addEventListener('DOMContentLoaded', initStats);
