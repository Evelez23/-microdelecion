/* Replace with live fetch later; for demo, static array */
const patients = [
  { name: 'Lander', age: 13, gender: 'Masculino', symptoms: ['TEA tipo 1', 'Hipotonía', 'Problemas digestivos'], category: 'TEA + Colagenopatía' },
  { name: 'Isaac', age: 2, gender: 'Masculino', symptoms: ['Hipotonía', 'Retraso motor'], category: 'Hipotonía' }
];

function renderPatients(list = patients) {
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

document.addEventListener('DOMContentLoaded', () => renderPatients());
