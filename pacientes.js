// pacientes.js - Versión optimizada y sin duplicados
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
  const r = DATA[idx] || {};
  
  // Función helper para obtener campos con múltiples nombres posibles
  const getField = (keys, defaultValue = 'No especificado') => {
    for (const key of keys) {
      const value = r[key];
      if (value !== undefined && value !== null && value !== '') {
        return String(value).trim();
      }
    }
    return defaultValue;
  };

  // Normalización de campos
  const paciente = {
    nombre: getField(['Nombre', 'Nombre del paciente'], 'Sin nombre'),
    edad: getField(['Edad', 'Edad '], 'No especificada'),
    sexo: getField(['Sexo', 'Género'], '').charAt(0).toUpperCase(),
    ubicacion: getField(['Localización', 'Ciudad', 'Ubicación'], 'No especificada'),
    sintomas: getField(['Síntomas', 'síntomas principales', 'Sintomas'], 'No especificados'),
    gravedad: getField(['Gravedad', 'Nivel de afectación'], 'No especificada'),
    pruebas: getField(['Pruebas realizadas  (ej: array genético, EEG, resonancia)  '], 'No especificadas'),
    medicamentos: getField(['Medicamentos actuales/pasados\n (ej: risperidona, magnesio):  '], 'Ninguno'),
    terapias: getField(['Terapias recibidas\n(logopedia, psicoterapia, etc.):  '], 'Ninguna'),
    estudios: getField(['Â¿Ha participado en estudios clÃ­nicos o genÃ©ticos?'], 'No especificado'),
    necesidades: getField([' Necesidades y Desafíos'], 'No especificadas'),
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
            <tr><th>Pruebas realizadas</th><td>${paciente.pruebas}</td></tr>
            <tr><th>Medicamentos</th><td>${paciente.medicamentos}</td></tr>
            <tr><th>Terapias</th><td>${paciente.terapias}</td></tr>
            <tr><th>Participación en estudios</th><td>${paciente.estudios}</td></tr>
            <tr><th>Origen</th><td><span class="${paciente.origen === 'Validado' ? 'badge src-valid' : 'badge src-novalid'}">${paciente.origen}</span></td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <h4 style="margin:0 0 8px">Síntomas</h4>
        <div style="white-space:pre-wrap;color:var(--muted)">${paciente.sintomas}</div>
        
        <h4 style="margin:16px 0 8px">Necesidades y Desafíos</h4>
        <div style="white-space:pre-wrap;color:var(--muted)">${paciente.necesidades}</div>
        
        ${Object.entries(r)
          .filter(([k]) => ![
            'Nombre', 'Nombre del paciente', 'Edad', 'Edad ', 'Sexo', 'Género', 
            'Localización', 'Ciudad', 'Ubicación', 'Síntomas', 'síntomas principales', 
            'Sintomas', 'Gravedad', 'Nivel de afectación', '__origen',
            'Pruebas realizadas  (ej: array genético, EEG, resonancia)  ',
            'Medicamentos actuales/pasados\n (ej: risperidona, magnesio):  ',
            'Terapias recibidas\n(logopedia, psicoterapia, etc.):  ',
            'Â¿Ha participado en estudios clÃ­nicos o genÃ©ticos?',
            ' Necesidades y Desafíos'
          ].includes(k))
          .map(([k, v]) => v ? `
            <div style="margin-top:12px">
              <strong>${k}:</strong> ${v}
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
