function exportData() {
  if (!games.length) { toast("Nothing to export yet"); return; }
  const blob = new Blob([JSON.stringify(games, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backlog-save-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Exported your backlog");
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed)) throw new Error("bad format");
      const valid = parsed.filter(g => g && typeof g.title === "string");
      const existingIds = new Set(games.map(g => g.id));
      let added = 0;
      valid.forEach(g => {
        let id = Number(g.id) || Date.now() + Math.random();
        while (existingIds.has(id)) id = Date.now() + Math.floor(Math.random() * 1e6);
        existingIds.add(id);
        games.push({
          id,
          title: g.title,
          platform: PLATFORMS.includes(g.platform) ? g.platform : "Other",
          genre: g.genre || "",
          hours: g.hours != null ? Number(g.hours) : null,
          notes: g.notes || "",
          bucket: BUCKETS.some(b => b.id === g.bucket) ? g.bucket : "Someday",
        });
        added++;
      });
      save();
      render();
      toast(`Imported ${added} game${added === 1 ? "" : "s"}`);
    } catch {
      toast("Could not read that file");
    }
  };
  reader.readAsText(file);
}
