/* ============================================================
   audio.js — محرك الصوت المُولَّد برمجيًا (بدون ملفات)
   ============================================================ */
'use strict';

let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return false;
    }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return true;
}

/* ---------- صوت الكسر عند الكتابة ---------- */
function playCrack() {
  if (!ensureAudio()) return;
  const ctx = audioCtx;
  const now = ctx.currentTime;

  // 1) ضجيج أبيض قصير مع انحدار
  const dur = 0.07;
  const size = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) {
    const t = i / size;
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 1200 + Math.random() * 900;

  const g1 = ctx.createGain();
  g1.gain.setValueAtTime(0.11, now);
  g1.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  noise.connect(hp);
  hp.connect(g1);
  g1.connect(ctx.destination);
  noise.start(now);

  // 2) نغمة عالية قصيرة تنحدر
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1400 + Math.random() * 700, now);
  osc.frequency.exponentialRampToValueAtTime(380, now + 0.06);

  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.04, now);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

  osc.connect(g2);
  g2.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

/* ---------- صوت ناعم عند الضغط على الأزرار ---------- */
function playClick() {
  if (!ensureAudio()) return;
  const ctx = audioCtx;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(720, now);
  osc.frequency.exponentialRampToValueAtTime(1180, now + 0.05);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.075, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);

  // طبقة ذهبية ثانية خفيفة
  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(1560, now + 0.01);
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.0001, now);
  g2.gain.exponentialRampToValueAtTime(0.03, now + 0.02);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  osc2.connect(g2);
  g2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.13);
}

/* ---------- صوت نجاح (لإتمام المهمة) ---------- */
function playSuccess() {
  if (!ensureAudio()) return;
  const ctx = audioCtx;
  const now = ctx.currentTime;
  [880, 1180, 1480].forEach((f, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, now + i * 0.06);
    g.gain.setValueAtTime(0.0001, now + i * 0.06);
    g.gain.exponentialRampToValueAtTime(0.06, now + i * 0.06 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.18);
    o.connect(g); g.connect(ctx.destination);
    o.start(now + i * 0.06);
    o.stop(now + i * 0.06 + 0.2);
  });
}

/* ---------- ربط صوت الضغط بكل الأزرار ---------- */
function initButtonSounds() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, .btn, .tab, .status-btn');
    if (btn && !btn.disabled) playClick();
  }, true);
}
