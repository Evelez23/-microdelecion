
let rows = [];
function render(){
  const q = ($('#q').value||'').toLowerCase().trim();
  const grav = $('#grav').value;
  const tbody = $('#tblPacientes tbody');
  const filtered = rows.filter(r => {
    const hayQ = !q || (r['Nombre']||'').toLowerCase().includes(q) || (r['Síntomas']||'').toLowerCase().includes(q);
    const hayG = !grav || (r['Gravedad']||'') === grav;
    return hayQ && hayG;
  });
  tbody.innerHTML = filtered.map(r => `
    <tr>
      <td>${r['Nombre']||''}</td>
      <td>${r['Edad']??''}</td>
      <td>${r['Sexo']||''}</td>
      <td>${r['Localización']||''}</td>
      <td>${r['Síntomas']||''}</td>
      <td><span class="${gravBadge(r['Gravedad'])}">${r['Gravedad']||''}</span></td>
    </tr>
  `).join('');
}
async function initPacientes(){
  rows = await loadData();
  render();
  $('#q').addEventListener('input', render);
  $('#grav').addEventListener('change', render);
  anime({ targets: 'tbody tr', opacity:[0,1], translateY:[6,0], delay: anime.stagger(20), duration:400, easing:'easeOutQuad' });
}
document.addEventListener('DOMContentLoaded', initPacientes);
