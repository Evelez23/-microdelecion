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
  
  // Función inteligente para obtener cualquier campo
  const getField = (possibleNames, defaultValue = 'No especificado') => {
    // Busca coincidencia insensible a espacios/mayúsculas
    const exactKey = Object.keys(r).find(key => 
      possibleNames.some(name => 
        key.trim().toLowerCase() === name.trim().toLowerCase()
      )
    );
    const value = exactKey ? r[exactKey] : null;
    
    if (value !== undefined && value !== null && value !== '') {
      return String(value).trim();
    }
    return defaultValue;
  };

  // Mapeo maestro de campos con todas las variantes posibles
  const fieldMappings = {
    nombre: [['Nombre', 'Nombre del paciente']],
    edad: [['Edad', 'Edad ', 'Edad actual']],
    sexo: [['Sexo', 'Género']],
    ubicacion: [['Localización', 'Ciudad', 'Ubicación']],
    sintomas: [['Síntomas', 'síntomas principales', 'síntomas principales  ', 'Sintomas']],
    gravedad: [['Gravedad', 'Nivel de afectación']],
    pruebas: [['Pruebas realizadas', 'Pruebas realizadas  (ej: array genético, EEG, resonancia)  ']],
    medicamentos: [['Medicamentos actuales/pasados', 'Medicamentos actuales/pasados\n (ej: risperidona, magnesio):  ']],
    terapias: [['Terapias recibidas', 'Terapias recibidas\n(logopedia, psicoterapia, etc.):  ']],
    estudios: [['Participación en estudios', 'Â¿Ha participado en estudios clÃ­nicos o genÃ©ticos?']],
    necesidades: [['Necesidades y Desafíos', ' Necesidades y Desafíos']],
    origen: [['__origen']]
  };

  // Normalización de todos los campos
  const paciente = {};
  Object.entries(fieldMappings).forEach(([field, possibleNames]) => {
    paciente[field] = getField(possibleNames.flat(), 
      field === 'origen' ? 'No especificado' : 
      field === 'edad' ? 'No especificada' :
      field === 'ubicacion' ? 'No especificada' :
      field.endsWith('s') ? 'No especificados' : 'No especificado');
  });

  // Campos adicionales no mapeados
  const additionalFields = Object.keys(r).filter(key => 
    !Object.values(fieldMappings).flat().flat()
      .some(mappedKey => mappedKey.trim().toLowerCase() === key.trim().toLowerCase())
  );

  // Generación del HTML
  $('#mTitle').textContent = paciente.nombre;
  
  let html = `
    <div class="grid-2">
      <div>
        <table class="table">
          <tbody>
            ${Object.entries({
              'Edad': paciente.edad,
              'Sexo': `${paciente.sexo} (${humanAgeSex(r)})`,
              'Localización': paciente.ubicacion,
              'Gravedad': `<span class="${gravBadge(paciente.gravedad)}">${paciente.gravedad}</span>`,
              'Pruebas realizadas': paciente.pruebas,
              'Medicamentos': paciente.medicamentos,
              'Terapias': paciente.terapias,
              'Participación en estudios': paciente.estudios,
              'Origen': `<span class="${paciente.origen === 'Validado' ? 'badge src-valid' : 'badge src-novalid'}">${paciente.origen}</span>`
            }).map(([label, value]) => `
              <tr><th>${label}</th><td>${value}</td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div>
        <h4 style="margin:0 0 8px">Síntomas</h4>
        <div style="white-space:pre-wrap;color:var(--muted)">${paciente.sintomas}</div>
        
        <h4 style="margin:16px 0 8px">Necesidades y Desafíos</h4>
        <div style="white-space:pre-wrap;color:var(--muted)">${paciente.necesidades}</div>
  `;

  // Campos adicionales
  if (additionalFields.length > 0) {
    html += `
        <h4 style="margin:16px 0 8px">Información Adicional</h4>
        ${additionalFields.map(key => `
          <div style="margin-top:8px">
            <strong>${key}:</strong> ${String(r[key]).trim() || 'N/A'}
          </div>
        `).join('')}
    `;
  }

  html += `</div></div>`;
  $('#mBody').innerHTML = html;
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
