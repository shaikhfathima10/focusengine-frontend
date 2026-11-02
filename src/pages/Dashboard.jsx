import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useTasks } from '../tasks.jsx';
import { TaskList } from '../components/TaskItem.jsx';
import Kpi from '../components/Kpi.jsx';
import { today } from '../utils.js';

const QUOTES = [
  'Small steps, done daily, beat big plans left for later.',
  'Start with the hardest task while your head is clear.',
  'Twenty-five focused minutes is enough to begin.',
];

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [a, setA] = useState(null);
  const [qi, setQi] = useState(0);
  useEffect(() => { api('/analytics/overview?days=7').then(setA).catch(() => {}); }, []);

  const todays = tasks.filter((t) => t.dueDate === today());
  const done = tasks.filter((t) => t.completed).length;
  const rate = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const o = a?.overview;

  return (
    <>
      <div className="head"><div><h1>Welcome back, {user.name.split(' ')[0]}!</h1><p className="sub">{new Date().toDateString()}</p></div></div>
      <div className="card quote">
        <b style={{ color: 'var(--pri)' }}>Daily Motivation</b>
        <em>“{QUOTES[qi % QUOTES.length]}”</em>
        <button className="out" onClick={() => setQi(qi + 1)}>New quote</button>
      </div>
      <div className="grid g4">
        <Kpi label="Completion Rate" value={rate + '%'} color="#10b981" icon="✓" pct={rate} />
        <Kpi label="Productive Hours" value={o ? o.productiveHours : '–'} sub="this week" color="#3b82f6" icon="◷" />
        <Kpi label="Focus Score" value={o ? o.focusScore + '/100' : '–'} sub="concentration" color="#8b5cf6" icon="⚡" />
        <Kpi label="Current Streak" value={o ? o.streak : '–'} sub="days" color="#f97316" icon="◎" />
      </div>
      <div className="grid g2">
        <div className="card"><h2>Today's Tasks ({todays.length})</h2><TaskList list={todays} /></div>
        <div>
          <div className="card">
            <h2>Task Completion</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#059669' }}>Completed: {done}</span>
              <span style={{ color: '#ea580c' }}>Pending: {tasks.length - done}</span>
            </div>
            <div className="pb"><i style={{ width: rate + '%' }} /></div>
          </div>
          <div className="card">
            <h2>Quick Actions</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              <Link className="out" to="/tasks">+ Add new task</Link>
              <Link className="out" to="/focus">Start a focus session</Link>
              <Link className="out" to="/analytics">View analytics</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
