
async function init(){
  const data = await loadData();

  // KPIs
  const total = data.length;
  const tea = data.filter(r => (r['Síntomas']||'').toLowerCase().includes('tea')).length;
  const hip = data.filter(r => (r['Síntomas']||'').toLowerCase().includes('hipoton')).length;
  const epi = data.filter(r => (r['Síntomas']||'').toLowerCase().includes('epileps')).length;

  $('#kpis').innerHTML = `
    <div class="card"><div class="k">Casos totales</div><div class="v">${total}</div></div>
    <div class="card"><div class="k">TEA</div><div class="v">${tea} <span class="badge ${gravBadge('Leve')}">${pct(tea,total)}%</span></div></div>
    <div class="card"><div class="k">Hipotonía</div><div class="v">${hip} <span class="badge ${gravBadge('Moderado')}">${pct(hip,total)}%</span></div></div>
    <div class="card"><div class="k">Epilepsia</div><div class="v">${epi} <span class="badge ${gravBadge('Grave')}">${pct(epi,total)}%</span></div></div>
  `;

  // Edades → buckets
  const buckets = { '0-5':0, '6-10':0, '11-15':0, '16+':0 };
  data.forEach(r => {
    const e = Number(r['Edad'])||0;
    if(e<=5) buckets['0-5']++;
    else if(e<=10) buckets['6-10']++;
    else if(e<=15) buckets['11-15']++;
    else buckets['16+']++;
  });

  const ctx = document.getElementById('chartAges').getContext('2d');
  new Chart(ctx, {
    type:'bar',
    data:{
      labels:Object.keys(buckets),
      datasets:[{label:'Pacientes', data:Object.values(buckets)}]
    },
    options:{
      responsive:true,
      scales:{ y:{ beginAtZero:true } }
    }
  });

  // Animación sutil de entrada
  anime({ targets: '.card, .panel', opacity:[0,1], translateY:[10,0], delay: anime.stagger(70), duration:700, easing:'easeOutQuad' });
}
document.addEventListener('DOMContentLoaded', init);
