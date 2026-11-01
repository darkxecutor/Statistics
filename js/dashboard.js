// التحقق من تسجيل الدخول
if (!Auth.requireAuth()) throw new Error("غير مسجل");

// إعدادات التاريخ
const today = new Date();
const dateKey = today.toISOString().split('T')[0]; // YYYY-MM-DD
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('currentDateLabel').textContent = today.toLocaleDateString('ar-EG', dateOptions);

let dailyData = AppStorage.getDay(dateKey) || { date: dateKey, morning: [], evening: [] };

// --- نظام التبويبات ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        
        if (btn.dataset.tab === 'weekly') updateCharts();
        if (btn.dataset.tab === 'monthly') updateMonthly();
    });
});

// --- رسم المهام اليومية ---
function renderTasks() {
    ['morning', 'evening'].forEach(period => {
        const container = document.getElementById(`${period}List`);
        container.innerHTML = '';
        dailyData[period].forEach((task, index) => {
            const row = document.createElement('div');
            row.className = 'task-row';
            row.innerHTML = `
                <input type="text" class="type-crack" placeholder="الهدف/المهمة..." value="${task.text}" onchange="updateTask('${period}', ${index}, 'text', this.value)">
                <input type="time" value="${task.time || ''}" onchange="updateTask('${period}', ${index}, 'time', this.value)" title="وقت البدء">
                <input type="number" placeholder="المدة (د)" value="${task.duration || ''}" onchange="updateTask('${period}', ${index}, 'duration', this.value)" title="المدة بالدقائق">
                <button class="btn-status success ${task.status === 'success' ? 'active' : ''}" onclick="setStatus('${period}', ${index}, 'success')">✅</button>
                <button class="btn-status fail ${task.status === 'fail' ? 'active' : ''}" onclick="setStatus('${period}', ${index}, 'fail')">❌</button>
            `;
            container.appendChild(row);
        });
    });
}

// إضافة مهمة جديدة
document.querySelectorAll('.add-task').forEach(btn => {
    btn.addEventListener('click', () => {
        const period = btn.dataset.period;
        dailyData[period].push({ text: '', time: '', duration: '', status: null });
        renderTasks();
    });
});

// تحديث نص المهمة
window.updateTask = (period, index, field, value) => {
    dailyData[period][index][field] = value;
};

// وضع علامة صح أو خطأ
window.setStatus = (period, index, status) => {
    dailyData[period][index].status = status;
    renderTasks(); // إعادة الرسم لتحديث الألوان
};

// حفظ اليوم
document.getElementById('saveDayBtn').addEventListener('click', () => {
    AppStorage.saveDay(dailyData);
    showToast('تم حفظ بيانات اليوم بنجاح ✅');
});

// --- منطق الأسبوع والشهر والمخططات ---
let weeklyChartBar = null;
let weeklyChartPie = null;

function updateCharts() {
    // 1. جمع بيانات الأسبوع (آخر 7 أيام)
    const allDays = AppStorage.getDays();
    let successCount = 0, failCount = 0;
    const taskLabels = [], taskStatus = [];

    allDays.slice(-7).forEach(day => {
        ['morning', 'evening'].forEach(period => {
            day[period].forEach(task => {
                if (task.status === 'success') { successCount++; taskLabels.push(task.text || 'مهمة'); taskStatus.push(1); }
                if (task.status === 'fail') { failCount++; taskLabels.push(task.text || 'مهمة'); taskStatus.push(0); }
            });
        });
    });

    // 2. رسم المخطط العمودي
    const ctxBar = document.getElementById('weeklyBarChart').getContext('2d');
    if (weeklyChartBar) weeklyChartBar.destroy();
    weeklyChartBar = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['المهام المنجزة', 'المهام غير المنجزة'],
            datasets: [{
                label: 'العدد',
                data: [successCount, failCount],
                backgroundColor: ['#10b981', '#ef4444'],
                borderRadius: 8
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // 3. رسم المخطط الدائري
    const ctxPie = document.getElementById('weeklyPieChart').getContext('2d');
    if (weeklyChartPie) weeklyChartPie.destroy();
    weeklyChartPie = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['منجز', 'غير منجز'],
            datasets: [{
                data: [successCount, failCount],
                backgroundColor: ['#10b981', '#ef4444'],
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function updateMonthly() {
    const settings = AppStorage.getSettings();
    const allDays = AppStorage.getDays();
    
    let totalTasks = 0, totalSuccess = 0;
    allDays.forEach(day => {
        ['morning', 'evening'].forEach(period => {
            day[period].forEach(task => {
                if (task.status) {
                    totalTasks++;
                    if (task.status === 'success') totalSuccess++;
                }
            });
        });
    });

    const percentage = totalTasks === 0 ? 0 : Math.round((totalSuccess / totalTasks) * 100);
    
    document.getElementById('monthlyPercentage').textContent = `${percentage}%`;
    document.getElementById('monthlyProgressFill').style.width = `${percentage}%`;

    const rewardBox = document.getElementById('rewardMessage');
    const rewardStatus = document.getElementById('monthRewardStatus');
    const rewardText = document.getElementById('rewardText');

    if (percentage >= 85) {
        rewardBox.classList.remove('hidden');
        rewardText.textContent = settings.monthlyReward || 'مكافأة رائعة!';
        rewardStatus.textContent = '🎉 هدف الشهر تم تحقيقه!';
        rewardStatus.className = 'badge success';
    } else {
        rewardBox.classList.add('hidden');
        rewardStatus.textContent = `تحتاج ${85 - percentage}% للوصول للمكافأة`;
        rewardStatus.className = 'badge';
    }
}

// بدء التشغيل
renderTasks();
