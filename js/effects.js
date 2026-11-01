/* ============================================================
   محرك الصوت والتأثيرات البصرية (محدث)
   ============================================================ */
let audioCtx = null;

function ensureAudio() {
    if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return false; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return true;
}

function playCrack() {
    if (!ensureAudio()) return;
    const ctx = audioCtx, now = ctx.currentTime;
    const dur = 0.07, size = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++) {
        const t = i / size;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
    }
    const noise = ctx.createBufferSource(); noise.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200 + Math.random() * 900;
    const g1 = ctx.createGain(); g1.gain.setValueAtTime(0.11, now); g1.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    noise.connect(hp); hp.connect(g1); g1.connect(ctx.destination); noise.start(now);
}

function spawnShards(x, y, count = 7) {
    const COLORS = ['#73022c', '#a52a4e', '#facc15', '#eab308', '#5a021f'];
    for (let i = 0; i < count; i++) {
        const shard = document.createElement('div');
        const s = 3 + Math.random() * 5;
        shard.style.cssText = `position:fixed; left:${x}px; top:${y}px; width:${s}px; height:${s}px; background:${COLORS[Math.floor(Math.random() * COLORS.length)]}; pointer-events:none; z-index:9999; border-radius:1px; box-shadow:0 0 4px rgba(250, 204, 21, 0.7); clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);`;
        document.body.appendChild(shard);
        const angle = Math.random() * Math.PI * 2, dist = 20 + Math.random() * 45;
        const dx = Math.cos(angle) * dist, dy = Math.sin(angle) * dist - 8;
        shard.animate([
            { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) rotate(${(Math.random()-0.5)*720}deg) scale(0.15)`, opacity: 0 }
        ], { duration: 450, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)', fill: 'forwards' }).onfinish = () => shard.remove();
    }
}

function getCaretCoords(input) {
    const rect = input.getBoundingClientRect();
    const style = window.getComputedStyle(input);
    const mirror = document.createElement('span');
    mirror.style.cssText = `position:absolute; visibility:hidden; white-space:pre; direction:rtl; font-family:${style.fontFamily}; font-size:${style.fontSize}; font-weight:${style.fontWeight};`;
    mirror.textContent = input.value.substring(0, input.selectionStart != null ? input.selectionStart : input.value.length);
    document.body.appendChild(mirror);
    const textWidth = mirror.offsetWidth;
    mirror.remove();
    let x = rect.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight) - textWidth;
    return { x: Math.max(rect.left + 10, Math.min(rect.right - 10, x)), y: rect.top + rect.height / 2 };
}

// ربط الأحداث بشكل عام (Event Delegation) ليشمل الحقول الجديدة
document.addEventListener('input', (e) => {
    if (!e.target.classList.contains('type-crack')) return;
    if (e.inputType && e.inputType.startsWith('delete')) return;
    if (e.data == null) return;

    playCrack();
    const { x, y } = getCaretCoords(e.target);
    spawnShards(x, y, 7);

    e.target.classList.remove('input-cracking');
    void e.target.offsetWidth; // trigger reflow
    e.target.classList.add('input-cracking');
});

// صوت جميل عند الضغط على الأزرار
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        if (!ensureAudio()) return;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        g.gain.setValueAtTime(0.05, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    }
});
