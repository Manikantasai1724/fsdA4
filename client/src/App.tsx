import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { generateTimetable, getCatalog } from './api';
import {
  classrooms as staticClassrooms,
  days,
  faculty as staticFaculty,
  subjects as staticSubjects,
  timeSlots,
  type Classroom,
  type Faculty,
  type Subject,
  type TimetableCell,
} from './data';

type Toast = { message: string; tone?: 'success' | 'info' | 'error' };

function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const notify = (message: string, tone: Toast['tone'] = 'info') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  };
  return { toast, notify };
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const glyphs: Record<string, string> = {
    grid: '▦', calendar: '▣', rooms: '⌂', faculty: '◉', subjects: '◫',
    settings: '⚙', logout: '↪', theme: '◐', search: '⌕', plus: '+',
    arrow: '→', chart: '↗', shield: '◆', bell: '♢', user: '◯',
  };
  return <span className="icon" style={{ fontSize: size }} aria-hidden="true">{glyphs[name] ?? '•'}</span>;
}

function Layout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  const nav = [
    ['/', 'Overview', 'grid'],
    ['/dashboard', 'Dashboard', 'chart'],
    ['/timetable', 'Timetable', 'calendar'],
    ['/classrooms', 'Classrooms', 'rooms'],
    ['/faculty', 'Faculty', 'faculty'],
    ['/subjects', 'Subjects', 'subjects'],
  ] as const;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          <div className="brand-mark"><span>SS</span></div>
          <div><strong>SmartScheduler</strong><small>Academic Operations</small></div>
        </Link>
        <nav className="side-nav" aria-label="Primary navigation">
          <span className="nav-label">Workspace</span>
          {nav.map(([to, label, icon]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)}>
              <Icon name={icon} /><span>{label}</span>
            </NavLink>
          ))}
          <span className="nav-label">Account</span>
          <NavLink to="/settings" onClick={() => setMobileOpen(false)}><Icon name="settings" /><span>Settings</span></NavLink>
        </nav>
        <div className="sidebar-profile">
          <div className="avatar">AK</div>
          <div className="profile-copy"><strong>Aryan Kumar</strong><small>Administrator</small></div>
          <Link to="/login" className="profile-action" aria-label="Log out"><Icon name="logout" /></Link>
        </div>
      </aside>

      {mobileOpen && <button className="sidebar-backdrop" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}

      <div className="app-content">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu">☰</button>
          <div className="topbar-context"><span>SCST</span><b>Computer Science Department</b></div>
          <div className="topbar-actions">
            <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme"><Icon name="theme" /></button>
            <button className="icon-button notification" aria-label="Notifications"><Icon name="bell" /><span /></button>
            <Link to="/settings" className="top-avatar">AK</Link>
          </div>
        </header>
        <main>{children}</main>
      </div>
      {toast && <div className={`toast toast-${toast.tone ?? 'info'}`}>{toast.message}</div>}
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>
      {action && <div className="page-actions">{action}</div>}
    </div>
  );
}

function Overview() {
  return (
    <>
      <PageHeader eyebrow="Academic operations" title="Good morning, Aryan" description="Here is the latest activity across your scheduling workspace." action={<Link className="button primary" to="/timetable"><Icon name="calendar" /> Generate schedule</Link>} />
      <section className="metric-grid" aria-label="Summary metrics">
        {[
          ['rooms', 'Total classrooms', '9', '+1 this semester', 'blue'],
          ['faculty', 'Active faculty', '6', '1 on leave', 'violet'],
          ['subjects', 'Active subjects', '8', '27 total credits', 'teal'],
          ['shield', 'Schedule conflicts', '0', 'All resolved', 'amber'],
        ].map(([icon, label, value, note, tone]) => (
          <article className="metric-card" key={label}>
            <div className={`metric-icon ${tone}`}><Icon name={icon} size={20} /></div>
            <div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
            <span className="metric-trend"><Icon name="chart" /> Live</span>
          </article>
        ))}
      </section>
      <section className="overview-grid">
        <article className="panel">
          <div className="panel-header"><div><span className="eyebrow">Weekly activity</span><h2>Schedule overview</h2></div><select aria-label="Schedule period"><option>This week</option><option>Last week</option></select></div>
          <div className="overview-chart">
            {[72, 86, 64, 92, 78, 42, 30].map((height, index) => (
              <div className="chart-column" key={index}><div className="chart-track"><span style={{ height: `${height}%` }} /></div><small>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</small></div>
            ))}
          </div>
        </article>
        <article className="panel">
          <div className="panel-header"><div><span className="eyebrow">Operations</span><h2>Resource status</h2></div><Link to="/classrooms">View all</Link></div>
          <div className="status-list">
            <div><span className="status-dot success" /><p><strong>Available rooms</strong><small>Ready for assignment</small></p><b>6</b></div>
            <div><span className="status-dot danger" /><p><strong>Occupied rooms</strong><small>Currently in use</small></p><b>2</b></div>
            <div><span className="status-dot warning" /><p><strong>Maintenance</strong><small>Requires attention</small></p><b>1</b></div>
          </div>
        </article>
      </section>
      <section className="module-grid">
        {[
          ['/timetable', 'calendar', 'Timetable', 'Build and publish conflict-free schedules'],
          ['/classrooms', 'rooms', 'Classrooms', 'Monitor capacity and room availability'],
          ['/faculty', 'faculty', 'Faculty', 'Balance workload across departments'],
          ['/subjects', 'subjects', 'Subjects', 'Manage courses and credit distribution'],
        ].map(([to, icon, title, description]) => (
          <Link className="module-card" to={to} key={to}><div className="module-icon"><Icon name={icon} size={21} /></div><div><h3>{title}</h3><p>{description}</p></div><Icon name="arrow" /></Link>
        ))}
      </section>
    </>
  );
}

function Dashboard() {
  const activity = [
    ['calendar', 'Semester timetable published', 'Computer Science · Semester 5', '2 min'],
    ['rooms', 'CR-301 marked for maintenance', 'Campus operations', '14 min'],
    ['faculty', 'Rajan Pillai set to On Leave', 'Faculty management', '1 hr'],
    ['subjects', 'CS307 added to curriculum', 'Subjects & courses', '3 hr'],
  ] as const;
  return (
    <>
      <PageHeader eyebrow="Control center" title="Dashboard" description="Academic year 2024–25 · Semester 5" action={<button className="button secondary"><Icon name="chart" /> Export report</button>} />
      <section className="metric-grid">
        {[
          ['Classrooms', '9', '2 occupied', 'rooms'], ['Faculty', '7', '6 active', 'faculty'],
          ['Subjects', '8', '27 credits', 'subjects'], ['Conflicts', '0', 'Fully resolved', 'shield'],
        ].map(([label, value, note, icon]) => (
          <article className="metric-card" key={label}><div className="metric-icon blue"><Icon name={icon} /></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>
        ))}
      </section>
      <section className="dashboard-grid">
        <article className="panel"><div className="panel-header"><div><span className="eyebrow">Faculty load</span><h2>Weekly teaching hours</h2></div><Link to="/faculty">View faculty</Link></div>
          <div className="load-list">{staticFaculty.slice(0, 5).map((person, index) => <div key={person.id}><div className="person-mini"><div className="mini-avatar">{person.name.split(' ').slice(-2).map(part => part[0]).join('')}</div><div><strong>{person.name}</strong><small>{person.dept}</small></div></div><div className="load-bar"><span style={{ width: `${Math.min(person.load / 10 * 100, 100)}%` }} /></div><b>{person.load}h</b></div>)}</div>
        </article>
        <article className="panel"><div className="panel-header"><div><span className="eyebrow">Live feed</span><h2>Recent activity</h2></div><span className="live-pill">Live</span></div>
          <div className="activity-list">{activity.map(([icon, title, detail, time]) => <div key={title}><div className="activity-icon"><Icon name={icon} /></div><p><strong>{title}</strong><small>{detail}</small></p><time>{time}</time></div>)}</div>
        </article>
      </section>
    </>
  );
}

function CatalogPage() {
  const [subjects, setSubjects] = useState<Subject[]>(staticSubjects);
  const [faculty, setFaculty] = useState<Array<Faculty & { department?: string }>>(staticFaculty);
  const [classrooms, setClassrooms] = useState<Classroom[]>(staticClassrooms);

  useEffect(() => {
    getCatalog().then((catalog) => {
      if (!catalog) return;
      setSubjects(catalog.subjects);
      setFaculty(catalog.faculty.map((person, index) => ({ ...person, id: person.id ?? index + 1, dept: person.dept ?? person.department ?? '' })));
      setClassrooms(catalog.classrooms.map((room) => ({
        ...room,
        id: room.id ?? String((room as Classroom & { code?: string }).code ?? ''),
        ac: room.ac ?? Boolean((room as Classroom & { airConditioned?: boolean }).airConditioned),
      })));
    });
  }, []);

  return { subjects, faculty, classrooms };
}

function ClassroomsPage() {
  const { classrooms } = CatalogPage();
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? classrooms : classrooms.filter((room) => room.status === filter);
  const available = classrooms.filter((room) => room.status === 'Available').length;
  return (
    <>
      <PageHeader eyebrow="Infrastructure" title="Classrooms" description="Monitor room availability, capacity and facilities." action={<button className="button primary"><Icon name="plus" /> Add classroom</button>} />
      <section className="metric-grid compact">
        {[['Available now', available, 'success'], ['Total seats', classrooms.reduce((sum, room) => sum + room.capacity, 0), 'blue'], ['Maintenance', classrooms.filter((room) => room.status === 'Maintenance').length, 'warning'], ['Air-conditioned', classrooms.filter((room) => room.ac).length, 'violet']].map(([label, value, tone]) => <article className="metric-card" key={String(label)}><div className={`metric-icon ${tone}`}><Icon name="rooms" /></div><div><span>{String(label)}</span><strong>{String(value)}</strong></div></article>)}
      </section>
      <div className="filter-bar">{['All', 'Available', 'Occupied', 'Maintenance'].map((item) => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}<span>{item === 'All' ? classrooms.length : classrooms.filter((room) => room.status === item).length}</span></button>)}</div>
      <section className="room-grid">{visible.map((room) => <article className="room-card" key={room.id}><div className="room-heading"><div><span>{room.type}</span><h3>{room.id}</h3></div><span className={`status-badge ${room.status.toLowerCase()}`}>{room.status}</span></div><div className="room-properties"><span><b>Floor</b>{room.floor}</span><span><b>Capacity</b>{room.capacity}</span><span><b>Facilities</b>{room.ac ? 'AC' : 'No AC'} · {room.projector ? 'Projector' : 'No projector'}</span></div><div className="occupancy"><div><span>Occupancy</span><strong>{room.occupancy}%</strong></div><div className="occupancy-track"><span style={{ width: `${room.occupancy}%` }} /></div></div></article>)}</section>
    </>
  );
}

function FacultyPage() {
  const { faculty } = CatalogPage();
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const visible = faculty.filter((person) => (!department || person.dept === department) && `${person.name} ${person.dept} ${person.subjects.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  const departments = Array.from(new Set(faculty.map((person) => person.dept)));
  return (
    <>
      <PageHeader eyebrow="People" title="Faculty" description="Manage teaching staff and weekly workload." action={<button className="button primary"><Icon name="plus" /> Add faculty</button>} />
      <div className="toolbar"><div className="search-field"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search faculty, department or subject" /></div><select value={department} onChange={(event) => setDepartment(event.target.value)}><option value="">All departments</option>{departments.map((item) => <option key={item}>{item}</option>)}</select></div>
      <section className="table-card"><div className="table-head"><span>Faculty member</span><span>Department</span><span>Subjects</span><span>Workload</span><span>Status</span></div>{visible.map((person) => <div className="table-row" key={person.id}><div className="faculty-cell"><div className="mini-avatar">{person.name.split(' ').slice(0, 2).map((part) => part[0]).join('')}</div><div><strong>{person.name}</strong><small>{person.email}</small></div></div><span>{person.dept}</span><div className="tag-list">{person.subjects.map((code) => <span key={code}>{code}</span>)}</div><b>{person.load}h / week</b><span className={`status-badge ${person.status === 'Active' ? 'available' : 'maintenance'}`}>{person.status}</span></div>)}</section>
    </>
  );
}

function SubjectsPage() {
  const { subjects } = CatalogPage();
  const [query, setQuery] = useState('');
  const [credit, setCredit] = useState(0);
  const palette = ['#3157d5', '#6d5bd0', '#168d74', '#c27820', '#be4b69', '#a854b5', '#25859a', '#789c32'];
  const visible = subjects.filter((subject) => (!credit || subject.credits === credit) && `${subject.code} ${subject.name} ${subject.faculty}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <PageHeader eyebrow="Curriculum" title="Subjects" description="Review courses, faculty assignments and credit distribution." action={<button className="button primary"><Icon name="plus" /> Add subject</button>} />
      <div className="toolbar"><div className="search-field"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects or faculty" /></div><div className="segmented">{[0, 3, 4].map((value) => <button className={credit === value ? 'active' : ''} onClick={() => setCredit(value)} key={value}>{value ? `${value} credits` : 'All subjects'}</button>)}</div></div>
      <section className="subject-grid">{visible.map((subject) => <article className="subject-card" key={subject.code} style={{ '--subject': palette[subject.colorIdx] } as CSSProperties}><div className="subject-top"><span>{subject.code}</span><b>{subject.credits} credits</b></div><h3>{subject.name}</h3><div className="subject-footer"><div className="mini-avatar">{subject.faculty.split(' ').slice(-2).map((part) => part[0]).join('')}</div><div><small>Faculty</small><strong>{subject.faculty}</strong></div></div></article>)}</section>
    </>
  );
}

function TimetablePage() {
  const [schedule, setSchedule] = useState<Array<Array<TimetableCell | null>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('Semester 5');
  const [section, setSection] = useState('Section A');

  const generate = async () => {
    setLoading(true);
    const response = await generateTimetable({ department, semester, section });
    if (response) setSchedule(response.schedule);
    setLoading(false);
  };

  return (
    <>
      <PageHeader eyebrow="Scheduling" title="Timetable" description="Generate and review a conflict-free academic schedule." action={<button className="button secondary"><Icon name="chart" /> Export PDF</button>} />
      <section className="schedule-config"><div><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option>Computer Science</option><option>Electronics</option><option>Mechanical</option></select></div><div><span>Semester</span><select value={semester} onChange={(event) => setSemester(event.target.value)}><option>Semester 5</option><option>Semester 3</option><option>Semester 7</option></select></div><div><span>Section</span><select value={section} onChange={(event) => setSection(event.target.value)}><option>Section A</option><option>Section B</option><option>Section C</option></select></div><button className="button primary" onClick={generate} disabled={loading}>{loading ? 'Generating…' : 'Generate schedule'}<Icon name="arrow" /></button></section>
      <section className="timetable-card">
        {schedule ? <>
          <div className="timetable-summary"><span className="status-badge available">0 conflicts</span><p>{schedule.flat().filter(Boolean).length} sessions scheduled</p><span>Generated just now</span></div>
          <div className="timetable-scroll"><table className="timetable"><thead><tr><th>Time</th>{days.map((day) => <th key={day}>{day}</th>)}</tr></thead><tbody>{timeSlots.map((slot, slotIndex) => <tr key={slot}><th>{slot}</th>{days.map((day, dayIndex) => slotIndex === 3 ? <td className="lunch" key={day}>Lunch</td> : <td key={day}>{schedule[dayIndex]?.[slotIndex] ? <div className="session" style={{ '--session': ['#3157d5', '#6d5bd0', '#168d74', '#c27820', '#be4b69', '#a854b5', '#25859a', '#789c32'][schedule[dayIndex][slotIndex]!.subject.colorIdx] } as CSSProperties}><strong>{schedule[dayIndex][slotIndex]!.subject.code}</strong><span>{schedule[dayIndex][slotIndex]!.subject.faculty.split(' ').slice(-1)[0]}</span><small>{schedule[dayIndex][slotIndex]!.room}</small></div> : <span className="free-slot">—</span>}</td>)}</tr>)}</tbody></table></div>
        </> : <div className="empty-state"><div className="empty-icon"><Icon name="calendar" size={28} /></div><h2>Your schedule will appear here</h2><p>Choose the academic details above, then generate your timetable.</p></div>}
      </section>
    </>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    navigate('/dashboard');
  };
  return (
    <div className="login-layout"><aside><Link to="/" className="brand login-brand"><div className="brand-mark"><span>SS</span></div><div><strong>SmartScheduler</strong><small>Academic Operations</small></div></Link><div className="login-message"><span className="eyebrow">Planning with precision</span><h1>Smarter schedules.<br />Better operations.</h1><p>A unified workspace for faculty, classrooms and academic planning.</p></div></aside><main><form className="login-card" onSubmit={submit} noValidate><span className="eyebrow">Welcome back</span><h2>Sign in to your workspace</h2><p>Use your institutional account to continue.</p><label>Email address<input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} placeholder="name@college.edu" /></label><label>Password<input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} placeholder="Enter your password" /></label>{error && <div className="login-error">{error}</div>}<button className="button primary" type="submit">Sign in<Icon name="arrow" /></button><button className="demo-button" type="button" onClick={() => { setEmail('admin@college.edu'); setPassword('admin123'); }}>Use demo account</button></form></main></div>
  );
}

function Settings() {
  const [name, setName] = useState('Aryan Kumar');
  const [theme, setTheme] = useState(localStorage.getItem('theme') === 'dark');
  const { notify } = useToast();
  return (
    <>
      <PageHeader eyebrow="Account" title="Settings" description="Manage profile information and workspace preferences." />
      <section className="settings-grid"><article className="panel"><div className="panel-header"><div><span className="eyebrow">Profile</span><h2>Personal information</h2></div></div><form onSubmit={(event) => { event.preventDefault(); notify('Profile updated successfully', 'success'); }}><label>Full name<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Email address<input type="email" defaultValue="aryan.kumar@college.edu" /></label><label>Department<select defaultValue="Computer Science"><option>Computer Science</option><option>Electronics</option><option>Mechanical</option></select></label><button className="button primary" type="submit">Save changes</button></form></article><article className="panel"><div className="panel-header"><div><span className="eyebrow">Preferences</span><h2>Appearance</h2></div></div><div className="setting-row"><div><strong>Dark mode</strong><small>Use a low-light interface</small></div><label className="switch"><input type="checkbox" checked={theme} onChange={(event) => { setTheme(event.target.checked); const next = event.target.checked ? 'dark' : 'light'; localStorage.setItem('theme', next); document.documentElement.setAttribute('data-theme', next); }} /><span /></label></div><div className="setting-row"><div><strong>Email reports</strong><small>Receive weekly scheduling summaries</small></div><label className="switch"><input type="checkbox" defaultChecked /><span /></label></div></article></section>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Layout><Routes><Route path="/" element={<Overview />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/timetable" element={<TimetablePage />} /><Route path="/classrooms" element={<ClassroomsPage />} /><Route path="/faculty" element={<FacultyPage />} /><Route path="/subjects" element={<SubjectsPage />} /><Route path="/settings" element={<Settings />} /></Routes></Layout>} />
    </Routes>
  );
}
