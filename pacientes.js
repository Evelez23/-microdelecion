// pacientes.js - Versión completa y corregida
// Única declaración de DATA en todo el proyecto
let DATA = [];

// Función para obtener icono según edad y sexo
function iconFor(r) {
  const t = humanAgeSex(r);
  if(t === 'niño') return '👦';
  if(t === 'niña') return '👧';function openModal(idx) {
  const r = DATA[idx];
  
  // Normalización de campos en tiempo real
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
