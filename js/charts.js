/* ============ المخططات ============ */
const Charts = (() => {
  let barChart = null;
  let pieChart = null;

  const COLORS = ['#6366f1','#a855f7','#ec4899','#f59e0b','#10b981','#06b6d4','#ef4444'];
  const COLORS_ALPHA = COLORS.map(c => c + 'CC');

  function getThemeColors() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      text: dark ? '#f1f5f9' : '#0f172a',
      grid: dark ? '#334155' : '#e2e8f0',
    };
  }

  /* استخراج بيانات رسم من الجدول */
  function extractChartData(table) {
    if (!table || !table.rows || !table.columns) return { labels: [], values: [] };

    const labels = [];
    const values = [];

    table.rows.forEach(row => {
      // التسمية = أول خلية غير فارغة
      const label = (row[0] || '').toString().trim();
      if (!label) return;

      // القيمة الرقمية = آخر خلية تحتوي رقمًا
      let num = 0;
      for (let i = row.length - 1; i >= 0; i--) {
        const v = parseFloat(row[i]);
        if (!isNaN(v)) { num = v; break; }
      }
      labels.push(label);
      values.push(num);
    });

    return { labels, values };
  }

  /* رسم/تحديث المخططات */
  function render(table) {
    const { labels, values } = extractChartData(table);
    const { text, grid } = getThemeColors();

    // ---- عمودي ----
    const barCtx = document.getElementById('barChart');
    if (barCtx) {
      if (barChart) barChart.destroy();
      barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'القيمة',
            data: values,
            backgroundColor: COLORS_ALPHA.slice(0, values.length || 1),
            borderColor: COLORS.slice(0, values.length || 1),
            borderWidth: 1.5,
            borderRadius: 8,
            // المسافة = نصف عرض العمود
            barPercentage: 0.66,
            categoryPercentage: 0.66,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { rtl: true, textDirection: 'rtl' },
          },
          scales: {
            x: {
              ticks: { color: text },
              grid: { color: grid },
              title: { display: true, text: 'الفئات', color: text },
            },
            y: {
              beginAtZero: true, // أفضل ممارسة: البدء من الصفر
              ticks: { color: text },
              grid: { color: grid },
              title: { display: true, text: 'القيمة العددية', color: text },
            },
          },
        },
      });
    }

    // ---- دائري ----
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
      if (pieChart) pieChart.destroy();
      const total = values.reduce((a, b) => a + b, 0);
      // في حال عدم وجود بيانات → مربع رمادي
      const hasData = total > 0 && labels.length > 0;
      pieChart = new Chart(pieCtx, {
        type: 'doughnut', // استخدام donut لتحسين المظهر (يمكن تغييره لـ 'pie')
        data: {
          labels: hasData ? labels : ['لا توجد بيانات'],
          datasets: [{
            data: hasData ? values : [1],
            backgroundColor: hasData ? COLORS_ALPHA.slice(0, values.length) : ['#cbd5e1'],
            borderColor: 'transparent',
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              rtl: true,
              labels: { color: text, padding: 12 },
            },
            tooltip: {
              rtl: true,
              textDirection: 'rtl',
              callbacks: {
                label: (ctx) => {
                  if (!hasData) return 'لا توجد بيانات';
                  const t = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = t ? ((ctx.parsed / t) * 100).toFixed(1) : 0;
                  return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
                },
              },
            },
          },
        },
      });
    }
  }

  return { render };
})();