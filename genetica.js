async function initGen(){
  // Datos de ejemplo - deberías reemplazarlos con tus datos reales
  new Chart(document.getElementById('chartGenes').getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['CYFIP1', 'NIPA1', 'NIPA2', 'TUBGCP5'],
      datasets: [{
        label: 'Frecuencia de alteraciones',
        data: [85, 60, 45, 30], // % aproximado de casos con afectación
        backgroundColor: ['#6ea8fe', '#00d1d1', '#63e6be', '#ffd43b']
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true, max: 100 } }
    }
  });

  new Chart(document.getElementById('chartHerencia').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Heredado', 'De novo', 'Desconocido'],
      datasets: [{
        data: [30, 65, 5], // % aproximado
        backgroundColor: ['#6ea8fe', '#00d1d1', '#a8b3cf']
      }]
    },
    options: { responsive: true }
  });

  if(window.anime){
    anime({ targets: '.panel', opacity: [0,1], translateY: [10,0], delay: anime.stagger(80), duration:700, easing:'easeOutQuad' });
  }
}
document.addEventListener('DOMContentLoaded', initGen);
