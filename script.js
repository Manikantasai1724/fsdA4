/* ============================================================
   Smart Classroom & Timetable Scheduler — script.js
   ============================================================ */

// ── Data Store ─────────────────────────────────────────────
const DATA = {
  subjects: [
    { code: 'CS301', name: 'Data Structures & Algorithms', faculty: 'Dr. Arjun Mehta', credits: 4, colorIdx: 0 },
    { code: 'CS302', name: 'Database Management Systems', faculty: 'Prof. Sunita Rao', credits: 3, colorIdx: 1 },
    { code: 'CS303', name: 'Operating Systems', faculty: 'Dr. Vikram Nair', credits: 4, colorIdx: 2 },
    { code: 'CS304', name: 'Computer Networks', faculty: 'Dr. Priya Sharma', credits: 3, colorIdx: 3 },
    { code: 'CS305', name: 'Software Engineering', faculty: 'Prof. Rajan Pillai', credits: 3, colorIdx: 4 },
    { code: 'MA301', name: 'Discrete Mathematics', faculty: 'Dr. Kavitha Iyer', credits: 3, colorIdx: 5 },
    { code: 'CS306', name: 'Theory of Computation', faculty: 'Dr. Sanjay Gupta', credits: 3, colorIdx: 6 },
    { code: 'CS307', name: 'Machine Learning', faculty: 'Dr. Arjun Mehta', credits: 4, colorIdx: 7 },
  ],

  faculty: [
    { id: 1, name: 'Dr. Arjun Mehta', dept: 'Computer Science', subjects: ['CS301', 'CS307'], load: 8, email: 'arjun.mehta@scst.edu', status: 'Active', joined: '2018', colorIdx: 0 },
    { id: 2, name: 'Prof. Sunita Rao', dept: 'Computer Science', subjects: ['CS302'], load: 3, email: 'sunita.rao@scst.edu', status: 'Active', joined: '2016', colorIdx: 1 },
    { id: 3, name: 'Dr. Vikram Nair', dept: 'Systems', subjects: ['CS303'], load: 4, email: 'vikram.nair@scst.edu', status: 'Active', joined: '2020', colorIdx: 2 },
    { id: 4, name: 'Dr. Priya Sharma', dept: 'Networks', subjects: ['CS304'], load: 3, email: 'priya.sharma@scst.edu', status: 'Active', joined: '2019', colorIdx: 3 },
    { id: 5, name: 'Prof. Rajan Pillai', dept: 'Software Eng.', subjects: ['CS305'], load: 3, email: 'rajan.pillai@scst.edu', status: 'On Leave', joined: '2015', colorIdx: 4 },
    { id: 6, name: 'Dr. Kavitha Iyer', dept: 'Mathematics', subjects: ['MA301'], load: 3, email: 'kavitha.iyer@scst.edu', status: 'Active', joined: '2017', colorIdx: 5 },
    { id: 7, name: 'Dr. Sanjay Gupta', dept: 'Computer Science', subjects: ['CS306'], load: 3, email: 'sanjay.gupta@scst.edu', status: 'Active', joined: '2021', colorIdx: 6 },
  ],

  classrooms: [
    { id: 'CR-101', type: 'Lecture Hall', capacity: 120, floor: 1, ac: true, projector: true, status: 'Available', occupancy: 78 },
    { id: 'CR-102', type: 'Lecture Hall', capacity: 90, floor: 1, ac: true, projector: true, status: 'Occupied', occupancy: 100 },
    { id: 'CR-201', type: 'Seminar Room', capacity: 60, floor: 2, ac: true, projector: true, status: 'Available', occupancy: 45 },
    { id: 'CR-202', type: 'Seminar Room', capacity: 60, floor: 2, ac: false, projector: true, status: 'Available', occupancy: 0 },
    { id: 'LAB-01', type: 'Computer Lab', capacity: 40, floor: 1, ac: true, projector: false, status: 'Occupied', occupancy: 100 },
    { id: 'LAB-02', type: 'Computer Lab', capacity: 40, floor: 2, ac: true, projector: false, status: 'Available', occupancy: 25 },
    { id: 'CR-301', type: 'Lecture Hall', capacity: 80, floor: 3, ac: true, projector: true, status: 'Maintenance', occupancy: 0 },
    { id: 'LAB-03', type: 'Research Lab', capacity: 20, floor: 3, ac: true, projector: true, status: 'Available', occupancy: 60 },
    { id: 'AUD-01', type: 'Auditorium', capacity: 300, floor: 0, ac: true, projector: true, status: 'Available', occupancy: 30 },
  ],

  timeSlots: ['9:00–9:55', '10:00–10:55', '11:00–11:55', '12:00–12:55', '1:00–1:55', '2:00–2:55', '3:00–3:55', '4:00–4:55'],
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  breakSlots: [3], // index 3 = 12:00–12:55 is lunch
};

const AVATAR_COLORS = [
  ['#3d8ef8','#1a3d6b'], ['#7c5cf6','#3a1f6b'], ['#00d4a8','#006b55'],
  ['#f5a623','#6b4500'], ['#f5476a','#6b1a2a'], ['#e879f9','#6b1a6b'],
  ['#22d3ee','#0a4f5a'], ['#a3e635','#3a5a0a'],
];

// ── Utility Functions ───────────────────────────────────────
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

function showToast(message, type = 'info', icon = '') {
  const container = $('#toast-container') || createToastContainer();
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size:1.1rem">${icon || icons[type]}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3100);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.id = 'toast-container';
  document.body.appendChild(c);
  return c;
}

function showLoader(text = 'Generating...') {
  const existing = $('#main-loader');
  if (existing) return;
  const overlay = document.createElement('div');
  overlay.id = 'main-loader';
  overlay.className = 'loader-overlay';
  overlay.innerHTML = `
    <div class="loader-ring"></div>
    <div class="loader-text">${text}</div>
  `;
  document.body.appendChild(overlay);
}

function hideLoader() {
  const el = $('#main-loader');
  if (el) el.remove();
}

function getInitials(name) {
  return name.split(' ').filter(n => n).slice(0,2).map(n => n[0]).join('').toUpperCase();
}

function getAvatarStyle(idx) {
  const [bg, text] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return `background:${bg}22; color:${bg}; border: 1.5px solid ${bg}44;`;
}

function getSubjectColor(idx) {
  const colors = ['#3d8ef8','#7c5cf6','#00d4a8','#f5a623','#f5476a','#e879f9','#22d3ee','#a3e635'];
  return colors[idx % colors.length];
}

function highlightText(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark style="background:rgba(61,142,248,0.3);color:inherit;border-radius:2px;padding:0 2px">$1</mark>');
}

// ── Navbar ──────────────────────────────────────────────────
function initNavbar() {
  const hamburger = $('.hamburger');
  const mobileMenu = $('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });

  // Mark active link
  const current = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === current || a.getAttribute('href') === './' + current) {
      a.classList.add('active');
    }
  });
}

// ── Theme Toggle ────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeUI(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeUI(next);
  showToast(`Switched to ${next} mode`, 'info', next === 'dark' ? '🌙' : '☀️');
}

function updateThemeUI(theme) {
  const btn = $('#theme-toggle-btn');
  if (btn) btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';

  // Settings page toggle
  const settingsToggle = $('#settings-theme-toggle');
  if (settingsToggle) settingsToggle.checked = theme === 'light';
}

// ── Timetable Generator ─────────────────────────────────────
let generatedTimetable = null;

function generateTimetable() {
  const container = $('#timetable-output');
  if (!container) return;

  showLoader('🗓 Generating conflict-free timetable…');

  setTimeout(() => {
    const schedule = buildSchedule();
    generatedTimetable = schedule;
    renderTimetable(schedule, container);
    hideLoader();
    updateTTStats(schedule);
    showToast('Timetable generated successfully!', 'success');
  }, 1800);
}

function buildSchedule() {
  // schedule[day][slot] = { subject, faculty, room } | null
  const schedule = DATA.days.map(() => DATA.timeSlots.map(() => null));
  const facultySlots = {}; // facultyId -> Set of "day-slot" strings
  const roomSlots = {};    // roomId -> Set of "day-slot" strings

  DATA.faculty.forEach(f => { facultySlots[f.id] = new Set(); });
  DATA.classrooms
    .filter(r => r.status === 'Available' || r.status === 'Occupied')
    .forEach(r => { roomSlots[r.id] = new Set(); });

  const availableRooms = DATA.classrooms.filter(r => r.status === 'Available');

  // Shuffle days for variety each generation
  const subjectQueue = [...DATA.subjects];
  shuffleArray(subjectQueue);

  subjectQueue.forEach(sub => {
    const facultyObj = DATA.faculty.find(f => f.name === sub.faculty);
    const slotCount = sub.credits; // assign credits-many slots per week

    let assigned = 0;
    for (let dayIdx = 0; dayIdx < DATA.days.length && assigned < slotCount; dayIdx++) {
      for (let slotIdx = 0; slotIdx < DATA.timeSlots.length && assigned < slotCount; slotIdx++) {
        if (DATA.breakSlots.includes(slotIdx)) continue; // skip lunch
        const key = `${dayIdx}-${slotIdx}`;

        // Check faculty conflict
        if (facultyObj && facultySlots[facultyObj.id].has(key)) continue;
        // Slot already taken
        if (schedule[dayIdx][slotIdx] !== null) continue;

        // Find available room
        const room = availableRooms.find(r => !roomSlots[r.id]?.has(key));
        if (!room && availableRooms.length > 0) continue;

        // Assign
        if (facultyObj) facultySlots[facultyObj.id].add(key);
        if (room) {
          if (!roomSlots[room.id]) roomSlots[room.id] = new Set();
          roomSlots[room.id].add(key);
        }

        schedule[dayIdx][slotIdx] = {
          subject: sub,
          room: room ? room.id : 'TBD',
        };
        assigned++;
      }
    }
  });

  return schedule;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function renderTimetable(schedule, container) {
  let html = `
    <div class="timetable-wrapper fade-in">
      <table class="timetable">
        <thead>
          <tr>
            <th>Time / Day</th>
            ${DATA.days.map(d => `<th class="day-header">${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  DATA.timeSlots.forEach((slot, slotIdx) => {
    const isBreak = DATA.breakSlots.includes(slotIdx);
    html += `<tr>
      <th style="font-size:0.78rem;color:var(--text-muted);white-space:nowrap">${slot}</th>
    `;

    DATA.days.forEach((_, dayIdx) => {
      if (isBreak) {
        html += `<td class="break-cell">🍽 Lunch Break</td>`;
        return;
      }
      const cell = schedule[dayIdx][slotIdx];
      if (cell) {
        const delay = (dayIdx * 0.05 + slotIdx * 0.03).toFixed(2);
        html += `
          <td>
            <div class="cell-content sub-${cell.subject.colorIdx}" style="animation-delay:${delay}s" title="${cell.subject.name} — ${cell.subject.faculty}">
              <div class="cell-subject">${cell.subject.code}</div>
              <div class="cell-faculty">${cell.subject.faculty.split(' ').slice(-1)[0]}</div>
              <div class="cell-room">${cell.room}</div>
            </div>
          </td>`;
      } else {
        html += `<td class="empty">—</td>`;
      }
    });
    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

function updateTTStats(schedule) {
  let totalSlots = 0, clashes = 0;
  schedule.forEach(day => day.forEach(slot => { if (slot) totalSlots++; }));
  const statEl = $('#tt-stats');
  if (statEl) {
    statEl.innerHTML = `
      <span>📊 <strong>${totalSlots}</strong> classes scheduled</span>
      <span>⚡ <strong>0</strong> conflicts detected</span>
      <span>📅 <strong>${DATA.subjects.length}</strong> subjects allocated</span>
    `;
  }
}

// ── Classroom Page ──────────────────────────────────────────
function renderClassrooms(filter = 'all') {
  const container = $('#classrooms-grid');
  if (!container) return;

  const rooms = filter === 'all'
    ? DATA.classrooms
    : DATA.classrooms.filter(r => r.status.toLowerCase() === filter.toLowerCase());

  if (rooms.length === 0) {
    container.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <span class="nr-icon">🏫</span>
        <h3>No classrooms found</h3>
        <p>Try a different filter</p>
      </div>`;
    return;
  }

  container.innerHTML = rooms.map(room => {
    const statusClass = {
      'Available': 'badge-green',
      'Occupied': 'badge-red',
      'Maintenance': 'badge-amber',
    }[room.status] || 'badge-blue';

    const fillPct = room.occupancy;
    const fillColor = fillPct === 100 ? 'var(--danger)' : fillPct > 70 ? 'var(--warn)' : 'var(--success)';

    return `
      <div class="room-card fade-in">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
          <div class="room-number">${room.id}</div>
          <span class="badge ${statusClass}">${room.status}</span>
        </div>
        <div class="room-type">${room.type}</div>
        <div class="room-meta">
          <div class="room-meta-row">🏢 Floor ${room.floor}</div>
          <div class="room-meta-row">👥 Capacity: ${room.capacity} seats</div>
          <div class="room-meta-row">
            ${room.ac ? '❄️ Air-Conditioned' : '🌀 Non-AC'}
            &nbsp;·&nbsp;
            ${room.projector ? '📽 Projector' : '📋 No Projector'}
          </div>
        </div>
        <div class="room-footer">
          <div style="flex:1">
            <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px">
              Occupancy: <strong style="color:var(--text)">${fillPct}%</strong>
            </div>
            <div class="capacity-bar">
              <div class="capacity-fill" style="width:${fillPct}%;background:${fillColor}"></div>
            </div>
          </div>
          <button class="btn btn-sm btn-ghost" style="margin-left:12px" onclick="showToast('${room.id} details loaded','info','🏫')">
            Details
          </button>
        </div>
      </div>`;
  }).join('');
}

// ── Faculty Page ────────────────────────────────────────────
function renderFaculty(query = '') {
  const container = $('#faculty-list');
  if (!container) return;

  const filtered = DATA.faculty.filter(f =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.dept.toLowerCase().includes(query.toLowerCase()) ||
    f.subjects.some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <span class="nr-icon">👤</span>
        <h3>No faculty found</h3>
        <p>Try a different search term</p>
      </div>`;
    return;
  }

  const [bg] = AVATAR_COLORS[0];
  container.innerHTML = filtered.map(f => {
    const [color] = AVATAR_COLORS[f.colorIdx % AVATAR_COLORS.length];
    const statusClass = f.status === 'Active' ? 'badge-green' : 'badge-amber';
    const subjectBadges = f.subjects.map(s => {
      const sub = DATA.subjects.find(x => x.code === s);
      return `<span class="badge badge-blue">${s}</span>`;
    }).join('');

    return `
      <div class="faculty-row slide-up">
        <div class="faculty-avatar" style="${getAvatarStyle(f.colorIdx)}">
          ${getInitials(f.name)}
        </div>
        <div class="faculty-info">
          <div class="faculty-name">${highlightText(f.name, query)}</div>
          <div class="faculty-dept">${highlightText(f.dept, query)} · ${f.email}</div>
          <div class="faculty-subjects">${subjectBadges}</div>
        </div>
        <div class="faculty-meta">
          <span class="badge ${statusClass}" style="margin-bottom:6px;display:inline-flex">${f.status}</span>
          <div class="faculty-load">${f.load}h <span style="font-size:0.7rem;color:var(--text-muted);font-weight:400">/week</span></div>
          <div style="font-size:0.72rem;color:var(--text-muted)">Since ${f.joined}</div>
        </div>
      </div>`;
  }).join('');
}

// ── Subjects Page ───────────────────────────────────────────
function renderSubjects(query = '') {
  const container = $('#subjects-grid');
  if (!container) return;

  const filtered = DATA.subjects.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.code.toLowerCase().includes(query.toLowerCase()) ||
    s.faculty.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <span class="nr-icon">📚</span>
        <h3>No subjects found</h3>
        <p>Try a different search term</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(sub => {
    const color = getSubjectColor(sub.colorIdx);
    const facultyObj = DATA.faculty.find(f => f.name === sub.faculty);
    return `
      <div class="subject-card fade-in">
        <div class="subject-color-bar" style="background:${color}"></div>
        <div class="subject-body">
          <div class="subject-code">${highlightText(sub.code, query)}</div>
          <div class="subject-name">${highlightText(sub.name, query)}</div>
          <div class="subject-meta">
            <span class="badge badge-blue">
              ${highlightText(sub.faculty.split(' ').slice(-2).join(' '), query)}
            </span>
            <span class="subject-credits">${sub.credits} credits</span>
            ${facultyObj ? `<span class="badge ${facultyObj.status === 'Active' ? 'badge-green' : 'badge-amber'}">${facultyObj.status}</span>` : ''}
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="width:28px;height:28px;border-radius:8px;background:${color}22;border:1.5px solid ${color}55;display:flex;align-items:center;justify-content:center;font-size:1rem">
            📖
          </div>
        </div>
      </div>`;
  }).join('');
}

// ── Login Validation ────────────────────────────────────────
function initLogin() {
  const form = $('#login-form');
  if (!form) return;

  const emailInput = $('#login-email');
  const passInput  = $('#login-password');
  const emailErr   = $('#email-error');
  const passErr    = $('#pass-error');
  const submitBtn  = $('#login-btn');
  const pwToggle   = $('.password-toggle');

  // Password toggle
  if (pwToggle) {
    pwToggle.addEventListener('click', () => {
      const type = passInput.type === 'password' ? 'text' : 'password';
      passInput.type = type;
      pwToggle.textContent = type === 'password' ? '👁' : '🙈';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Clear errors
    emailInput.classList.remove('error');
    passInput.classList.remove('error');
    emailErr.classList.remove('visible');
    passErr.classList.remove('visible');

    // Email
    const emailVal = emailInput.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      emailInput.classList.add('error');
      emailErr.textContent = 'Email is required.';
      emailErr.classList.add('visible');
      valid = false;
    } else if (!emailRe.test(emailVal)) {
      emailInput.classList.add('error');
      emailErr.textContent = 'Enter a valid email address.';
      emailErr.classList.add('visible');
      valid = false;
    }

    // Password
    const passVal = passInput.value;
    if (!passVal) {
      passInput.classList.add('error');
      passErr.textContent = 'Password is required.';
      passErr.classList.add('visible');
      valid = false;
    } else if (passVal.length < 6) {
      passInput.classList.add('error');
      passErr.textContent = 'Password must be at least 6 characters.';
      passErr.classList.add('visible');
      valid = false;
    }

    if (!valid) return;

    // Simulate login
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loader-ring" style="width:18px;height:18px;border-width:2px;display:inline-block"></span> Signing in…';

    setTimeout(() => {
      showToast('Login successful! Redirecting…', 'success', '✓');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
    }, 1500);
  });

  // Inline validation
  emailInput && emailInput.addEventListener('input', () => {
    emailInput.classList.remove('error');
    emailErr.classList.remove('visible');
  });
  passInput && passInput.addEventListener('input', () => {
    passInput.classList.remove('error');
    passErr.classList.remove('visible');
  });
}

// ── Dashboard Stats ─────────────────────────────────────────
function initDashboard() {
  const el = document.body;
  if (!el || !el.classList.contains('page-dashboard')) return;

  // Animate counters
  $$('.counter').forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      counter.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 30);
  });

  // Render activity feed
  const activities = [
    { text: 'Timetable for CS Dept (Sem 5) generated', time: '2 min ago', color: 'var(--accent)', icon: '🗓' },
    { text: 'Classroom CR-301 marked for maintenance', time: '14 min ago', color: 'var(--warn)', icon: '🔧' },
    { text: 'Prof. Rajan Pillai set to On Leave', time: '1 hr ago', color: 'var(--danger)', icon: '👤' },
    { text: 'New subject CS307 — Machine Learning added', time: '3 hr ago', color: 'var(--accent3)', icon: '📚' },
    { text: 'Lab schedule conflict resolved for LAB-01', time: '5 hr ago', color: 'var(--success)', icon: '✓' },
  ];

  const feed = $('#activity-feed');
  if (feed) {
    feed.innerHTML = activities.map(a => `
      <div class="activity-item">
        <div class="activity-dot" style="background:${a.color}"></div>
        <div class="activity-body">
          <div class="activity-text">${a.icon} ${a.text}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </div>
    `).join('');
  }
}

// ── Profile / Settings Page ─────────────────────────────────
function initSettings() {
  const themeToggle = $('#settings-theme-toggle');
  if (themeToggle) {
    const saved = localStorage.getItem('theme') || 'dark';
    themeToggle.checked = saved === 'light';
    themeToggle.addEventListener('change', toggleTheme);
  }

  const notifToggle = $('#notif-toggle');
  if (notifToggle) {
    notifToggle.checked = JSON.parse(localStorage.getItem('notifications') || 'true');
    notifToggle.addEventListener('change', () => {
      localStorage.setItem('notifications', notifToggle.checked);
      showToast(`Notifications ${notifToggle.checked ? 'enabled' : 'disabled'}`, 'info');
    });
  }

  const compactToggle = $('#compact-toggle');
  if (compactToggle) {
    compactToggle.addEventListener('change', () => {
      showToast(`Compact mode ${compactToggle.checked ? 'enabled' : 'disabled'}`, 'info');
    });
  }

  // Profile form
  const profileForm = $('#profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Profile updated successfully!', 'success', '✓');
    });
  }
}

// ── Timetable Page ──────────────────────────────────────────
function initTimetable() {
  const genBtn = $('#generate-btn');
  if (genBtn) {
    genBtn.addEventListener('click', generateTimetable);
  }

  const clearBtn = $('#clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const container = $('#timetable-output');
      if (container) {
        container.innerHTML = `
          <div class="no-results">
            <span class="nr-icon">🗓</span>
            <h3>No timetable generated yet</h3>
            <p>Click "Generate Timetable" to create a conflict-free schedule</p>
          </div>`;
        showToast('Timetable cleared', 'info');
        const stats = $('#tt-stats');
        if (stats) stats.innerHTML = '';
      }
    });
  }

  // Render legend
  const legend = $('#subject-legend');
  if (legend) {
    legend.innerHTML = DATA.subjects.map(s => {
      const color = getSubjectColor(s.colorIdx);
      return `<div class="legend-item"><div class="legend-dot" style="background:${color}"></div>${s.code}</div>`;
    }).join('') + `<div class="legend-item"><div class="legend-dot" style="background:repeating-linear-gradient(45deg,var(--border),var(--border) 2px,transparent 2px,transparent 6px)"></div>Lunch</div>`;
  }
}

// ── Classrooms Page ─────────────────────────────────────────
function initClassrooms() {
  renderClassrooms('all');

  $$('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderClassrooms(tab.dataset.filter);
    });
  });
}

// ── Faculty Page ────────────────────────────────────────────
function initFaculty() {
  renderFaculty('');

  const searchInput = $('#faculty-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderFaculty(searchInput.value));
  }
}

// ── Subjects Page ───────────────────────────────────────────
function initSubjects() {
  renderSubjects('');

  const searchInput = $('#subjects-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderSubjects(searchInput.value));
  }
}

// ── Initialize ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();

  // Theme toggle button in navbar
  const themeBtn = $('#theme-toggle-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Page-specific init
  initLogin();
  initDashboard();
  initTimetable();
  initSettings();

  if ($('#classrooms-grid')) initClassrooms();
  if ($('#faculty-list')) initFaculty();
  if ($('#subjects-grid')) initSubjects();
});
