import { read, utils } from 'https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs';

// Función mejorada para corregir caracteres
const fixEncoding = (str) => {
  if (!str) return '';
  return str
    .replace(/Ã¡/g, 'á').replace(/Ã©/g, 'é').replace(/Ã/g, 'í')
    .replace(/Ã³/g, 'ó').replace(/Ãº/g, 'ú').replace(/Ã±/g, 'ñ')
    .replace(/Ã¼/g, 'ü').replace(/Â¿/g, '¿').replace(/Â¡/g, '¡')
    .replace(/Ã‰/g, 'É').replace(/Ã“/g, 'Ó');
};

// Mostrar estado de carga
function showLoading() {
  const container = document.getElementById('patientContainer');
  container.innerHTML = `
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Cargando datos de pacientes...</p>
    </div>
  `;
}

// Función mejorada para procesar pacientes
const processPatientData = (pacientes) => {
  return pacientes.map(p => {
    // Manejo robusto de campos con diferentes nombres
    const rawData = {
      nombre: p['Nombre'] || p['nombre'] || '',
      edad: p['Edad'] || p['edad'] || 'N/A',
      genero: p['*Género'] || p['*GÃ©nero'] || 'M', // Default a Masculino si no hay dato
      sintomas: p['Síntomas principales'] || p['SÃ­ntomas principales'] || 'N/A',
      pruebas: p['Pruebas realizadas'] || '',
      medicamentos: p['Medicamentos actuales/pasados'] || '',
      terapias: p['Terapias recibidas'] || '',
      estudios: p['Â¿Ha participado en estudios clÃ­nicos o genÃ©ticos?'] || '',
      necesidades: p['Necesidades y Desafíos'] || ''
    };

    return {
      nombre: fixEncoding(rawData.nombre),
      edad: rawData.edad,
      genero: rawData.genero === 'F' ? 'Femenino' : 'Masculino',
      sintomas: fixEncoding(rawData.sintomas),
      pruebas: fixEncoding(rawData.pruebas),
      medicamentos: fixEncoding(rawData.medicamentos),
      terapias: fixEncoding(rawData.terapias),
      estudios: fixEncoding(rawData.estudios),
      necesidades: fixEncoding(rawData.necesidades)
    };
  });
};

// Renderizado mejorado de pacientes
function renderPatients(pacientes) {
  const container = document.getElementById('patientContainer');
  const statsElement = document.getElementById('stats');
  
  // Actualizar estadísticas
  statsElement.innerHTML = `Mostrando ${pacientes.length} casos registrados`;
  
  // Agrupar por género
  const grupos = {
    Femenino: pacientes.filter(p => p.genero === 'Femenino'),
    Masculino: pacientes.filter(p => p.genero === 'Masculino')
  };

  let htmlContent = '';

  Object.entries(grupos).forEach(([genero, lista]) => {
    if (lista.length === 0) return;
    
    htmlContent += `
      <section class="gender-section">
        <h2>${genero} (${lista.length} pacientes)</h2>
        <div class="patient-grid">
    `;
    
    lista.forEach(paciente => {
      htmlContent += `
        <div class="patient-card">
          <h3>${paciente.nombre}</h3>
          <p><strong>Edad:</strong> ${paciente.edad}</p>
          <p><strong>Síntomas:</strong> ${paciente.sintomas}</p>
          <button class="details-btn" data-patient='${JSON.stringify(paciente).replace(/'/g, "\\'")}'>
            Ver detalles completos
          </button>
        </div>
      `;
    });
    
    htmlContent += `</div></section>`;
  });
  
  container.innerHTML = htmlContent;

  // Añadir event listeners para los modales
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const patientData = JSON.parse(e.target.getAttribute('data-patient'));
      showPatientModal(patientData);
    });
  });
}

// Mostrar modal con detalles completos
function showPatientModal(patient) {
  const modalHtml = `
    <div class="patient-modal">
      <div class="modal-content">
        <h3>${patient.nombre}</h3>
        <p><strong>Edad:</strong> ${patient.edad}</p>
        <p><strong>Género:</strong> ${patient.genero}</p>
        
        <div class="patient-details">
          <h4>Síntomas principales:</h4>
          <p>${patient.sintomas}</p>
          
          <h4>Pruebas realizadas:</h4>
          <p>${patient.pruebas || 'No especificado'}</p>
          
          <h4>Medicamentos:</h4>
          <p>${patient.medicamentos || 'No especificado'}</p>
          
          <h4>Terapias recibidas:</h4>
          <p>${patient.terapias || 'No especificado'}</p>
          
          <h4>Participación en estudios:</h4>
          <p>${patient.estudios || 'No especificado'}</p>
          
          <h4>Necesidades y desafíos:</h4>
          <p>${patient.necesidades || 'No especificado'}</p>
        </div>
        
        <button class="close-modal">Cerrar</button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // Cerrar modal
  document.querySelector('.close-modal').addEventListener('click', () => {
    document.querySelector('.patient-modal').remove();
  });
}

// Carga principal de datos
document.addEventListener('DOMContentLoaded', async () => {
  showLoading();
  
  try {
    const excelUrl = 'https://raw.githubusercontent.com/Evelez23/-microdelecion/main/listaPacientes.xlsx';
    const response = await fetch(excelUrl);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.arrayBuffer();
    const workbook = read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const pacientes = utils.sheet_to_json(firstSheet);
    
    if (!pacientes || pacientes.length === 0) {
      throw new Error('El archivo Excel no contiene datos de pacientes');
    }
    
    const pacientesNormalizados = processPatientData(pacientes);
    renderPatients(pacientesNormalizados);
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('patientContainer').innerHTML = `
      <div class="error-card">
        <h3>Error al cargar los datos</h3>
        <p>${error.message}</p>
        <p>Por favor, verifica:</p>
        <ul>
          <li>Que el archivo Excel esté disponible en la ubicación correcta</li>
          <li>Que tengas conexión a internet</li>
          <li>Que el archivo tenga la estructura correcta</li>
        </ul>
        <button onclick="window.location.reload()">Reintentar</button>
      </div>
    `;
  }
});
