// js/patients.js  (versión con datos reales)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSYFRG8sb61AiPcOU8ZkKZ-qB78TTeznBcqEs-ey45ANLr7kK7X8iqN34IupCOR0dZEqwBlgkJ6VLY/pub?output=csv';

async function loadPatients() {
  const res = await fetch(SHEET_URL);
  const csv = await res.text();
  const rows = csv.split('\n').slice(1);           // salta cabecera
  const patients = rows.map(r => {
    const [name, age, gender, symptoms, category] = r.split(',').map(c => c.trim());
    return { name, age, gender, symptoms: symptoms.split(';'), category };
  });
  renderPatients(patients);
}

function renderPatients(list) {
  const container = document.getElementById('patientContainer');
  const stats = document.getElementById('stats');
  stats.textContent = `${list.length} casos documentados | Actualizado: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}`;
  container.innerHTML = list.map(p => `
    <article class="patient-card">
      <h3>${p.name} <small>(${p.age} años)</small></h3>
      <p><strong>Género:</strong> ${p.gender}</p>
      <p><strong>Síntomas:</strong> ${p.symptoms.join(', ')}</p>
      <p><strong>Categoría:</strong> ${p.category}</p>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadPatients);
