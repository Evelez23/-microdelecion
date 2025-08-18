// casos.js - Versión corregida
async function loadDataset() {
  try {
    // Cargar ambos conjuntos de datos
    const [validadosResponse, noValidadosResponse] = await Promise.all([
      fetch('data/casos_validados.json'),
      fetch('data/casos_no_validados.json')
    ]);
    
    if (!validadosResponse.ok || !noValidadosResponse.ok) {
      throw new Error('Error al cargar los datos');
    }
    
    const validados = await validadosResponse.json();
    const noValidados = await noValidadosResponse.json();
    
    // Normalizar estructura
    const casosValidados = validados.map(caso => ({
      ...caso,
      __origen: 'validado',
      gravedad: getGravedadNormalizada(caso['Nivel de afectación']),
      nombre: caso.Nombre,
      edad: caso['Edad '] || caso.Edad,
      genero: normalizeGender(caso.Género),
      localizacion: caso.Localización || caso.Localizacion,
      sintomas: caso['síntomas principales  '] || caso['síntomas principales']
    }));
    
    const casosNoValidados = noValidados.map(caso => ({
      ...caso,
      __origen: 'no-validado',
      gravedad: getGravedadNormalizada(caso['Nivel de afectación'])
    }));
    
    return [...casosValidados, ...casosNoValidados];
  } catch (error) {
    console.error('Error cargando datos:', error);
    return [];
  }
}

function getGravedadNormalizada(nivel) {
  if (!nivel) return 'No especificado';
  if (typeof nivel !== 'string') return nivel;
  
  nivel = nivel.toLowerCase();
  if (nivel.includes('leve')) return 'Leve';
  if (nivel.includes('moderado')) return 'Moderado';
  if (nivel.includes('grave') || nivel.includes('sever')) return 'Severo';
  return nivel;
}

function normalizeGender(genero) {
  if (!genero) return 'No especificado';
  if (genero.toLowerCase() === 'm' || genero.toLowerCase().includes('masculino')) return 'Masculino';
  if (genero.toLowerCase() === 'f' || genero.toLowerCase().includes('femenino')) return 'Femenino';
  return genero;
}

function gravBadge(gravedad) {
  gravedad = gravedad?.toLowerCase();
  if (gravedad?.includes('leve')) return 'badge ok';
  if (gravedad?.includes('moderado')) return 'badge med';
  if (gravedad?.includes('sever') || gravedad?.includes('grave')) return 'badge high';
  return 'badge';
}

function isSevereCase(gravedad) {
  return gravedad?.toLowerCase().includes('sever') || gravedad?.toLowerCase().includes('grave');
}

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await loadDataset();
    const container = document.getElementById('casos-list');
    
    if (!container) {
      console.error('No se encontró el contenedor de casos');
      return;
    }

    // Función para contar casos severos
    window.countSevereCases = () => data.filter(c => isSevereCase(c.gravedad)).length;

    function renderCasos(casos) {
      container.innerHTML = '';
      
      if (!casos || casos.length === 0) {
        container.innerHTML = `
          <div class="panel" style="grid-column:1/-1">
            <p>No se encontraron casos. Por favor intenta recargar la página.</p>
          </div>
        `;
        return;
      }
      
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
            <p><strong>Características:</strong> ${formatSymptoms(caso.sintomas)}</p>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
      });

      // Animación si está disponible
      if (window.anime) {
        anime({
          targets: '.panel',
          opacity: [0, 1],
          translateY: [10, 0],
          delay: anime.stagger(80),
          duration: 700,
          easing: 'easeOutQuad'
        });
      }
    }

    function formatSymptoms(symptoms) {
      if (!symptoms) return 'No especificadas';
      if (Array.isArray(symptoms)) return symptoms.join(', ');
      if (typeof symptoms === 'string') {
        // Limpiar síntomas separados por ;
        return symptoms.split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .join(', ');
      }
      return symptoms;
    }

    // Buscador
    document.getElementById('search')?.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      if (!term) {
        renderCasos(data);
        return;
      }
      
      const filtered = data.filter(c => 
        (c.nombre?.toLowerCase().includes(term)) ||
        (c.localizacion?.toLowerCase().includes(term)) ||
        (c.sintomas?.toLowerCase().includes(term)) ||
        (c.gravedad?.toLowerCase().includes(term))
      );
      renderCasos(filtered);
    });

    // Mostrar todos inicialmente
    renderCasos(data);
    console.log(`Total de casos cargados: ${data.length}`);
    
  } catch (error) {
    console.error('Error inicializando casos:', error);
    const container = document.getElementById('casos-list');
    if (container) {
      container.innerHTML = `
        <div class="panel error" style="grid-column:1/-1">
          <h3>Error al cargar los datos</h3>
          <p>${error.message}</p>
          <p>Por favor intenta recargar la página.</p>
        </div>
      `;
    }
  }
});
