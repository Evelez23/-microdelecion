import { read, utils } from 'https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Cargar Excel desde GitHub (asegúrate que la URL sea correcta)
    const excelUrl = 'https://raw.githubusercontent.com/Evelez23/-microdelecion/main/listaPacientes.xlsx';
    const response = await fetch(excelUrl);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    
    const data = await response.arrayBuffer();
    const workbook = read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const pacientes = utils.sheet_to_json(firstSheet);

    // 2. Normalizar datos (corrige encoding)
    const pacientesNormalizados = pacientes.map(p => ({
      nombre: p.Nombre || 'Sin nombre',
      edad: p.Edad || 'N/A',
      genero: p['*GÃ©nero'] === 'F' ? 'Femenino' : 'Masculino',
      pruebas: p['Pruebas realizadas'] || 'N/A',
      sintomas: p['SÃ­ntomas principales']?.replace(/;/g, ', ') || 'N/A'
    }));

    // 3. Mostrar en DOM
    renderPatients(pacientesNormalizados);
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('patientContainer').innerHTML = `
      <div class="error">
        <p>Error al cargar datos. Recarga la página.</p>
        <small>${error.message}</small>
      </div>
    `;
  }
});

function renderPatients(pacientes) {
  const container = document.getElementById('patientContainer');
  container.innerHTML = ''; // Limpiar contenedor

  // Agrupar por género
  const grupos = {
    Femenino: pacientes.filter(p => p.genero === 'Femenino'),
    Masculino: pacientes.filter(p => p.genero === 'Masculino')
  };

  // Renderizar cada grupo
  Object.entries(grupos).forEach(([genero, lista]) => {
    if (lista.length === 0) return;
    
    const section = document.createElement('div');
    section.className = 'gender-section';
    section.innerHTML = `<h2>${genero}</h2><div class="patient-list"></div>`;
    
    const listContainer = section.querySelector('.patient-list');
    
    lista.forEach(paciente => {
      const card = document.createElement('div');
      card.className = 'patient-card';
      card.innerHTML = `
        <h3>${paciente.nombre}</h3>
        <p><strong>Edad:</strong> ${paciente.edad}</p>
        <p><strong>Síntomas:</strong> ${paciente.sintomas}</p>
      `;
      listContainer.appendChild(card);
    });
    
    container.appendChild(section);
  });
}
