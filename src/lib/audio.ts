type SfxName =
  | "tap"
  | "correct"
  | "wrong"
  | "complete"
  | "buy"
  | "equip"
  | "unequip"
  | "deny"
  | "heart"
  | "claim"
  | "freeze"
  | "mood-idle"
  | "mood-wave"
  | "mood-sad"
  | "mood-celebrate"
  | "mood-think"
  | "mood-proud"
  | "mood-angry"
  | "mood-sleep";

type Graph = {
  ctx: AudioContext;
  bus: GainNode;
  master: GainNode;
  compressor: DynamicsCompressorNode;
};

let graph: Graph | null = null;
let buffers = new Map<string, AudioBuffer>();
let baking: Promise<void> | null = null;
let enabled = true;
let lastTap = 0;

function AC(): typeof AudioContext {
  return window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
}

function live(): Graph | null {
  if (typeof window === "undefined") return null;
  if (!graph) {
    const ctx = new (AC())();
    const bus = ctx.createGain();
    bus.gain.value = 1;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 12;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.12;
    const master = ctx.createGain();
    master.gain.value = enabled ? 0.9 : 0.0001;
    bus.connect(compressor);
    compressor.connect(master);
    master.connect(ctx.destination);
    graph = { ctx, bus, master, compressor };
    baking ??= bake(ctx.sampleRate);
  }
  return graph;
}

function tone(
  ctx: BaseAudioContext,
  dest: AudioNode,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gain: number,
  slide?: number,
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), start + duration);
  g.gain.setValueAtTime(Math.max(0.0001, gain), start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g);
  g.connect(dest);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noiseBurst(
  ctx: BaseAudioContext,
  dest: AudioNode,
  start: number,
  duration: number,
  gain: number,
  hp: number,
) {
  const samples = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, samples, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < samples; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(hp, start);
  const g = ctx.createGain();
  g.gain.setValueAtTime(Math.max(0.0001, gain), start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter);
  filter.connect(g);
  g.connect(dest);
  src.start(start);
  src.stop(start + duration);
}

function patch(ctx: BaseAudioContext, dest: AudioNode, name: SfxName) {
  const t0 = ctx instanceof OfflineAudioContext ? 0 : (ctx as AudioContext).currentTime;
  switch (name) {
    case "tap":
      tone(ctx, dest, 880, t0, 0.045, "sine", 0.04);
      break;
    case "correct":
      tone(ctx, dest, 523.25, t0, 0.08, "triangle", 0.08);
      tone(ctx, dest, 659.25, t0 + 0.08, 0.12, "triangle", 0.08);
      break;
    case "wrong":
      tone(ctx, dest, 196, t0, 0.18, "sawtooth", 0.05, 140);
      noiseBurst(ctx, dest, t0, 0.08, 0.035, 280);
      break;
    case "complete":
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        tone(ctx, dest, freq, t0 + i * 0.09, 0.14, "triangle", 0.075);
      });
      noiseBurst(ctx, dest, t0 + 0.28, 0.16, 0.03, 1600);
      break;
    case "buy":
      tone(ctx, dest, 988, t0, 0.05, "sine", 0.055);
      tone(ctx, dest, 1319, t0 + 0.05, 0.1, "triangle", 0.065);
      noiseBurst(ctx, dest, t0, 0.06, 0.02, 2400);
      break;
    case "equip":
      tone(ctx, dest, 392, t0, 0.06, "triangle", 0.055, 587);
      tone(ctx, dest, 784, t0 + 0.07, 0.1, "sine", 0.05);
      break;
    case "unequip":
      tone(ctx, dest, 587, t0, 0.08, "sine", 0.045, 330);
      break;
    case "deny":
      tone(ctx, dest, 140, t0, 0.08, "square", 0.03);
      tone(ctx, dest, 120, t0 + 0.1, 0.1, "square", 0.025);
      break;
    case "heart":
      tone(ctx, dest, 140, t0, 0.1, "sine", 0.07, 88);
      noiseBurst(ctx, dest, t0, 0.07, 0.03, 180);
      break;
    case "claim":
      tone(ctx, dest, 784, t0, 0.07, "triangle", 0.065);
      tone(ctx, dest, 1175, t0 + 0.08, 0.14, "sine", 0.055);
      break;
    case "freeze":
      tone(ctx, dest, 1400, t0, 0.05, "sine", 0.04, 1800);
      tone(ctx, dest, 2100, t0 + 0.05, 0.1, "triangle", 0.035, 900);
      noiseBurst(ctx, dest, t0, 0.08, 0.018, 3000);
      break;
    case "mood-celebrate":
      tone(ctx, dest, 523, t0, 0.07, "triangle", 0.075, 784);
      tone(ctx, dest, 784, t0 + 0.07, 0.1, "triangle", 0.06, 1046);
      noiseBurst(ctx, dest, t0, 0.12, 0.028, 1800);
      break;
    case "mood-proud":
      tone(ctx, dest, 523, t0, 0.08, "triangle", 0.06, 659);
      tone(ctx, dest, 784, t0 + 0.08, 0.1, "sine", 0.05);
      break;
    case "mood-wave":
      tone(ctx, dest, 400, t0, 0.06, "sine", 0.07, 640);
      tone(ctx, dest, 640, t0 + 0.06, 0.08, "sine", 0.05, 480);
      break;
    case "mood-sad":
      tone(ctx, dest, 280, t0, 0.18, "sine", 0.05, 170);
      break;
    case "mood-angry":
      tone(ctx, dest, 160, t0, 0.12, "square", 0.035, 118);
      noiseBurst(ctx, dest, t0, 0.1, 0.04, 380);
      break;
    case "mood-think":
      tone(ctx, dest, 494, t0, 0.07, "sine", 0.04, 523);
      tone(ctx, dest, 392, t0 + 0.1, 0.08, "sine", 0.03);
      break;
    case "mood-sleep":
      tone(ctx, dest, 220, t0, 0.2, "sine", 0.03, 150);
      break;
    default:
      tone(ctx, dest, 360, t0, 0.06, "sine", 0.07, 640);
      tone(ctx, dest, 640, t0 + 0.05, 0.08, "sine", 0.05, 420);
  }
}

const ALL: SfxName[] = [
  "tap",
  "correct",
  "wrong",
  "complete",
  "buy",
  "equip",
  "unequip",
  "deny",
  "heart",
  "claim",
  "freeze",
  "mood-idle",
  "mood-wave",
  "mood-sad",
  "mood-celebrate",
  "mood-think",
  "mood-proud",
  "mood-angry",
  "mood-sleep",
];

async function bake(sampleRate: number) {
  if (buffers.size === ALL.length) return;
  await Promise.all(
    ALL.map(async (name) => {
      const offline = new OfflineAudioContext(2, Math.ceil(sampleRate * 0.55), sampleRate);
      patch(offline, offline.destination, name);
      buffers.set(name, await offline.startRendering());
    }),
  );
}

export function setAudioEnabled(on: boolean) {
  enabled = on;
  const g = live();
  if (!g) return;
  g.master.gain.cancelScheduledValues(g.ctx.currentTime);
  g.master.gain.setTargetAtTime(on ? 0.9 : 0.0001, g.ctx.currentTime, 0.03);
}

export async function primeAudio() {
  const g = live();
  if (!g) return;
  if (g.ctx.state !== "running") await g.ctx.resume();
  baking ??= bake(g.ctx.sampleRate);
  await baking;
}

function fire(name: SfxName, opts?: { pan?: number; rate?: number }) {
  if (!enabled) return;
  const g = live();
  if (!g) return;
  void g.ctx.resume();
  const buf = buffers.get(name);
  if (!buf) {
    patch(g.ctx, g.bus, name);
    return;
  }
  const src = g.ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = opts?.rate ?? 1;
  const filter = g.ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 12000;
  const pan = g.ctx.createStereoPanner();
  pan.pan.value = Math.max(-0.8, Math.min(0.8, opts?.pan ?? 0));
  src.connect(filter);
  filter.connect(pan);
  pan.connect(g.bus);
  src.start();
}

export function playTap() {
  const now = performance.now();
  if (now - lastTap < 70) return;
  lastTap = now;
  fire("tap");
}

export function playSqueak() {
  fire("mood-idle");
}

export function playMoodSfx(mood: string, pan = 0) {
  const key = (`mood-${mood}` as SfxName);
  fire(ALL.includes(key) ? key : "mood-idle", { pan, rate: 0.97 + Math.random() * 0.06 });
}

export const playCorrect = () => fire("correct");
export const playWrong = () => fire("wrong");
export const playComplete = () => fire("complete");
export const playBuy = () => fire("buy");
export const playEquip = () => fire("equip");
export const playUnequip = () => fire("unequip");
export const playDeny = () => fire("deny");
export const playHeart = () => fire("heart");
export const playClaim = () => fire("claim");
export const playFreeze = () => fire("freeze");
