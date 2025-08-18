async function initCasos() {
  const data = await loadDataset();
  const container = document.getElementById('casos-list');
  
  // Filtro para casos severos (usado en index.js)
  window.countSevereCases = () => {
    return data.filter(c => {
      const g = (c.gravedad || '').toLowerCase();
      return g.includes('grave') || g.includes('sever');
    }).length;
  };

  function renderCasos(casos) {
    container.innerHTML = '';
    
    casos.forEach(caso => {
      const cardHtml = `
        <div class="panel">
          <div class="panel-header">
            <h3>${caso.nombre || 'Nombre no disponible'}</h3>
            <div style="display:flex;gap:8px">
              <span class="${gravBadge(caso.gravedad)}">${caso.gravedad || 'No especificado'}</span>
              ${caso.__origen === 'validado' ? '<span class="badge ok">Validado</span>' : '<span class="badge med">Por validar</span>'}
            </div>
          </div>
          <p><strong>Edad:</strong> ${caso.edad || 'No especificado'} años</p>
          <p><strong>Género:</strong> ${caso.genero || 'No especificado'}</p>
          <p><strong>Ubicación:</strong> ${caso.localizacion || 'No especificada'}</p>
          <p><strong>Características:</strong> ${caso.sintomas || 'No especificadas'}</p>
        </div>
      `;
      container.innerHTML += cardHtml;
    });

    if (window.anime) {
      anime({ targets: '.panel', opacity: [0, 1], translateY: [10, 0], delay: anime.stagger(80), duration: 700, easing: 'easeOutQuad' });
    }
  }

  // Buscador
  document.getElementById('search')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = data.filter(c => 
      (c.nombre?.toLowerCase().includes(term)) ||
      (c.localizacion?.toLowerCase().includes(term)) ||
      (c.sintomas?.toLowerCase().includes(term))
    );
    renderCasos(filtered);
  });

  renderCasos(data);
}

document.addEventListener('DOMContentLoaded', initCasos);
