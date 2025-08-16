async function init(){
  const data = await loadDataset();
  const total = data.length;
  const val = data.filter(r => r.__origen === 'validado').length;
  const nov = total - val;
  const epi = data.filter(r => (r.sintomas || '').toLowerCase().includes('epileps')).length;

  document.getElementById('kpis').innerHTML = `
    <div class="card"><div class="k">Casos totales</div><div class="v">${total}</div></div>
    <div class="card"><div class="k">Validados</div><div class="v">${val} <span class="badge src-valid">${pct(val,total)}%</span></div></div>
    <div class="card"><div class="k">Sin validar</div><div class="v">${nov} <span class="badge src-novalid">${pct(nov,total)}%</span></div></div>
    <div class="card"><div class="k">Epilepsia</div><div class="v">${epi}</div></div>
  `;

  const buckets = { '0-5':0, '6-10':0, '11-15':0, '16+':0 };
  data.forEach(r => {
    const e = Number(r.edad)||0;
    if(e<=5) buckets['0-5']++; else if(e<=10) buckets['6-10']++; else if(e<=15) buckets['11-15']++; else buckets['16+']++;
  });
  new Chart(document.getElementById('chartAges').getContext('2d'), {
    type:'bar', data:{ labels:Object.keys(buckets), datasets:[{ label:'Pacientes', data:Object.values(buckets) }] },
    options:{ responsive:true, scales:{ y:{ beginAtZero:true } } }
  });

  new Chart(document.getElementById('chartOrigen').getContext('2d'), {
    type:'doughnut', data:{ labels:['Validados','Sin validar'], datasets:[{ data:[val, nov] }] },
    options:{ responsive:true }
  });

  if(window.anime){
    anime({ targets: '.card, .panel', opacity:[0,1], translateY:[10,0], delay: anime.stagger(70), duration:700, easing:'easeOutQuad' });
  }
}
document.addEventListener('DOMContentLoaded', init);
