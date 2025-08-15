// pacientes.js - Versión completa y corregida
// Única declaración de DATA en todo el proyecto
let DATA = [];

// Función para obtener icono según edad y sexo
function iconFor(r) {
  const t = humanAgeSex(r);
  if(t === 'niño') return '👦';
  if(t === 'niña') return '👧';
  if(t === 'adulto') return '👨';
  if(t === 'adulta') return '👩';
  return '🧑';
}

// Renderiza la lista de pacientes filtrada
function renderList() {
  const q = ($('#q').value || '').toLowerCase().trim();
  const src = $('#src').value;
  const cont = $('#listaPacientes');
  
  const filtered = DATA.filter(r => {
    const okQ = !q || (r['Nombre'] || '').toLowerCase().includes(q);
    const okS = !src || r.__origen === src;
    return okQ && okS;
  });
  
  cont.innerHTML = filtered.map((r, i) => `
    <div class="item" onclick="openModal(${i})">
      <div class="name">
        <span>${iconFor(r)}</span>
        <strong>${r['Nombre'] || '(Sin nombre)'}</strong>
      </div>
      <div class="tag">
        ${humanAgeSex(r)} · 
        <span class="${r.__origen === 'Validado' ? 'badge src-valid' : 'badge src-novalid'}">
          ${r.__origen}
        </span>
      </div>
    </div>
  `).join('');
  
  // Efectos de animación si anime.js está disponible
  if(window.anime) {
    anime({
      targets: '.item',
      opacity: [0, 1],
      translateY: [6, 0],
      delay: anime.stagger(18),
      duration: 350,
      easing: 'easeOutQuad'
    });
  }
}

// Abre el modal con detalles del paciente
function openModal(idx) {
  const r = DATA[idx];
  $('#mTitle').textContent = r['Nombre'] || 'Detalle';
  $('#mBody').innerHTML = `
    <div class="grid-2">
      <div>
        <table class="table">
          <tbody>
            <tr><th>Edad</th><td>${r['Edad'] ?? ''}</td></tr>
            <tr><th>Sexo</th><td>${r['Sexo'] || ''} (${humanAgeSex(r)})</td></tr>
            <tr><th>Localización</th><td>${r['Localización'] || ''}</td></tr>
            <tr><th>Gravedad</th><td><span class="${gravBadge(r['Gravedad'])}">${r['Gravedad'] || ''}</span></td></tr>
            <tr><th>Origen</th><td><span class="${r.__origen === 'Validado' ? 'badge src-valid' : 'badge src-novalid'}">${r.__origen}</span></td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <h4 style="margin:0 0 8px">Síntomas</h4>
        <div style="white-space:pre-wrap;color:var(--muted)">${(r['Síntomas'] || '').toString()}</div>
      </div>
    </div>
  `;
  $('#mb').style.display = 'flex';
}

// Cierra el modal
function closeModal() { 
  $('#mb').style.display = 'none';
}

// Inicialización de la página
async function initPacientes() {
  try {
    DATA = await loadDataset();
    renderList();
    
    // Event listeners para búsqueda y filtro
    $('#q').addEventListener('input', renderList);
    $('#src').addEventListener('change', renderList);
    
  } catch (error) {
    console.error('Error inicializando pacientes:', error);
    $('#listaPacientes').innerHTML = `
      <div class="error-message">
        Error cargando los datos. Por favor intenta recargar la página.
      </div>
    `;
  }
}

// Inicia cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initPacientes);
