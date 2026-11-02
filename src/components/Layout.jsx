import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import Avatar from './Avatar.jsx';
import Logo from './Logo.jsx';

const NAV = [
  ['/', 'Dashboard', 'Overview of your productivity', '⌂'],
  ['/tasks', 'Tasks', 'Manage your tasks and to-dos', '✓'],
  ['/calendar', 'Calendar', 'View your schedule', '▦'],
  ['/focus', 'Focus', 'Pomodoro timer and focus sessions', '◷'],
  ['/analytics', 'Analytics', 'Track your progress', '▮'],
  ['/profile', 'Profile', 'Manage your account', '⚙'],
  ['/chat', 'Chat', 'Team collaboration', '✉'],
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [dark, setDark] = useState(() => {
    const s = localStorage.getItem('fe_theme');
    return s ? s === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('fe_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="app">
      <aside className="side">
        <div className="brand">
          <Logo size={40} />
          <div><span className="wm"><b>Focus</b>Engine</span><small>Task Manager</small></div>
        </div>
        {NAV.map(([to, label, desc, icon]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => 'nav' + (isActive ? ' on' : '')}>
            <div className="ic">{icon}</div>
            <div><b>{label}</b><small>{desc}</small></div>
          </NavLink>
        ))}
        <div className="foot">Stay productive!</div>
      </aside>
      <div>
        <div className="top">
          <input className="s" placeholder="Search tasks…" aria-label="Search tasks"
            onChange={(e) => nav('/tasks?q=' + encodeURIComponent(e.target.value), { replace: true })} />
          <div className="sp" />
          <button className="sq" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">{dark ? '☀' : '☾'}</button>
          <div className="who">
            <div><b>{user.name}</b><small>Productive learner</small></div>
            <Avatar user={user} />
          </div>
          <button className="out" onClick={logout}>Log out</button>
        </div>
        <main><div className="wrap"><Outlet /></div></main>
      </div>
    </div>
  );
}
