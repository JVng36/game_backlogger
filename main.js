const THEME_KEY = 'backlog-theme';

function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem(THEME_KEY, t);
  document.querySelectorAll('.theme-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.t === t)
  );
}

document.getElementById('themeToggle').addEventListener('click', e => {
  const btn = e.target.closest('.theme-btn');
  if (btn) applyTheme(btn.dataset.t);
});

applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

document.getElementById("addToggle").onclick = () => { showAdd = !showAdd; editingId = null; render(); };
document.getElementById("search").oninput = e => { search = e.target.value; renderList(); };
document.getElementById("sort").onchange = e => { sortBy = e.target.value; renderList(); };
document.getElementById("exportBtn").onclick = exportData;
document.getElementById("importBtn").onclick = () => document.getElementById("importFile").click();
document.getElementById("importFile").onchange = e => {
  if (e.target.files[0]) importData(e.target.files[0]);
  e.target.value = "";
};

load();
render();
