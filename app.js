/* ============================================================
   FinanceTrack — Dashboard App JS
   ============================================================ */

'use strict';

/* -------------------- THEME -------------------- */
function toggleTheme() {
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const isDark = html.getAttribute('data-theme') === 'dark';
  if (isDark) {
    html.setAttribute('data-theme', 'light');
    toggle.classList.remove('active');
  } else {
    html.setAttribute('data-theme', 'dark');
    toggle.classList.add('active');
  }
  // Re-render charts with updated colors
  setTimeout(updateChartColors, 50);
}

/* -------------------- SIDEBAR -------------------- */
let sidebarCollapsed = false;

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const body = document.body;
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebarCollapsed = !sidebarCollapsed;
    if (sidebarCollapsed) {
      sidebar.classList.add('collapsed');
      body.classList.add('sidebar-collapsed');
    } else {
      sidebar.classList.remove('collapsed');
      body.classList.remove('sidebar-collapsed');
    }
  }
}

/* -------------------- NAV ACTIVE -------------------- */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#' || href.startsWith('javascript:')) {
      e.preventDefault();
    }
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

/* -------------------- PROJECT SWITCHER -------------------- */
const projectSwitcher = document.getElementById('projectSwitcher');
if (projectSwitcher) {
  projectSwitcher.addEventListener('click', () => {
    projectSwitcher.classList.toggle('open');
  });

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      document.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      projectSwitcher.querySelector('span').textContent = this.textContent;
      projectSwitcher.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!projectSwitcher.contains(e.target)) {
      projectSwitcher.classList.remove('open');
    }
  });
}

/* -------------------- MODAL -------------------- */
function openModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Set today's date
  const dateInput = document.getElementById('fTanggal');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  setTimeout(() => document.getElementById('fKategori')?.focus(), 100);
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOverlay(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    closeModal();
  }
}

/* -------------------- MODAL TYPE TOGGLE -------------------- */
let currentType = 'expense';

function setType(type) {
  currentType = type;
  const expBtn = document.getElementById('expenseBtn');
  const incBtn = document.getElementById('incomeBtn');
  if (type === 'expense') {
    expBtn.classList.add('active');
    incBtn.classList.remove('active');
    expBtn.setAttribute('aria-pressed', 'true');
    incBtn.setAttribute('aria-pressed', 'false');
  } else {
    incBtn.classList.add('active');
    expBtn.classList.remove('active');
    incBtn.setAttribute('aria-pressed', 'true');
    expBtn.setAttribute('aria-pressed', 'false');
  }
}

/* -------------------- RUPIAH FORMAT -------------------- */
function formatRupiah(input) {
  let val = input.value.replace(/[^0-9]/g, '');
  if (!val) { input.value = ''; return; }
  const num = parseInt(val, 10);
  input.value = num.toLocaleString('id-ID');
}

/* -------------------- FORM SUBMIT -------------------- */
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Menyimpan...';

  setTimeout(() => {
    closeModal();
    showToast('success', '✅ Transaksi berhasil disimpan!');
    document.getElementById('txForm').reset();
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Simpan Transaksi`;
  }, 800);
}

/* -------------------- TOAST -------------------- */
function showToast(type, message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* -------------------- KEYBOARD SHORTCUTS -------------------- */
document.addEventListener('keydown', (e) => {
  // Ctrl+K — focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
  // Ctrl+N — open modal
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    openModal();
  }
  // Escape — close modal
  if (e.key === 'Escape') {
    closeModal();
  }
});

function openSearch() {
  // Highlight the search bar visually
  const searchBar = document.getElementById('globalSearchBar');
  searchBar.style.borderColor = 'var(--primary)';
  searchBar.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
  setTimeout(() => {
    searchBar.style.borderColor = '';
    searchBar.style.boxShadow = '';
  }, 1500);
  showToast('info', 'Ketik untuk mencari transaksi, kategori, atau project...');
}

/* -------------------- UPLOAD ZONE -------------------- */
const uploadZone = document.getElementById('uploadZone');
if (uploadZone) {
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--primary)';
    uploadZone.style.background = 'rgba(99,102,241,0.06)';
  });
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = '';
    uploadZone.style.background = '';
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = '';
    uploadZone.style.background = '';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileName = files[0].name;
      uploadZone.querySelector('span').textContent = `📎 ${fileName}`;
      showToast('success', `File "${fileName}" berhasil dilampirkan.`);
    }
  });
}

/* ============================================================
   CHARTS
   ============================================================ */

function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    gridColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    tickColor: isDark ? '#64748B' : '#9CA3AF',
    tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
    tooltipBorder: isDark ? '#293548' : '#E5E7EB',
    tooltipText: isDark ? '#F8FAFC' : '#111827',
  };
}

const chartDefaults = () => {
  const c = getChartColors();
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = c.tickColor;
  Chart.defaults.plugins.tooltip.backgroundColor = c.tooltipBg;
  Chart.defaults.plugins.tooltip.borderColor = c.tooltipBorder;
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.titleColor = c.tooltipText;
  Chart.defaults.plugins.tooltip.bodyColor = c.tooltipText;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 10;
  Chart.defaults.plugins.legend.display = false;
};

/* ---------- CASH FLOW CHART ---------- */
const cashFlowData = {
  mingguan: {
    labels: ['01 Jun', '08 Jun', '15 Jun', '22 Jun', '29 Jun', '05 Jul'],
    income:  [38000, 42000, 35000, 48000, 45000, 38000],
    expense: [22000, 28000, 24000, 32000, 30000, 25000],
    balance: [16000, 14000, 11000, 16000, 15000, 13000],
  },
  harian: {
    labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'],
    income:  [5200, 4800, 6100, 4300, 7200, 5500, 3900, 6800, 5100, 4600, 7800, 4200, 5900, 6300],
    expense: [3100, 2900, 3800, 2700, 4500, 3400, 2400, 4200, 3200, 2800, 4800, 2600, 3700, 3900],
    balance: [2100, 1900, 2300, 1600, 2700, 2100, 1500, 2600, 1900, 1800, 3000, 1600, 2200, 2400],
  },
  bulanan: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
    income:  [180000, 195000, 210000, 188000, 225000, 240000, 245750],
    expense: [120000, 135000, 142000, 128000, 155000, 168000, 178320],
    balance: [60000, 60000, 68000, 60000, 70000, 72000, 67430],
  },
};

let cashFlowChart;
function initCashFlowChart(period = 'mingguan') {
  const ctx = document.getElementById('cashFlowChart');
  if (!ctx) return;
  const c = getChartColors();
  const d = cashFlowData[period];

  const config = {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'Pemasukan',
          data: d.income,
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34,197,94,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#22C55E',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Pengeluaran',
          data: d.expense,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239,68,68,0.06)',
          borderWidth: 2.5,
          pointBackgroundColor: '#EF4444',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Saldo Bersih',
          data: d.balance,
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99,102,241,0.06)',
          borderWidth: 2,
          pointBackgroundColor: '#6366F1',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
          borderDash: [6, 3],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `  ${ctx.dataset.label}: Rp ${ctx.parsed.y.toLocaleString('id-ID')}rb`,
          }
        },
      },
      scales: {
        x: {
          grid: { color: c.gridColor, drawBorder: false },
          ticks: { color: c.tickColor, maxRotation: 0 },
        },
        y: {
          grid: { color: c.gridColor, drawBorder: false },
          ticks: {
            color: c.tickColor,
            callback: v => `Rp ${v.toLocaleString('id-ID')}rb`,
          },
        },
      },
    },
  };

  if (cashFlowChart) { cashFlowChart.destroy(); }
  cashFlowChart = new Chart(ctx, config);
}

function setCashFlowPeriod(period, btn) {
  document.querySelectorAll('#cashFlowPeriod .period-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  initCashFlowChart(period);
}

/* ---------- DONUT CHART ---------- */
let donutChart;
function initDonutChart() {
  const ctx = document.getElementById('donutChart');
  if (!ctx) return;

  const config = {
    type: 'doughnut',
    data: {
      labels: ['Operasional', 'Marketing', 'Gaji & Upah', 'Sewa & Listrik', 'Transportasi', 'Lainnya'],
      datasets: [{
        data: [64250, 38450, 32000, 18750, 12300, 12570],
        backgroundColor: ['#22C55E', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#94A3B8'],
        borderWidth: 0,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `  ${ctx.label}: Rp ${ctx.parsed.toLocaleString('id-ID')}`,
          }
        },
      },
    },
  };

  if (donutChart) { donutChart.destroy(); }
  donutChart = new Chart(ctx, config);
}

/* ---------- MONTHLY CHART ---------- */
let monthlyChart;
function initMonthlyChart() {
  const ctx = document.getElementById('monthlyChart');
  if (!ctx) return;
  const c = getChartColors();

  const config = {
    type: 'bar',
    data: {
      labels: ['Feb 2026', 'Mar 2026', 'Apr 2026', 'Mei 2026', 'Jun 2026', 'Jul 2026'],
      datasets: [
        {
          label: 'Pemasukan',
          data: [195000, 210000, 188000, 225000, 240000, 245750],
          backgroundColor: 'rgba(34,197,94,0.75)',
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Pengeluaran',
          data: [135000, 142000, 128000, 155000, 168000, 178320],
          backgroundColor: 'rgba(239,68,68,0.65)',
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.tickColor } },
        y: {
          grid: { color: c.gridColor, drawBorder: false },
          ticks: { color: c.tickColor, callback: v => `${(v/1000).toFixed(0)}jt` },
        },
      },
    },
  };

  if (monthlyChart) { monthlyChart.destroy(); }
  monthlyChart = new Chart(ctx, config);
}

/* ---------- PROJECT CHART ---------- */
let projectChart;
function initProjectChart() {
  const ctx = document.getElementById('projectChart');
  if (!ctx) return;
  const c = getChartColors();

  const config = {
    type: 'bar',
    data: {
      labels: ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta', 'Project Epsilon'],
      datasets: [
        {
          label: 'Pemasukan',
          data: [85000, 62000, 45000, 38000, 15750],
          backgroundColor: 'rgba(34,197,94,0.75)',
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Pengeluaran',
          data: [58000, 42000, 35000, 28000, 15320],
          backgroundColor: 'rgba(239,68,68,0.65)',
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.tickColor } },
        y: {
          grid: { color: c.gridColor, drawBorder: false },
          ticks: { color: c.tickColor, callback: v => `${(v/1000).toFixed(0)}jt` },
        },
      },
    },
  };

  if (projectChart) { projectChart.destroy(); }
  projectChart = new Chart(ctx, config);
}

/* ---------- UPDATE ALL CHARTS COLORS ---------- */
function updateChartColors() {
  chartDefaults();
  initCashFlowChart(
    document.querySelector('#cashFlowPeriod .period-tab.active')?.textContent?.toLowerCase().trim() || 'mingguan'
  );
  initDonutChart();
  initMonthlyChart();
  initProjectChart();
}

/* -------------------- TABLE SEARCH -------------------- */
document.getElementById('txSearch')?.addEventListener('input', function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll('#txTableBody tr').forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
});

/* -------------------- INIT -------------------- */
function init() {
  chartDefaults();
  initCashFlowChart('mingguan');
  initDonutChart();
  initMonthlyChart();
  initProjectChart();

  // Animate stat cards on load
  const cards = document.querySelectorAll('.stat-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 80 * i);
  });

  // Animate chart cards
  const chartCards = document.querySelectorAll('.chart-card');
  chartCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200 + 100 * i);
  });

  // FAB click on nav "Tambah Transaksi"
  document.getElementById('nav-tambah')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
}

document.addEventListener('DOMContentLoaded', init);
