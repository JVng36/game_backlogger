const STORAGE_KEY = "game-backlog-v1";

const BUCKETS = [
  { id: "Now",     label: "Now",     color: "var(--now)",     icon: "play"    },
  { id: "Soon",    label: "Soon",    color: "var(--soon)",    icon: "clock"   },
  { id: "Someday", label: "Someday", color: "var(--someday)", icon: "compass" },
  { id: "Done",    label: "Done",    color: "var(--done)",    icon: "check"   },
  { id: "Drop",    label: "Drop",    color: "var(--drop)",    icon: "x"       },
];
const COLOR_HEX = { Now:"#f0a838", Soon:"#4f9be8", Someday:"#8b80f0", Done:"#2bb189", Drop:"#e06a44" };
const PLATFORMS = ["PC","PS5","PS4","Xbox","Switch","Mobile","Other"];
const GENRES = ["","Action","RPG","Strategy","Puzzle","Platformer","Shooter","Adventure","Simulation","Horror","Sports","Other"];

const ICONS = {
  play:    '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  clock:   '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  compass: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  check:   '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
  x:       '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};
