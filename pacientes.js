async function initPatients() {
  const data = await loadDataset();
  const container = document.getElementById('patient-list');
  
  // Limpiar el contenedor antes de agregar los pacientes
  container.innerHTML = '';
  
  data.forEach(patient => {
    const cardHtml = `
      <div class="panel">
        <div class="panel-header">
          <h3>${patient.nombre}</h3>
          <span class="${gravBadge(patient.gravedad)}">${patient.gravedad}</span>
        </div>
        <p><strong>Edad:</strong> ${patient.edad || 0} años</p>
        <p><strong>Género:</strong> ${patient.genero || 'No especificado'}</p>
        <p><strong>Localización:</strong> ${patient.localizacion || 'No especificado'}</p>
        <p><strong>Síntomas:</strong> ${patient.sintomas || 'No especificado'}</p>
      </div>
    `;
    container.innerHTML += cardHtml;
  });

  if (window.anime) {
    anime({ targets: '.panel', opacity: [0, 1], translateY: [10, 0], delay: anime.stagger(80), duration: 700, easing: 'easeOutQuad' });
  }
}

document.addEventListener('DOMContentLoaded', initPatients);
