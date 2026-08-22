(function () {
  'use strict';
  const scriptTag = document.currentScript;
  const field = scriptTag?.getAttribute('data-field') || '';
  const container = document.getElementById('majorsContainer');
  if (!container) return;

  var style = document.createElement('style');
  style.textContent = '@keyframes majorspin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
  container.innerHTML = '<div class="loading-rec" style="text-align:center;padding:2rem"><div style="width:40px;height:40px;border:4px solid var(--lm-border);border-top-color:var(--gold-primary);border-radius:50%;animation:majorspin .8s linear infinite;margin:0 auto 1rem"></div><p style="color:var(--lm-text-muted)">جاري تحميل التخصصات...</p></div>';

  fetch('/api/universities/majors/grouped')
    .then(r => r.json())
    .then(res => {
      if (!res.success || !res.data) throw new Error('No data');
      const grouped = res.data;
      const majors = grouped[field];
      if (!majors || !majors.length) {
        container.innerHTML = '<div class="info-box warning" style="text-align:center;padding:2rem"><h3>لا توجد تخصصات متاحة</h3><p>لم يتم العثور على تخصصات في هذا المجال. قد يكون النظام قيد التحديث.</p></div>';
        return;
      }
      let html = '<div class="majors-grid">';
      majors.forEach((m, i) => {
        const univInfo = m.universityCount > 0
          ? `<span style="display:block;font-size:0.8rem;color:var(--lm-text-muted);margin-top:6px">
              <strong>${m.universityCount}</strong> جامعة • المعدل: ${m.minMarkMin}-${m.minMarkMax}% • التكلفة: ${m.costMin}-${m.costMax} د.أ/سنة
             </span>`
          : '';
        const univList = m.universities.length > 0
          ? '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px">' +
            [...new Set(m.universities.map(u => u.name))].slice(0, 5).map(n =>
              `<span style="font-size:0.75rem;background:var(--gold-glow);color:var(--gold-primary);padding:2px 8px;border-radius:8px">${n}</span>`
            ).join('') +
            (m.universities.length > 5 ? `<span style="font-size:0.75rem;color:var(--lm-text-muted)">+${m.universities.length - 5}</span>` : '') +
            '</div>'
          : '';
        html += `<div class="major-card" style="border-right:4px solid var(--gold-primary)">
          <h3 style="display:flex;justify-content:space-between;align-items:center">
            <span>${i + 1}. ${m.name}</span>
            ${m.duration ? `<span style="font-size:0.75rem;color:var(--lm-text-muted);font-weight:400">${m.duration} سنوات</span>` : ''}
          </h3>
          ${univInfo}
          ${univList}
        </div>`;
      });
      html += '</div>';
      container.innerHTML = html;
    })
    .catch(() => {
      container.innerHTML = '<div class="info-box warning" style="text-align:center;padding:2rem"><h3>تعذر تحميل التخصصات</h3><p>يرجى المحاولة لاحقاً أو الرجوع إلى دليل القبول الموحد.</p></div>';
    });
})();
