/* ============================================================
   charts.js — إدارة المخططات (Chart.js)
   ============================================================ */
'use strict';

const Charts = (function () {

  const registry = {};
  let ready = false;

  /* لوحة ألوان الذهبي/الأسود/الرمادي */
  const PALETTE = [
    '#f4c430', '#ffd75e', '#c99a1e', '#a67c00',
    '#8a6d14', '#7a5c00', '#5c4a10', '#4a3800',
    '#3a2f0a', '#2e2300'
  ];

  const ACCENTS = ['#f4c430', '#a52a4e', '#3fbf7f', '#c99a1e', '#73022c'];

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

  function destroyAll() {
    Object.keys(registry).forEach(destroy);
  }

  function el(id) {
    const c = document.getElementById(id);
    if (!c) return null;
    return c;
  }

  /* ---------- مخطط عمودي ---------- */
  function bar(id, labels, values, label, options) {
    if (!ensureReady()) return null;
    const canvas = el(id);
    if (!canvas) return null;
    destroy(id);

    const opts = Object.assign({
      barPercentage: 0.66,
      categoryPercentage: 0.8
    }, options || {});

    registry[id] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label || 'القيمة',
          data: values,
          backgroundColor: values.map((_, i) => PALETTE[i % PALETTE.length] + 'cc'),
          borderColor: values.map((_, i) => PALETTE[i % PALETTE.length]),
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
            padding: 10,
            titleFont: { family: "'Cairo', sans-serif", weight: '700' },
            bodyFont: { family: "'Cairo', sans-serif" }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: opts.maxY || undefined,
            grid: { color: 'rgba(244,196,48,.10)' },
            ticks: { color: '#9a948a', font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: {
              color: '#b8b2a6',
              font: { size: 11 },
              maxRotation: 40,
              minRotation: 0,
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

  /* ---------- مخطط دائري ---------- */
  function pie(id, labels, values, colors) {
    if (!ensureReady()) return null;
    const canvas = el(id);
    if (!canvas) return null;
    destroy(id);

    const total = values.reduce((a, b) => a + b, 0);
    if (!total) {
      // لا بيانات
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

    const palette = colors || PALETTE;

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

  /**
   * تجهيز بيانات الدائري:
   * ترتيب تنازلي + دمج ما زاد عن 10 شرائح في "أخرى"
   */
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

  return { bar, pie, destroy, destroyAll, preparePie, PALETTE, ACCENTS };
})();
