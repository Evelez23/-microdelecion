import { read, utils } from 'https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs';

// Función para corregir caracteres
const fixEncoding = (str) => {
  if (!str) return '';
  return str
    .replace(/Ã¡/g, 'á').replace(/Ã©/g, 'é').replace(/Ã/g, 'í')
    .replace(/Ã³/g, 'ó').replace(/Ãº/g, 'ú').replace(/Ã±/g, 'ñ')
    .replace(/Ã¼/g, 'ü').replace(/Â¿/g, '¿').replace(/Â¡/g, '¡');
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const excelUrl = 'https://raw.githubusercontent.com/Evelez23/-microdelecion/main/listaPacientes.xlsx';
    const response = await fetch(excelUrl);
    const data = await response.arrayBuffer();
    const workbook = read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const pacientes = utils.sheet_to_json(firstSheet);

    // Procesar datos con corrección de encoding
    const pacientesNormalizados = pacientes.map(p => {
      // Extraer valores directamente del objeto (nombres exactos de columnas)
      const rawData = {
        nombre: p['Nombre'] || p['nombre'] || '',
        edad: p['Edad'] || p['edad'] || 'N/A',
        genero: p['*GÃ©nero'] === 'F' ? 'Femenino' : 'Masculino',
        sintomas: p['SÃ­ntomas principales'] || p['Síntomas'] || 'N/A'
      };

      return {
        nombre: fixEncoding(rawData.nombre),
        edad: rawData.edad,
        genero: rawData.genero,
        sintomas: fixEncoding(rawData.sintomas)
      };
    });

    renderPatients(pacientesNormalizados);
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('patientContainer').innerHTML = `
      <div class="error">
        <p>Error al cargar datos. Verifica la conexión.</p>
        <small>${error.message}</small>
      </div>
    `;
  }
});

function renderPatients(pacientes) {
  const container = document.getElementById('patientContainer');
  container.innerHTML = '';

  // Agrupar por género
  const grupos = {
    Femenino: pacientes.filter(p => p.genero === 'Femenino'),
    Masculino: pacientes.filter(p => p.genero === 'Masculino')
  };

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
