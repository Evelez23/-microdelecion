
async function initGen(){
  // Como el Excel no contiene datos genéticos específicos, dejamos ejemplos vacíos (o counts derivados de síntomas si lo deseas).
  // Dejo gráficos "placeholder" con valores cero para que el layout funcione.
  new Chart(document.getElementById('chartGenes').getContext('2d'), {
    type:'doughnut',
    data:{ labels:['SHANK3','CNTNAP2','COL3A1/5A1','TBX1'], datasets:[{ data:[0,0,0,0] }] },
    options:{ responsive:true }
  });
  new Chart(document.getElementById('chartHerencia').getContext('2d'), {
    type:'pie',
    data:{ labels:['AD','AR','De novo','Otras'], datasets:[{ data:[0,0,0,0] }] },
    options:{ responsive:true }
  });
  anime({ targets: '.panel', opacity:[0,1], translateY:[10,0], delay: anime.stagger(80), duration:700, easing:'easeOutQuad' });
}
document.addEventListener('DOMContentLoaded', initGen);
