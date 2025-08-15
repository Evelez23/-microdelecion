
let DATA = [];

async function initPacientes(){
  DATA = await loadDataset();
  renderList();
  $('#q').addEventListener('input', renderList);
  $('#src').addEventListener('change', renderList);
}
let DATA = [];
function iconFor(r){
  const t = humanAgeSex(r);
  if(t==='niño') return '👦'; if(t==='niña') return '👧'; if(t==='adulto') return '👨'; if(t==='adulta') return '👩';
  return '🧑';
}
function renderList(){
  const q = ($('#q').value||'').toLowerCase().trim();
  const src = $('#src').value;
  const cont = $('#listaPacientes');
  const filtered = DATA.filter(r => {
    const okQ = !q || (r['Nombre']||'').toLowerCase().includes(q);
    const okS = !src || r.__origen===src;
    return okQ && okS;
  });
  cont.innerHTML = filtered.map((r,i)=>`
    <div class="item" onclick="openModal(${i})">
      <div class="name"><span>${iconFor(r)}</span><strong>${r['Nombre']||'(Sin nombre)'}</strong></div>
      <div class="tag">${humanAgeSex(r)} · <span class="${r.__origen==='Validado'?'badge src-valid':'badge src-novalid'}">${r.__origen}</span></div>
    </div>
  `).join('');
  if(window.anime){
    anime({ targets: '.item', opacity:[0,1], translateY:[6,0], delay: anime.stagger(18), duration:350, easing:'easeOutQuad' });
  }
}
function openModal(idx){
  const r = DATA[idx];
  $('#mTitle').textContent = r['Nombre'] || 'Detalle';
  $('#mBody').innerHTML = `
    <div class="grid-2">
      <div>
        <table class="table">
          <tbody>
            <tr><th>Edad</th><td>${r['Edad']??''}</td></tr>
            <tr><th>Sexo</th><td>${r['Sexo']||''} (${humanAgeSex(r)})</td></tr>
            <tr><th>Localización</th><td>${r['Localización']||''}</td></tr>
            <tr><th>Gravedad</th><td><span class="${gravBadge(r['Gravedad'])}">${r['Gravedad']||''}</span></td></tr>
            <tr><th>Origen</th><td><span class="${r.__origen==='Validado'?'badge src-valid':'badge src-novalid'}">${r.__origen}</span></td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <h4 style="margin:0 0 8px">Síntomas</h4>
        <div style="white-space:pre-wrap;color:var(--muted)">${(r['Síntomas']||'').toString()}</div>
      </div>
    </div>
  `;
  $('#mb').style.display = 'flex';
}
function closeModal(){ $('#mb').style.display = 'none' }
async function initPacientes(){
  DATA = await loadDataset();
  renderList();
  $('#q').addEventListener('input', renderList);
  $('#src').addEventListener('change', renderList);
}
document.addEventListener('DOMContentLoaded', initPacientes);
