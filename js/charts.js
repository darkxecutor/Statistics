/* ============================================================
   charts.js — إدارة المخططات (يدعم ألوانًا مخصصة)
   ============================================================ */
'use strict';

const Charts = (function () {

  const registry = {};
  let ready = false;

  const PALETTE = [
    '#f4c430', '#3fbf7f', '#e07a5f', '#4a90e2', '#c77dff',
    '#ff6b9d', '#f9a826', '#06d6a0', '#ef476f', '#118ab2'
  ];

  function ensureReady() {
    if (ready) return true;
    if (typeof Chart === 'undefined') return false;
    Chart.defaults.font.family = "'Cairo', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#9a948a';
    Chart.defaults.borderColor = 'rgba(244,196,48,.12)';
    ready = true;
    return true;
  }

  function destroy(id) {
    if (registry[id]) {
      try { registry[id].destroy(); } catch (e) {}
      delete registry[id];
    }
  }

  function destroyAll() { Object.keys(registry).forEach(destroy); }
  function el(id) { return document.getElementById(id); }

  function withAlpha(hex, alphaHex) {
    // إذا كان اللون hex 6 أرقام نضيف alpha
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex + alphaHex;
    return hex;
  }

  /* ---------- عمودي ---------- */
  function bar(id, labels, values, label, options) {
    if (!ensureReady()) return null;
    const canvas = el(id);
    if (!canvas) return null;
    destroy(id);

    const opts = options || {};
    const colors = opts.colors || PALETTE;
    const maxY = opts.maxY;

    registry[id] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label || 'القيمة',
          data: values,
          backgroundColor: values.map((_, i) => withAlpha(colors[i % colors.length], 'cc')),
          borderColor: values.map((_, i) => colors[i % colors.length]),
          borderWidth: 1.5,
          borderRadius: 6,
          hoverBackgroundColor: '#ffd75e',
          hoverBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 700, easing: 'easeOutQuart' },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false, rtl: true, textDirection: 'rtl' },
          tooltip: {
            rtl: true,
            textDirection: 'rtl',
            backgroundColor: 'rgba(20,20,20,.95)',
            borderColor: 'rgba(244,196,48,.45)',
            borderWidth: 1,
            padding: 10
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: maxY,
            grid: { color: 'rgba(244,196,48,.10)' }
          },
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: 40,
              autoSkip: false,
              callback: function (value) {
                const t = this.getLabelForValue(value);
                return t.length > 14 ? t.slice(0, 13) + '…' : t;
              }
            }
          }
        }
      }
    });
    return registry[id];
  }

  /* ---------- دائري ---------- */
  function pie(id, labels, values, colors) {
    if (!ensureReady()) return null;
    const canvas = el(id);
    if (!canvas) return null;
    destroy(id);

    const total = values.reduce((a, b) => a + b, 0);
    const palette = colors || PALETTE;

    if (!total) {
      registry[id] = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: { labels: ['لا بيانات'], datasets: [{ data: [1], backgroundColor: ['#232323'], borderWidth: 0 }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          cutout: '62%'
        }
      });
      return registry[id];
    }

    registry[id] = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          borderColor: '#141414',
          borderWidth: 2,
          hoverOffset: 10,
          hoverBorderColor: '#ffd75e'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        animation: { animateRotate: true, duration: 800, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            position: 'bottom',
            rtl: true,
            textDirection: 'rtl',
            labels: {
              color: '#c8c2b6',
              font: { size: 11, family: "'Cairo', sans-serif" },
              boxWidth: 11,
              boxHeight: 11,
              usePointStyle: true,
              pointStyle: 'rectRounded',
              padding: 12
            }
          },
          tooltip: {
            rtl: true,
            textDirection: 'rtl',
            backgroundColor: 'rgba(20,20,20,.95)',
            borderColor: 'rgba(244,196,48,.45)',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function (ctx) {
                const v = ctx.parsed || 0;
                const pct = total ? Math.round((v / total) * 100) : 0;
                return ' ' + ctx.label + ': ' + v + ' (' + pct + '%)';
              }
            }
          }
        }
      }
    });
    return registry[id];
  }

  function preparePie(items, maxSlices) {
    const max = maxSlices || 10;
    const sorted = items.filter(it => it.value > 0)
                        .sort((a, b) => b.value - a.value);
    if (sorted.length <= max) return sorted;
    const head = sorted.slice(0, max - 1);
    const rest = sorted.slice(max - 1);
    const otherVal = rest.reduce((a, b) => a + b.value, 0);
    head.push({ label: 'أخرى', value: otherVal });
    return head;
  }

  return { bar, pie, destroy, destroyAll, preparePie, PALETTE };
})();
