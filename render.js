const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2200);
}

function renderBuckets() {
  const el = document.getElementById("buckets");
  el.innerHTML = BUCKETS.map(b => {
    const n = games.filter(g => g.bucket === b.id).length;
    const hex = COLOR_HEX[b.id];
    const active = activeTab === b.id;
    return `<button class="bucket ${active ? "active" : ""}"
        style="--bk-color:${b.color}; --bk-tint:color-mix(in srgb, ${hex} 13%, transparent)"
        data-bucket="${b.id}">
      <div class="n">${n}</div><div class="l">${b.label}</div>
    </button>`;
  }).join("");
  el.querySelectorAll(".bucket").forEach(btn =>
    btn.onclick = () => { activeTab = btn.dataset.bucket; render(); });
}

function renderSummary() {
  const hrs = games.reduce((s, g) => s + (Number(g.hours) || 0), 0);
  document.getElementById("summary").textContent =
    `${games.length} game${games.length === 1 ? "" : "s"}${hrs ? ` · ~${hrs}h estimated` : ""}`;
}

function formFields(g) {
  return `
    <select id="f-platform">${PLATFORMS.map(p => `<option ${p === (g?.platform ?? "") ? "selected" : ""}>${p}</option>`).join("")}</select>
    <select id="f-genre">${GENRES.map(ge => `<option value="${ge}" ${ge === (g?.genre ?? "") ? "selected" : ""}>${ge || "Genre (optional)"}</option>`).join("")}</select>
    <input id="f-hours" type="number" min="0" placeholder="Est. hours" value="${g?.hours ?? ""}" />
    <select id="f-bucket">${BUCKETS.map(b => `<option ${b.id === (g?.bucket ?? activeTab) ? "selected" : ""}>${b.id}</option>`).join("")}</select>
    <div class="full"><textarea id="f-notes" rows="2" placeholder="Notes (optional)">${esc(g?.notes ?? "")}</textarea></div>`;
}

function readFields() {
  return {
    platform: document.getElementById("f-platform").value,
    genre:    document.getElementById("f-genre").value,
    hours:    document.getElementById("f-hours").value ? Number(document.getElementById("f-hours").value) : null,
    bucket:   document.getElementById("f-bucket").value,
    notes:    document.getElementById("f-notes").value.trim(),
  };
}

function renderForm() {
  const mount = document.getElementById("formMount");

  if (editingId !== null) {
    const g = games.find(x => x.id === editingId);
    if (!g) { editingId = null; mount.innerHTML = ""; updateAddToggle(); return; }
    mount.innerHTML = `
      <div class="form">
        <div class="form-label">Edit game</div>
        <div class="grid">
          <div class="full"><input id="f-title" value="${esc(g.title)}" placeholder="Game title" /></div>
          ${formFields(g)}
        </div>
        <div class="form-actions">
          <button class="btn ghost sm" id="f-cancel">Cancel</button>
          <button class="btn sm" id="f-save">Save</button>
        </div>
      </div>`;
    const titleEl = document.getElementById("f-title");
    titleEl.focus();
    const saveEdit = () => {
      const title = titleEl.value.trim();
      if (!title) { titleEl.focus(); return; }
      const fields = readFields();
      Object.assign(g, { title, ...fields });
      editingId = null;
      activeTab = fields.bucket;
      save(); render(); toast("Saved");
    };
    document.getElementById("f-save").onclick = saveEdit;
    document.getElementById("f-cancel").onclick = () => { editingId = null; render(); };
    titleEl.onkeydown = e => { if (e.key === "Enter") saveEdit(); };
    updateAddToggle();
    return;
  }

  if (!showAdd) { mount.innerHTML = ""; updateAddToggle(); return; }
  mount.innerHTML = `
    <div class="form">
      <div class="form-label">New game</div>
      <div class="grid">
        <div class="full"><input id="f-title" placeholder="Game title" autofocus /></div>
        ${formFields(null)}
      </div>
      <div class="form-actions">
        <button class="btn ghost sm" id="f-cancel">Cancel</button>
        <button class="btn sm" id="f-add">Add game</button>
      </div>
    </div>`;
  const titleEl = document.getElementById("f-title");
  titleEl.focus();
  const submit = () => {
    const title = titleEl.value.trim();
    if (!title) { titleEl.focus(); return; }
    const fields = readFields();
    games.push({ id: Date.now(), title, ...fields });
    save();
    showAdd = false;
    activeTab = fields.bucket;
    render(); toast(`Added to ${fields.bucket}`);
  };
  document.getElementById("f-add").onclick = submit;
  document.getElementById("f-cancel").onclick = () => { showAdd = false; render(); };
  titleEl.onkeydown = e => { if (e.key === "Enter") submit(); };
  updateAddToggle();
}

function renderList() {
  const list = document.getElementById("list");
  const items = games
    .filter(g => g.bucket === activeTab && g.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "alpha" ? a.title.localeCompare(b.title) :
      sortBy === "hours" ? (Number(b.hours)||0) - (Number(a.hours)||0) :
      b.id - a.id);

  if (!items.length) {
    list.innerHTML = `<div class="empty">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>
      <p class="big">Nothing in ${activeTab}</p>
      <p class="sm">Add a game and move it here</p>
    </div>`;
    return;
  }

  list.innerHTML = items.map((g, i) => {
    const spotlight = activeTab === "Now" && i === 0;
    return `<div class="card ${spotlight ? "spotlight" : ""}">
      ${spotlight ? `<div class="badge-now">${ICONS.play} Playing now</div>` : ""}
      <div class="card-top">
        <div style="flex:1; min-width:0">
          <div class="card-title">${esc(g.title)}</div>
          <div class="meta">
            <span class="pill">${esc(g.platform)}</span>
            ${g.genre ? `<span class="sub">${esc(g.genre)}</span>` : ""}
            ${g.hours ? `<span class="sub">~${g.hours}h</span>` : ""}
          </div>
          ${g.notes ? `<div class="notes">${esc(g.notes)}</div>` : ""}
        </div>
        <div class="card-btns">
          <button class="card-btn edit-btn" data-edit="${g.id}" aria-label="Edit ${esc(g.title)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="card-btn del-btn" data-del="${g.id}" aria-label="Remove ${esc(g.title)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>`;
  }).join("");

  list.querySelectorAll("[data-edit]").forEach(btn =>
    btn.onclick = () => {
      editingId = Number(btn.dataset.edit);
      showAdd = false;
      render();
      document.getElementById("formMount").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  list.querySelectorAll("[data-del]").forEach(btn =>
    btn.onclick = () => {
      games = games.filter(x => x.id !== Number(btn.dataset.del));
      save(); render();
    });
}

function updateAddToggle() {
  const btn = document.getElementById("addToggle");
  btn.innerHTML = showAdd
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add game`;
  btn.classList.toggle("ghost", showAdd);
}

function render() {
  renderBuckets();
  renderSummary();
  renderForm();
  renderList();
}
