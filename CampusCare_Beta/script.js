// =========================
// DOM ELEMENTS
// =========================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.querySelector('.search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const buttons = document.querySelectorAll('button');

// =========================
// HAMBURGER MENU TOGGLE
// =========================


/* =========================
   HAMBURGER MENU TOGGLE
========================= */

const navActions = navMenu?.parentElement.querySelector(
    ':scope > .flex.items-center.gap-3'
);

const mobileActionsItem = document.createElement('li');
mobileActionsItem.className = 'mobile-nav-actions';

function updateMobileNavbar() {
    if (!navMenu || !navActions || !hamburger) return;

    if (window.innerWidth <= 768) {
        // Pindahkan tombol yang sudah ada ke menu mobile
        if (navActions.parentElement !== mobileActionsItem) {
            mobileActionsItem.appendChild(navActions);
            navMenu.appendChild(mobileActionsItem);
        }
    } else {
        // Kembalikan tombol ke posisi desktop semula
        if (navActions.parentElement === mobileActionsItem) {
            navMenu.removeChild(mobileActionsItem);
            navMenu.parentElement.insertBefore(navActions, hamburger);
        }

        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

updateMobileNavbar();
window.addEventListener('resize', updateMobileNavbar);

// Tutup menu setelah link navigasi ditekan
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
    });
});

// =========================
// SMOOTH SCROLL
// =========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =========================
// SEARCH FUNCTIONALITY
// =========================

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        categoryCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'flex';
                card.classList.add('fade-in-up');
            } else {
                card.style.display = 'none';
            }
        });

        // Reset if search is empty
        if (searchTerm === '') {
            categoryCards.forEach(card => {
                card.style.display = 'flex';
            });
        }
    });
}

// =========================
// FILTER FUNCTIONALITY
// =========================

filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        const filterValue = e.target.textContent.trim();
        
        // For demo purposes, just show all cards
        // In a real app, this would filter based on status
        categoryCards.forEach(card => {
            card.style.display = 'flex';
            card.classList.add('fade-in-up');
        });
    });
});

// =========================
// BUTTON CLICK HANDLERS
// =========================

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;

        // Check if element already has position property
        if (window.getComputedStyle(this).position === 'static') {
            this.style.position = 'relative';
        }

        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());

        // Handle button actions
        if (this.textContent.includes('Buat Laporan') || 
            this.textContent.includes('Mulai Laporan') ||
            this.textContent.includes('Lapor Sekarang') ||
            this.textContent.includes('Buat Laporan Pertama')) {
            
            // Simulate navigation or modal
            console.log('Navigating to report form...');
            // In a real app, this would navigate to the report form
            openReportModal(this.closest('.category-card')?.querySelector('h3').textContent);
        }
        
        if (this.textContent.includes('Pelajari Lebih Lanjut')) {
            console.log('Opening details...');
            document.querySelector('#tentang').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// =========================
// NOTIFICATION SYSTEM
// =========================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #0066cc;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        font-weight: 500;
        z-index: 1000;
        animation: slideInUp 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// =========================
// INTERSECTION OBSERVER
// =========================

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function countUp(el) {
    const m = el.textContent.match(/^([\d.]+)(.*)$/);
    if (!m || m[2].startsWith('/') || reduceMotion) return;
    const end = parseFloat(m[1]), dec = (m[1].split('.')[1] || '').length, t0 = performance.now();
    const tick = (t) => {
        const p = Math.min((t - t0) / 1400, 1);
        el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec) + m[2];
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        if (entry.target.classList.contains('stat-card')) countUp(entry.target.querySelector('.stat-number'));
        observer.unobserve(entry.target);
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.category-card, .section-header, .stat-card, .step-card, .chart-card, .testi-card, .welcome-container').forEach(el => {
    el.classList.add('reveal');
    el.style.setProperty('--d', ([...el.parentElement.children].indexOf(el) % 3) * 90 + 'ms');
    observer.observe(el);
});

// =========================
// NAVBAR SCROLL EFFECT
// =========================

const navbar = document.querySelector('.navbar');
const progressBar = document.querySelector('.progress-bar');

// Highlight the nav link of the section currently in view
const spy = new IntersectionObserver((entries) => {
   entries.forEach(e => e.isIntersecting && navLinks.forEach(l =>
     l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id || l.hasAttribute('data-current')))); 
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

/*window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}, { passive: true });*/

const BUBBLE_OFFSET = 80; // jarak scroll (px) sebelum bubble muncul

function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    navbar?.classList.toggle('scrolled', window.scrollY > BUBBLE_OFFSET);
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // cek posisi awal

// =========================
// FORM VALIDATION (Future use)
// =========================

function validateForm(formData) {
    const { category, title, description, location } = formData;

    if (!category || category.trim() === '') {
        showNotification('Silakan pilih kategori');
        return false;
    }

    if (!title || title.trim() === '') {
        showNotification('Silakan masukkan judul laporan');
        return false;
    }

    if (!description || description.trim() === '') {
        showNotification('Silakan masukkan deskripsi masalah');
        return false;
    }

    if (!location || location.trim() === '') {
        showNotification('Silakan masukkan lokasi');
        return false;
    }

    return true;
}

// =========================
// API: AMBIL DATA LAPORAN (Pertemuan 4 - Task 1, 2, 3)
// =========================

const API_URL = 'http://localhost:3000/api/reports';   // "API" lokal berupa file JSON
const SIMULATE_DELAY_MS = 800;         // jeda buatan agar loading terlihat saat demo (isi 0 untuk mematikan)

let apiReports = [];
let apiState = 'loading';              // 'loading' | 'success' | 'error'

async function loadReports() {
    apiState = 'loading';
    renderReports();                   // Task 3: tampilkan loading

    try {
        if (SIMULATE_DELAY_MS) await new Promise(r => setTimeout(r, SIMULATE_DELAY_MS));
        const response = await fetch(API_URL);                  // Task 1: kirim request
        if (!response.ok) throw new Error('Gagal mengambil data');
        apiReports = await response.json();                     // JSON -> array of objects
        apiState = 'success';
    } catch (error) {
        console.error(error);                                   // Task 3: tangani error
        apiReports = [];
        apiState = 'error';
    }

    renderReports();                   // Task 2: tampilkan data ke DOM
    renderCharts();
}

// =========================
// LOCAL STORAGE
// =========================

function saveReport(reportData) {
    const reports = JSON.parse(localStorage.getItem('campuscare_reports')) || [];
    reports.push({
        ...reportData,
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'Menunggu'
    });
    localStorage.setItem('campuscare_reports', JSON.stringify(reports));
    return true;
}

function getReports() {
    return JSON.parse(localStorage.getItem('campuscare_reports')) || [];
}

// =========================
// KEYBOARD NAVIGATION
// =========================

document.addEventListener('keydown', (e) => {
    // ESC to close menu
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger?.classList.remove('active');
    }

    // Tab key for accessibility
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// =========================
// INITIALIZATION
// =========================

document.addEventListener('DOMContentLoaded', () => {
    console.log('CampusCare initialized');
    
    // Add fade-in animation to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('fade-in');
    }

});

// =========================
// CSS ANIMATIONS (Runtime)
// =========================

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes slideInUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(20px);
            opacity: 0;
        }
    }

    .keyboard-nav *:focus {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);

// =========================
// REPORT LIST, CHARTS & MODAL
// =========================

const STATUS = ['Menunggu', 'Diproses', 'Selesai'];
const reportList = document.getElementById('reportList');
const modal = document.getElementById('reportModal');
const reportForm = document.getElementById('reportForm');
let activeFilter = 'Semua';
let lastFocus = null;
let currentBase64Image = '';

const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const allReports = () => {
    const ov = getStatusOverrides();
    return [...getReports(), ...apiReports].map(r => ({ ...r, status: ov[r.id] || r.status }));
};

const reportImageInput = document.getElementById('reportImage');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');

if (reportImageInput) {
    reportImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showNotification('Ukuran foto terlalu besar (maksimal 2MB)');
                reportImageInput.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(evt) {
                currentBase64Image = evt.target.result;
                imagePreview.src = currentBase64Image;
                imagePreviewContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    removeImageBtn?.addEventListener('click', () => {
        resetImageUpload();
    });
}

function resetImageUpload() {
    currentBase64Image = '';
    if (reportImageInput) reportImageInput.value = '';
    if (imagePreview) imagePreview.src = '';
    imagePreviewContainer?.classList.add('hidden');
}

window.openLightbox = function(src) {
    let lb = document.getElementById('lightboxModal');
    if (!lb) {
        lb = document.createElement('div');
        lb.id = 'lightboxModal';
        lb.className = 'fixed inset-0 z-[500] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-pointer';
        lb.onclick = () => lb.classList.add('hidden');
        lb.innerHTML = `<img id="lightboxImg" class="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl">`;
        document.body.appendChild(lb);
    }
    document.getElementById('lightboxImg').src = src;
    lb.classList.remove('hidden');
};

function renderReports() {
    if (!reportList) return;

    if (apiState === 'loading') {
        reportList.innerHTML = '<p class="empty"><span class="spinner"></span>Mengambil data...</p>';
        return;
    }
    if (apiState === 'error') {
        reportList.innerHTML = `<div class="empty">
            <p><b>Gagal mengambil data</b></p>
            <p>Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>
            <button type="button" id="retryBtn" class="btn-secondary" style="margin-top:12px">Coba Lagi</button>
        </div>`;
        return;
    }

    const q = searchInput ? searchInput.value.toLowerCase() : '';
    const rows = allReports().filter(r =>
        (activeFilter === 'Semua' || r.status === activeFilter) &&
        `${r.title} ${r.category} ${r.location}`.toLowerCase().includes(q));
        
    reportList.innerHTML = rows.length
        ? rows.map(r => `<article class="report-item" style="display: flex; align-items: center; justify-content: space-between; gap: 14px;">
            <i class="dot ${r.status}"></i>
            ${r.image ? `<img src="${r.image}" alt="Bukti Foto" class="h-12 w-12 shrink-0 rounded-xl object-cover border border-solid border-[#e0e0e0] cursor-pointer transition hover:scale-105" onclick="openLightbox('${r.image}')" title="Klik untuk memperbesar foto">` : ''}
            <div style="flex: 1; min-width: 0;">
                <h4>${esc(r.title)}</h4>
                <p>${esc(r.category)} · ${esc(r.location)}</p>
            </div>
            ${statusControl(r)}
        </article>`).join('')
        : '<p class="empty">Belum ada laporan dengan filter ini. Coba status lain atau buat laporan baru.</p>';
}

function renderCharts() {
    // Elemen grafik (#donut, #donutLegend, #bars) tidak ada di halaman ini.
    // Tanpa pengecekan ini, error akan menghentikan seluruh script (termasuk tombol Masuk).
    if (!document.getElementById('donut')) return;
    const st = { Selesai: 86, Diproses: 24, Menunggu: 12 };
    const cat = { 'Listrik & Penerangan': 42, 'AC & Pendingin': 37, 'Jaringan Wi-Fi': 31, 'Fasilitas Air': 26, 'Ruang Kelas': 24 };
    allReports().forEach(r => { st[r.status]++; cat[r.category] = (cat[r.category] || 0) + 1; });
    const total = STATUS.reduce((a, s) => a + st[s], 0);
    let off = 25;
    document.getElementById('donut').innerHTML = STATUS.map(s => {
        const p = st[s] / total * 100;
        const c = `<circle class="seg ${s}" cx="21" cy="21" r="16" pathLength="100" stroke-dasharray="${p} ${100 - p}" stroke-dashoffset="${off}"/>`;
        off -= p;
        return c;
    }).join('') + `<text x="21" y="22.5" class="tot">${total}</text><text x="21" y="27" class="sub">laporan</text>`;
    document.getElementById('donutLegend').innerHTML = STATUS.map(s =>
        `<li><i class="dot ${s}"></i>${s}<b>${st[s]}</b></li>`).join('');
    const top = Object.entries(cat).sort((a, b) => b[1] - a[1]).slice(0, 5), max = top[0][1];
    document.getElementById('bars').innerHTML = top.map(([n, v]) =>
        `<div class="bar"><span>${esc(n)}</span><i style="--w:${v / max * 100}%"><b>${v}</b></i></div>`).join('');
}

function openReportModal(category) {
    if (!requireStudent()) return;
    lastFocus = document.activeElement;
    const sel = reportForm.elements.category;
    if (category && [...sel.options].some(o => o.value === category)) sel.value = category;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => reportForm.elements.title.focus(), 250);
}

function closeReportModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetImageUpload();
    lastFocus?.focus();
}

if (modal) {
    const CATEGORIES = ['Ruang Kelas','Listrik & Penerangan','Fasilitas Air','AC & Pendingin','Peralatan IT','Jaringan Wi-Fi','Pintu & Jendela','Struktur Bangunan','Kebersihan'];
    reportForm.elements.category.innerHTML = CATEGORIES.map(c => `<option>${esc(c)}</option>`).join('');

    modal.addEventListener('click', e => {
        if (e.target === modal || e.target.closest('.modal-close, .modal-cancel')) closeReportModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeReportModal();
    });

    reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(reportForm));
    if (!validateForm(data)) return;
    
    if (currentBase64Image) {
        data.image = currentBase64Image;
    }

    try {
        // Kirim request POST ke Backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Gagal menambah laporan');

        resetImageUpload();
        reportForm.reset();
        closeReportModal();
        activeFilter = 'Semua';
        filterButtons.forEach(b => b.classList.toggle('active', b.textContent.trim() === 'Semua'));
        
        // Reload data dari server
        await loadReports();
        showNotification('Laporan terkirim. Pantau statusnya di daftar laporan.');
    } catch (err) {
        console.error(err);
        showNotification('Gagal mengirim laporan ke server.');
    }
});

    filterButtons.forEach(b => b.addEventListener('click', () => { activeFilter = b.textContent.trim(); renderReports(); }));
    searchInput?.addEventListener('input', renderReports);

    // Cursor spotlight on cards
    document.querySelectorAll('.category-card, .testi-card').forEach(c => c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', e.clientX - r.left + 'px');
        c.style.setProperty('--my', e.clientY - r.top + 'px');
    }));

    renderReports();
    renderCharts();
}

// =========================
// EXPORT FUNCTIONS
// =========================

window.CampusCare = {
    saveReport,
    getReports,
    validateForm,
    showNotification
};


// =========================
// LOGIN MAHASISWA & ADMIN (demo, tanpa server)
// =========================
// Catatan: akun ada di file ini hanya untuk demo tugas. Aplikasi sungguhan
// wajib memverifikasi login di server (kata sandi tidak boleh ada di JavaScript).

const USERS = [
    { username: '2024001', password: 'mahasiswa123', role: 'mahasiswa', name: 'Mahasiswa Demo' },
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin Sarpras' }
];
const ROLE_INFO = {
    mahasiswa: { label: 'NIM', hint: 'Akun demo: NIM 2024001, kata sandi mahasiswa123' },
    admin: { label: 'Username', hint: 'Akun demo: username admin, kata sandi admin123' }
};

var currentUser = null; // var: dipakai renderReports() yang berjalan lebih awal
try { currentUser = JSON.parse(localStorage.getItem('campuscare_session')); } catch (e) { currentUser = null; }
let loginRole = 'mahasiswa';

const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

function isAdmin() { return !!currentUser && currentUser.role === 'admin'; }

function getStatusOverrides() {
    try { return JSON.parse(localStorage.getItem('campuscare_status')) || {}; } catch (e) { return {}; }
}

function statusControl(r) {
  if (!isAdmin()) return `<span class="status ${r.status}" style="margin-left: auto;">${r.status}</span>`;
  
  const opts = STATUS.map(s => `<option${s === r.status ? ' selected' : ''}>${s}</option>`).join('');
  
  return `
    <div style="margin-left: auto; display: flex; align-items: center; gap: 8px;">
      <select data-id="${r.id}" aria-label="Ubah status laporan" class="rounded-full border border-solid border-[#e0e0e0] bg-white px-3 py-1 text-xs font-semibold text-ink outline-none focus:border-brand">
        ${opts}
      </select>
      <button type="button" onclick="deleteReportFromWeb(${r.id})" class="rounded-full bg-red-100 text-red-600 px-3 py-1 text-xs font-semibold hover:bg-red-600 hover:text-white transition">
        Hapus
      </button>
    </div>
  `;
}

function setLoginRole(role) {
    loginRole = role;
    document.querySelectorAll('.role-tab').forEach(t => {
        const on = t.dataset.role === role;
        t.classList.toggle('bg-white', on);
        t.classList.toggle('text-brand', on);
        t.classList.toggle('shadow-sm', on);
        t.classList.toggle('text-[#5b6b86]', !on);
    });
    document.getElementById('idLabel').textContent = ROLE_INFO[role].label;
    document.getElementById('loginHint').textContent = ROLE_INFO[role].hint;
    loginError.classList.add('hidden');
}

function openLogin() {
    setLoginRole(loginRole);
    loginModal.classList.replace('hidden', 'flex');
    loginModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => loginForm.elements.username.focus(), 50);
}

function closeLogin() {
    loginModal.classList.replace('flex', 'hidden');
    loginModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function updateAuthUI() {
    const on = !!currentUser;
    const chip = document.getElementById('userChip');
    document.getElementById('loginBtn').classList.toggle('hidden', on);
    chip.classList.toggle('hidden', !on);
    chip.classList.toggle('flex', on);
    if (on) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = isAdmin() ? 'Admin' : 'Mahasiswa';
    }
    if (reportList) { renderReports(); renderCharts(); }
}

function requireStudent() {
    if (!currentUser) {
        showNotification('Masuk sebagai mahasiswa dulu untuk membuat laporan.');
        openLogin();
        return false;
    }
    if (isAdmin()) {
        showNotification('Admin mengubah status laporan lewat daftar laporan.');
        return false;
    }
    return true;
}

if (loginModal) {
    document.getElementById('loginBtn').addEventListener('click', openLogin);
    document.getElementById('loginClose').addEventListener('click', closeLogin);
    loginModal.addEventListener('click', e => { if (e.target === loginModal) closeLogin(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !loginModal.classList.contains('hidden')) closeLogin();
    });
    document.querySelectorAll('.role-tab').forEach(t => t.addEventListener('click', () => setLoginRole(t.dataset.role)));

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const { username = '', password = '' } = Object.fromEntries(new FormData(loginForm));
        const user = USERS.find(u => u.role === loginRole && u.username === username.trim() && u.password === password);
        if (!user) {
            loginError.textContent = 'Akun atau kata sandi salah. Periksa lagi, lalu coba masuk.';
            loginError.classList.remove('hidden');
            return;
        }
        currentUser = { username: user.username, name: user.name, role: user.role };
        localStorage.setItem('campuscare_session', JSON.stringify(currentUser));
        loginForm.reset();
        closeLogin();
        updateAuthUI();
        showNotification('Masuk sebagai ' + user.name);
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('campuscare_session');
        updateAuthUI();
        showNotification('Kamu sudah keluar.');
    });

    // Admin: ubah status laporan via HTTP PUT
reportList?.addEventListener('change', async (e) => {
    const sel = e.target.closest('select[data-id]');
    if (!sel || !isAdmin()) return;

    const reportId = sel.dataset.id;
    const newStatus = sel.value;

    try {
        const response = await fetch(`${API_URL}/${reportId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Gagal memperbarui status');

        await loadReports();
        showNotification('Status laporan berhasil diperbarui.');
    } catch (err) {
        console.error(err);
        showNotification('Gagal memperbarui status ke server.');
    }
});

// Admin: hapus laporan via HTTP DELETE
window.deleteReportFromWeb = async function(id) {
    if (!isAdmin()) return;
    if (!confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Gagal menghapus laporan');

        await loadReports();
        showNotification('Laporan berhasil dihapus.');
    } catch (err) {
        console.error(err);
        showNotification('Gagal menghapus laporan dari server.');
    }
};

    // =========================
// WHY SHOWCASE (Mengapa Memilih CampusCare)
// =========================
(function () {
    const root = document.querySelector('[data-why]');
    if (!root) return;

    const cards  = [...root.querySelectorAll('[data-why-card]')];
    const slides = [...root.querySelectorAll('[data-why-slide]')];
    const dots   = [...root.querySelectorAll('[data-why-dot]')];

    const DELAY = 5500; // jeda ganti otomatis (ms)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0, timer = null, locked = false;

    function show(n) {
        index = n;
        cards.forEach((c, k) => {
            c.dataset.active = k === n;
            c.querySelector('button').setAttribute('aria-expanded', k === n);
        });
        slides.forEach((s, k) => {
            s.dataset.active = k === n;
            s.setAttribute('aria-hidden', k !== n);
        });
        dots.forEach((d, k) => { d.dataset.active = k === n; });
    }

    function stop() { clearInterval(timer); timer = null; }
    function start() {
        if (reduce || locked || timer) return;
        timer = setInterval(() => show((index + 1) % cards.length), DELAY);
    }

    // klik manual = berhenti autoplay
    function pick(k) { locked = true; stop(); show(k); }
    cards.forEach((c, k) => c.querySelector('button').addEventListener('click', () => pick(k)));
    dots.forEach((d, k) => d.addEventListener('click', () => pick(k)));

    // jeda saat hover / fokus
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    // hanya jalan saat terlihat di layar
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.3 }).observe(root);

    show(0);
})();

    updateAuthUI();
}

// =========================
// START: AMBIL DATA DARI API + TOMBOL "COBA LAGI"
// =========================

reportList?.addEventListener('click', e => {
    if (reportList) loadReports();
});

loadReports();

// =========================
// MEGA MENU + PAGE WIPE TRANSITION (antar halaman & dalam halaman)
// =========================
(function () {
    const items = document.querySelectorAll('.has-mega');
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = () => window.innerWidth <= 768;
    const closeAll = () => items.forEach(i => i.classList.remove('open'));
    const norm = p => p.replace(/index\.html$/, '');

    /* ---------- buka/tutup menu di mobile ---------- */
    items.forEach(item => {
        const trigger = item.querySelector(':scope > .nav-link');
        trigger.addEventListener('click', e => {
            if (!isMobile()) return;          // desktop: pakai transisi di bawah
            e.preventDefault();
            e.stopImmediatePropagation();     // jangan tutup hamburger
            const wasOpen = item.classList.contains('open');
            closeAll();
            item.classList.toggle('open', !wasOpen);
        }, true);
        item.addEventListener('mouseleave', () => item.classList.remove('suppress'));
    });
    document.addEventListener('click', e => { if (!e.target.closest('.has-mega')) closeAll(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
    window.addEventListener('resize', closeAll);

    /* ---------- overlay kolom warna ---------- */
    const COLORS = ['#fffbfd', '#5798f9', '#1400ee', '#5798f9', '#fffbfd'];
    const DURATION = [520, 440, 580, 480, 540];
    const STAGGER = 60;
    const EASE = 'cubic-bezier(.76,0,.24,1)';

    const wipe = document.createElement('div');
    wipe.className = 'wipe';
    wipe.setAttribute('aria-hidden', 'true');
   const cols = COLORS.map((c, i) => {
    const d = document.createElement('div');
    d.className = 'wipe-col';
    d.style.background = c;
    // posisi absolut + sedikit overlap supaya tidak ada celah
    d.style.position = 'absolute';
    d.style.top = '0';
    d.style.bottom = '0';
    d.style.left = `calc(${i * 20}% - 1px)`;
    d.style.width = 'calc(20% + 2px)';
    d.style.willChange = 'transform';
    wipe.appendChild(d);
    return d;
});
    // logo di tengah layar saat kolom menutup halaman
    const logo = document.createElement('div');
    logo.className = 'wipe-logo';
    logo.innerHTML = '<div class="tile"><img src="img/campuscare-logo.png" alt=""></div><span>CampusCare</span>';
    wipe.appendChild(logo);

    document.body.appendChild(wipe);

    const play = (from, to) => Promise.all(cols.map((el, i) =>
        el.animate(
            [{ transform: `scaleY(${from})` }, { transform: `scaleY(${to})` }],
            { duration: DURATION[i], delay: i * STAGGER, easing: EASE, fill: 'both' }
        ).finished
    ));
    const wait = ms => new Promise(r => setTimeout(r, ms));

    const logoIn = () => logo.animate(
        [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' }
    ).finished;
    const logoOut = () => logo.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.9)' }],
        { duration: 220, easing: 'ease-in', fill: 'forwards' }
    ).finished;

    // buka kartu "Tentang CampusCare" (kartu ke-4) saat tujuannya section #tentang
    const openAbout = el => {
        if (el && el.id === 'tentang') document.querySelector('[data-why-card]:nth-child(4) button')?.click();
    };

    let busy = false;

    function resetWipe() {
        cols.forEach(c => { c.getAnimations().forEach(a => a.cancel()); c.style.transform = ''; });
        logo.getAnimations().forEach(a => a.cancel());
        logo.style.opacity = '';
        wipe.classList.remove('on');
        document.documentElement.classList.remove('wipe-pending');
        busy = false;
    }

    /* scroll dalam halaman yang sama */
    async function goTo(el) {
        if (reduce) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); openAbout(el); return; }
        busy = true;
        cols.forEach(c => c.style.transformOrigin = 'top');
        wipe.classList.add('on');

        await play(0, 1);                                            // kolom turun menutup layar
        el.scrollIntoView({ behavior: 'instant', block: 'start' });  // pindah diam-diam
        openAbout(el);                                               // buka kartu Tentang bila perlu
        await logoIn();                                              // logo muncul di tengah
        await wait(250);

        cols.forEach(c => c.style.transformOrigin = 'bottom');
        logoOut();
        await play(1, 0);                                            // kolom jatuh ke bawah

        resetWipe();
        el.classList.add('flash-target');
        setTimeout(() => el.classList.remove('flash-target'), 1800);
    }

    /* pindah ke halaman lain: tutup layar dulu, lalu buka halaman */
    async function leaveTo(href) {
        if (reduce) { location.href = href; return; }
        busy = true;
        cols.forEach(c => c.style.transformOrigin = 'top');
        wipe.classList.add('on');
        await play(0, 1);
        await logoIn();                                              // logo muncul sebelum pindah halaman
        await wait(150);
        sessionStorage.setItem('ccWipe', '1');
        location.href = href;
    }

    /* baru tiba dari halaman lain: layar tertutup, lalu kolom jatuh membuka */
    async function arrive() {
        sessionStorage.removeItem('ccWipe');
        if (reduce) { document.documentElement.classList.remove('wipe-pending'); return; }
        busy = true;
        cols.forEach(c => { c.style.transformOrigin = 'bottom'; c.style.transform = 'scaleY(1)'; });
        wipe.classList.add('on');
        logo.style.opacity = '1';                                    // logo langsung terlihat di tengah
        document.documentElement.classList.remove('wipe-pending');   // halaman tersembunyi di balik kolom
        if (location.hash) {
            const t = document.querySelector(location.hash);
            t?.scrollIntoView({ behavior: 'instant', block: 'start' });
            openAbout(t);
        }
        await wait(450);
        logoOut();
        await play(1, 0);
        resetWipe();
        if (location.hash) {
            const el = document.querySelector(location.hash);
            el?.classList.add('flash-target');
            setTimeout(() => el?.classList.remove('flash-target'), 1800);
        }
    }

    if (sessionStorage.getItem('ccWipe')) arrive();

    // tombol Back (bfcache): jangan biarkan kolom menutupi halaman
    window.addEventListener('pageshow', e => { if (e.persisted) { sessionStorage.removeItem('ccWipe'); resetWipe(); } });

    /* ---------- klik semua link navbar + item mega menu ---------- */
    document.addEventListener('click', e => {
        const a = e.target.closest('.mega a, .nav-menu a.nav-link, a.brand');
        if (!a) return;

        // mobile: teks menu yang punya panel hanya buka/tutup panel
        if (a.matches('.nav-link') && a.parentElement.classList.contains('has-mega') && isMobile()) return;

        const href = a.getAttribute('href');
        if (!href || href === '#' && a.dataset.action !== 'report') return;

        e.preventDefault();
        e.stopPropagation();                                // cegah smooth-scroll bawaan script.js
        if (busy) return;

        closeAll();
        a.closest('.has-mega')?.classList.add('suppress');
        a.blur();
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');

        if (a.dataset.action === 'report') {                // tombol "Mulai Lapor"
            if (typeof openReportModal === 'function') openReportModal();
            return;
        }

        const url = new URL(href, location.href);
        if (norm(url.pathname) !== norm(location.pathname)) { leaveTo(url.href); return; }  // halaman lain

        const target = url.hash ? document.querySelector(url.hash) : null;                  // halaman ini
        if (target) goTo(target);
    }, true);
})();