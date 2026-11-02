import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { useTasks } from '../tasks.jsx';
import { dl } from '../utils.js';

const LENS = [[25, '25 min'], [15, '15 min'], [5, '5 min'], [1, '1 min test']];
const C = 2 * Math.PI * 110;

export default function Focus() {
  const { tasks } = useTasks();
  const [len, setLen] = useState(25);
  const [taskId, setTaskId] = useState('');
  const [left, setLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [msg, setMsg] = useState('');
  const endAt = useRef(0);

  const loadSessions = () => api('/focus?limit=8').then(setSessions).catch(() => {});
  useEffect(() => { loadSessions(); }, []);

  // Counts down from a fixed end time, so it stays correct even if the tab is throttled.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const r = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(r);
      if (r === 0) { clearInterval(id); finish(); }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  async function finish() {
    setRunning(false);
    const t = tasks.find((x) => x._id === taskId);
    try {
      await api('/focus', { method: 'POST', body: { minutes: len, taskId: taskId || undefined, taskTitle: t ? t.title : 'Open focus' } });
      setMsg(`Session saved: ${len} min`);
      loadSessions();
    } catch (e) { setMsg(e.message); }
    setLeft(len * 60);
  }

  const toggle = () => {
    if (running) return setRunning(false);
    endAt.current = Date.now() + left * 1000;
    setMsg('');
    setRunning(true);
  };
  const pick = (m) => { setLen(m); setLeft(m * 60); };
  const reset = () => { setRunning(false); setLeft(len * 60); };
  const clock = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;

  return (
    <>
      <div className="head"><div className="ic">◷</div><div><h1>Focus</h1><p className="sub">Pomodoro timer and focus sessions</p></div></div>
      <div className="card timer">
        <select value={taskId} onChange={(e) => setTaskId(e.target.value)} disabled={running} aria-label="Task to focus on" style={{ marginBottom: 18 }}>
          <option value="">Open focus</option>
          {tasks.filter((t) => !t.completed).map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
        </select>
        <div className="ring">
          <svg viewBox="0 0 260 260" aria-hidden="true">
            <defs><linearGradient id="gr" x1="0" x2="1"><stop offset="0" stopColor="#3b82f6" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs>
            <circle cx="130" cy="130" r="110" fill="none" stroke="var(--soft)" strokeWidth="14" />
            <circle cx="130" cy="130" r="110" fill="none" stroke="url(#gr)" strokeWidth="14" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (left / (len * 60))} transform="rotate(-90 130 130) scale(1 -1) translate(0 -260)" />
          </svg>
          <div className="t"><b>{clock}</b><span className="sub">{running ? 'Focusing…' : 'Ready'}</span></div>
        </div>
        <div className="pills" style={{ justifyContent: 'center' }}>
          {LENS.map(([m, l]) => <button key={m} className={'pill' + (len === m ? ' on' : '')} disabled={running} onClick={() => pick(m)}>{l}</button>)}
        </div>
        <button className="btn" onClick={toggle}>{running ? 'Pause' : 'Start'}</button>{' '}
        <button className="out" onClick={reset}>Reset</button>
        {msg && <p className="sub" role="status">{msg}</p>}
      </div>
      <div className="card">
        <h2>Recent sessions</h2>
        {sessions.length ? sessions.map((s) => (
          <div className="bd" key={s._id}><span>{s.taskTitle}</span><span className="sub">{s.minutes} min · {dl(s.day)}</span></div>
        )) : <div className="empty">No sessions yet. Start one above.</div>}
      </div>
    </>
  );
}
