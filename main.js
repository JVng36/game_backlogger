document.getElementById("addToggle").onclick = () => { showAdd = !showAdd; render(); };
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
