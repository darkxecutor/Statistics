/* ============================================================
   effects.js — الشظايا + الموجة + ربط حقول الكتابة
   ============================================================ */
'use strict';

/* ---------- إيجاد موقع المؤشر داخل الحقل (RTL) ---------- */
function getCaretCoords(input) {
  const rect  = input.getBoundingClientRect();
  const style = window.getComputedStyle(input);

  const mirror = document.createElement('span');
  mirror.style.cssText = `
        position: absolute; top: -9999px; left: -9999px; visibility: hidden;
        white-space: pre; direction: rtl;
        font-family: ${style.fontFamily};
        font-size: ${style.fontSize};
        font-weight: ${style.fontWeight};
        letter-spacing: ${style.letterSpacing};
    `;
  const pos = input.selectionStart != null ? input.selectionStart : input.value.length;
  mirror.textContent = input.value.substring(0, pos);
  document.body.appendChild(mirror);
  const textWidth = mirror.offsetWidth;
  mirror.remove();

  const bR = parseFloat(style.borderRightWidth) || 0;
  const bL = parseFloat(style.borderLeftWidth)  || 0;
  const pR = parseFloat(style.paddingRight)     || 0;
  const pL = parseFloat(style.paddingLeft)      || 0;

  let x = rect.right - bR - pR - textWidth;
  x = Math.max(rect.left + bL + pL + 2, Math.min(rect.right - bR - pR - 2, x));
  const y = rect.top + rect.height / 2;
  return { x, y };
}

/* ---------- الشظايا ---------- */
const SHARD_COLORS = ['#73022c', '#a52a4e', '#facc15', '#eab308', '#5a021f'];

function spawnShards(x, y, count = 7) {
  for (let i = 0; i < count; i++) {
    const shard = document.createElement('div');
    const s = 3 + Math.random() * 5;
    shard.style.cssText = `
            position: fixed; left: ${x}px; top: ${y}px;
            width: ${s}px; height: ${s}px;
            background: ${SHARD_COLORS[Math.floor(Math.random() * SHARD_COLORS.length)]};
            pointer-events: none; z-index: 9999; border-radius: 1px;
            box-shadow: 0 0 4px rgba(250, 204, 21, 0.7);
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        `;
    document.body.appendChild(shard);

    const angle = Math.random() * Math.PI * 2;
    const dist  = 20 + Math.random() * 45;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 8;
    const rot = (Math.random() - 0.5) * 720;
    const dur = 450 + Math.random() * 350;

    shard.animate([
      { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.15)`, opacity: 0 }
    ], { duration: dur, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)', fill: 'forwards' })
      .onfinish = () => shard.remove();
  }
}

/* ---------- الموجة ---------- */
function spawnRipple(x, y) {
  const ring = document.createElement('div');
  ring.style.cssText = `
        position: fixed; left: ${x}px; top: ${y}px;
        width: 40px; height: 40px; margin-left: -20px; margin-top: -20px;
        border: 2px solid #facc15; border-radius: 50%;
        pointer-events: none; z-index: 9998;
    `;
  document.body.appendChild(ring);
  ring.animate([
    { transform: 'scale(0.2)', opacity: 0.9 },
    { transform: 'scale(1.4)', opacity: 0 }
  ], { duration: 380, easing: 'ease-out' })
    .onfinish = () => ring.remove();
}

/* ---------- ربط التأثير بكل حقل كتابة (تفويض الأحداث) ---------- */
function initTypingEffects() {
  document.addEventListener('input', (e) => {
    const input = e.target;
    if (!input || !input.classList || !input.classList.contains('type-crack')) return;

    // تجاهل الحذف واللصق
    if (e.inputType && e.inputType.startsWith('delete')) return;
    if (e.inputType === 'insertFromPaste') return;
    if (e.data == null) return;

    playCrack();
    const { x, y } = getCaretCoords(input);
    spawnShards(x, y, 7);
    spawnRipple(x, y);

    input.classList.remove('input-cracking');
    void input.offsetWidth;
    input.classList.add('input-cracking');
  });

  document.addEventListener('animationend', (e) => {
    if (e.target.classList && e.target.classList.contains('input-cracking')) {
      e.target.classList.remove('input-cracking');
    }
  });
}
