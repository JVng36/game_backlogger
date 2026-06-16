let games = [];
let activeTab = "Now";
let showAdd = false;
let search = "";
let sortBy = "added";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    games = raw ? JSON.parse(raw) : [];
  } catch { games = []; }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(games)); }
  catch { toast("Could not save — storage may be full or blocked"); }
}
