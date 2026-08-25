// ============================================================
//  おと（ゲームボーイ風の しかくい なみ）
// ============================================================
let ac = null;
let master = null;
let bgmTimer = 0;
let bgmName = "";
let step = 0;
let muted = false;

export function initAudio() {
  if (ac) return;
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain();
    master.gain.value = 0.18;
    master.connect(ac.destination);
  } catch (e) { ac = null; }
}
export function resumeAudio() { if (ac && ac.state === "suspended") ac.resume(); }
export function setMuted(v) {
  muted = v;
  if (master) master.gain.value = v ? 0 : 0.18;
}
export function isMuted() { return muted; }

const NOTE = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
function freq(name) {
  if (!name || name === "-") return 0;
  const m = /^([A-G]#?)(\d)$/.exec(name);
  if (!m) return 0;
  const n = NOTE[m[1]] + (+m[2] + 1) * 12;
  return 440 * Math.pow(2, (n - 69) / 12);
}

function tone(f, dur, type, vol, when) {
  if (!ac || !f || muted) return;
  const t = when == null ? ac.currentTime : when;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type || "square";
  o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol == null ? 0.5 : vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master);
  o.start(t); o.stop(t + dur + 0.02);
}

/* --- こうかおん ------------------------------------------------ */
export function beep(kind) {
  if (!ac) return;
  const t = ac.currentTime;
  if (kind === "blip") tone(880, 0.05, "square", 0.35);
  else if (kind === "ok") { tone(660, 0.06, "square", 0.4); tone(990, 0.08, "square", 0.35, t + 0.06); }
  else if (kind === "back") tone(330, 0.08, "square", 0.35);
  else if (kind === "hit") { tone(160, 0.09, "square", 0.5); tone(90, 0.12, "sawtooth", 0.3, t + 0.04); }
  else if (kind === "super") { tone(200, 0.06, "square", 0.5); tone(150, 0.14, "sawtooth", 0.45, t + 0.05); }
  else if (kind === "weak") tone(120, 0.12, "triangle", 0.3);
  else if (kind === "faint") { for (let i = 0; i < 6; i++) tone(500 - i * 70, 0.09, "square", 0.3, t + i * 0.06); }
  else if (kind === "levelup") { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.12, "square", 0.4, t + i * 0.08)); }
  else if (kind === "catch") { [660, 880, 1320].forEach((f, i) => tone(f, 0.14, "square", 0.4, t + i * 0.12)); }
  else if (kind === "ball") tone(440, 0.05, "square", 0.4);
  else if (kind === "heal") { [523, 659, 523, 784].forEach((f, i) => tone(f, 0.14, "triangle", 0.4, t + i * 0.14)); }
  else if (kind === "buy") { tone(880, 0.06, "square", 0.35); tone(1174, 0.1, "square", 0.3, t + 0.07); }
  else if (kind === "warp") { for (let i = 0; i < 5; i++) tone(300 + i * 120, 0.05, "square", 0.3, t + i * 0.04); }
}

/* --- BGM -------------------------------------------------------
   1しょうせつ 16ステップ。lead と bass の 2パート。
------------------------------------------------------------------ */
const BGM = {
  town: {
    tempo: 150,
    lead: ["C5", "-", "E5", "-", "G5", "-", "E5", "-", "F5", "-", "A5", "-", "G5", "-", "E5", "-",
           "D5", "-", "F5", "-", "A5", "-", "F5", "-", "E5", "-", "C5", "-", "D5", "-", "-", "-"],
    bass: ["C3", "-", "-", "-", "G2", "-", "-", "-", "F2", "-", "-", "-", "C3", "-", "-", "-",
           "D3", "-", "-", "-", "A2", "-", "-", "-", "C3", "-", "-", "-", "G2", "-", "-", "-"],
  },
  route: {
    tempo: 168,
    lead: ["E5", "G5", "A5", "G5", "E5", "-", "D5", "-", "C5", "E5", "G5", "E5", "D5", "-", "-", "-",
           "F5", "A5", "C6", "A5", "G5", "-", "E5", "-", "D5", "F5", "A5", "F5", "E5", "-", "-", "-"],
    bass: ["A2", "-", "E3", "-", "A2", "-", "E3", "-", "F2", "-", "C3", "-", "F2", "-", "C3", "-",
           "D3", "-", "A2", "-", "D3", "-", "A2", "-", "E3", "-", "B2", "-", "E3", "-", "-", "-"],
  },
  battle: {
    tempo: 190,
    lead: ["A4", "A4", "C5", "E5", "A5", "-", "G5", "E5", "F5", "-", "E5", "-", "D5", "-", "C5", "-",
           "B4", "B4", "D5", "F5", "B5", "-", "A5", "F5", "E5", "-", "D5", "-", "C5", "-", "-", "-"],
    bass: ["A2", "A2", "-", "A2", "E2", "-", "E2", "-", "F2", "F2", "-", "F2", "C3", "-", "C3", "-",
           "B2", "B2", "-", "B2", "F2", "-", "F2", "-", "E2", "E2", "-", "E2", "A2", "-", "-", "-"],
  },
  boss: {
    tempo: 200,
    lead: ["D5", "-", "D5", "F5", "A5", "-", "A5", "C6", "D6", "-", "C6", "A5", "F5", "-", "D5", "-",
           "C5", "-", "C5", "E5", "G5", "-", "G5", "B5", "C6", "-", "B5", "G5", "E5", "-", "C5", "-"],
    bass: ["D2", "D2", "D2", "-", "A2", "A2", "-", "-", "D2", "D2", "D2", "-", "A2", "-", "-", "-",
           "C2", "C2", "C2", "-", "G2", "G2", "-", "-", "C2", "C2", "C2", "-", "G2", "-", "-", "-"],
  },
  center: {
    tempo: 120,
    lead: ["G4", "-", "C5", "-", "E5", "-", "C5", "-", "D5", "-", "G5", "-", "E5", "-", "-", "-",
           "F5", "-", "A5", "-", "G5", "-", "E5", "-", "C5", "-", "D5", "-", "C5", "-", "-", "-"],
    bass: ["C3", "-", "-", "-", "G2", "-", "-", "-", "C3", "-", "-", "-", "G2", "-", "-", "-",
           "F2", "-", "-", "-", "C3", "-", "-", "-", "G2", "-", "-", "-", "C3", "-", "-", "-"],
  },
  cave: {
    tempo: 110,
    lead: ["A4", "-", "-", "C5", "-", "-", "B4", "-", "A4", "-", "-", "F4", "-", "-", "-", "-",
           "G4", "-", "-", "B4", "-", "-", "A4", "-", "G4", "-", "-", "E4", "-", "-", "-", "-"],
    bass: ["A2", "-", "-", "-", "-", "-", "-", "-", "F2", "-", "-", "-", "-", "-", "-", "-",
           "G2", "-", "-", "-", "-", "-", "-", "-", "E2", "-", "-", "-", "-", "-", "-", "-"],
  },
  victory: {
    tempo: 190,
    lead: ["C5", "C5", "C5", "-", "G4", "-", "C5", "-", "E5", "-", "G5", "-", "C6", "-", "-", "-",
           "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    bass: ["C3", "C3", "C3", "-", "C3", "-", "-", "-", "C3", "-", "G2", "-", "C3", "-", "-", "-",
           "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  },
};

export function playBgm(name) {
  if (bgmName === name) return;
  stopBgm();
  if (!BGM[name] || !ac) { bgmName = name; return; }
  bgmName = name;
  step = 0;
  const t = BGM[name];
  const ms = 60000 / t.tempo / 2;
  bgmTimer = setInterval(() => {
    if (!ac || muted) return;
    const i = step % t.lead.length;
    tone(freq(t.lead[i]), ms / 1000 * 0.9, "square", 0.22);
    tone(freq(t.bass[i]), ms / 1000 * 0.9, "triangle", 0.3);
    step++;
  }, ms);
}

export function stopBgm() {
  if (bgmTimer) clearInterval(bgmTimer);
  bgmTimer = 0;
  bgmName = "";
}
export function currentBgm() { return bgmName; }
