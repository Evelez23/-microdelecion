// pacientes.js - Versión completa y sin errores de sintaxis
let DATA = [];

function iconFor(r) {
  const t = humanAgeSex(r);
  if (t === 'niño') return '👦';
  if (t === 'niña') return '👧';
  if (t === 'adulto') return '👨';
  if (t === 'adulta') return '👩';
  return '🧑';
}

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
  
  if (window.anime) {
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

function openModal(idx) {
  const r = DATA[idx];
  
  // Normalización de campos
  const paciente = {
    nombre: r['Nombre'] || r['Nombre del paciente'] || '(Sin nombre)',
    edad: r['Edad'] || r['Edad actual'] || 'No especificada',
    sexo: (r['Sexo'] || r['Género'] || '').toString().charAt(0).toUpperCase(),
    ubicacion: r['Localización'] || r['Ciudad'] || r['Ubicación'] || 'No especificada',
    sintomas: r['Síntomas'] || r['síntomas principales'] || r['Sintomas'] || 'No especificados',
    gravedad: r['Gravedad'] || r['Nivel de afectación'] || 'No especificada',
    origen: r.__origen || 'No especificado'
  };

  $('#mTitle').textContent = paciente.nombre;
  
  $('#mBody').innerHTML = `
    <div class="grid-2">
      <div>
        <table class="table">
          <tbody>
            <tr><th>Edad</th><td>${paciente.edad}</td></tr>
            <tr><th>Sexo</th><td>${paciente.sexo} (${humanAgeSex(r)})</td></tr>
            <tr><th>Localización</th><td>${paciente.ubicacion}</td></tr>
            <tr><th>Gravedad</th><td><span class="${gravBadge(paciente.gravedad)}">${paciente.gravedad}</span></td></tr>
            <tr><th>Origen</th><td><span class="${paciente.origen === 'Validado' ? 'badge src-valid' : 'badge src-novalid'}">${paciente.origen}</span></td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <h4 style="margin:0 0 8px">Síntomas</h4>
        <div style="white-space:pre-wrap;color:var(--muted)">${paciente.sintomas}</div>
        
        ${Object.entries(r)
          .filter(([key]) => !['Nombre','Edad','Sexo','Localización','Síntomas','Gravedad','__origen',
                              'Nombre del paciente','Edad actual','Género','síntomas principales','Nivel de afectación']
          .includes(key))
          .map(([key, value]) => value ? `
            <div style="margin-top:12px">
              <strong>${key}:</strong> ${value}
            </div>` : '')
          .join('')}
      </div>
    </div>
  `;
  $('#mb').style.display = 'flex';
}

function closeModal() { 
  $('#mb').style.display = 'none';
}

async function initPacientes() {
  try {
    DATA = await loadDataset();
    renderList();
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

document.addEventListener('DOMContentLoaded', initPacientes);
      <div>
        <table class="table">
          <tbody>
            <tr><th>Edad</th><td>${paciente.edad}</td></tr>
            <tr><th>Sexo</th><td>${paciente.sexo} (${humanAgeSex(r)})</td></tr>
            <tr><th>Localización</th><td>${paciente.ubicacion}</td></tr>
            <tr><th>Gravedad</th><td><span class="${gravBadge(paciente.gravedad)}">${paciente.gravedad}</span></td></tr>
            <tr><th>Origen</th><td><span class="${paciente.origen === 'Validado' ? 'badge src-valid' : 'badge src-novalid'}">${paciente.origen}</span></td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <h4 style="margin:0 0 8px">Síntomas</h4>
        <div style="white-space:pre-wrap;color:var(--muted)">${paciente.sintomas}</div>
        
        <!-- Sección adicional para mostrar campos únicos -->
        ${Object.entries(r)
          .filter(([key]) => !['Nombre','Edad','Sexo','Localización','Síntomas','Gravedad','__origen',
                              'Nombre del paciente','Edad actual','Género','síntomas principales','Nivel de afectación']
          .includes(key))
          .map(([key, value]) => value ? `
            <div style="margin-top:12px">
              <strong>${key}:</strong> ${value}
            </div>` : '')
          .join('')}
      </div>
    </div>
  `;
  $('#mb').style.display = 'flex';
}

// Inicia cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initPacientes);
