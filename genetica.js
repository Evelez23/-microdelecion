
async function initGen(){
  new Chart(document.getElementById('chartGenes').getContext('2d'), {
    type:'doughnut', data:{ labels:['GEN1','GEN2','GEN3','GEN4'], datasets:[{ data:[0,0,0,0] }] }, options:{ responsive:true }
  });
  new Chart(document.getElementById('chartHerencia').getContext('2d'), {
    type:'pie', data:{ labels:['AD','AR','De novo','Otras'], datasets:[{ data:[0,0,0,0] }] }, options:{ responsive:true }
  });
  if(window.anime){
    anime({ targets: '.panel', opacity:[0,1], translateY:[10,0], delay: anime.stagger(80), duration:700, easing:'easeOutQuad' });
  }
}
document.addEventListener('DOMContentLoaded', initGen);
