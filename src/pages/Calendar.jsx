import { useState } from 'react';
import { useTasks } from '../tasks.jsx';
import { TaskList } from '../components/TaskItem.jsx';
import TaskForm from '../components/TaskForm.jsx';
import Kpi from '../components/Kpi.jsx';
import { today, pad, dl } from '../utils.js';

export default function Calendar() {
  const { tasks } = useTasks();
  const [mo, setMo] = useState(0);
  const [sel, setSel] = useState(today());
  const [hide, setHide] = useState(false);

  const b = new Date(); b.setMonth(b.getMonth() + mo, 1);
  const y = b.getFullYear(), m = b.getMonth();
  const first = b.getDay(), len = new Date(y, m + 1, 0).getDate();
  const key = (i) => `${y}-${pad(m + 1)}-${pad(i)}`;
  const pending = tasks.filter((t) => !t.completed);

  return (
    <>
      <div className="head">
        <div className="ic">▦</div>
        <div><h1>Calendar</h1><p className="sub">{b.toLocaleString('en', { month: 'long' })} {y}</p></div>
      </div>
      <div className="grid g4">
        <Kpi label="Today" value={tasks.filter((t) => t.dueDate === today()).length} color="#3b82f6" icon="◎" />
        <Kpi label="Pending" value={pending.length} color="#f59e0b" icon="◷" />
        <Kpi label="Completed" value={tasks.length - pending.length} color="#10b981" icon="✓" />
        <Kpi label="High priority" value={tasks.filter((t) => t.priority === 'high').length} color="#ef4444" icon="!" />
      </div>
      <div className="card">
        <div className="head" style={{ marginBottom: 10 }}>
          <button className="out" onClick={() => setMo(mo - 1)} aria-label="Previous month">‹</button>
          <b>{b.toLocaleString('en', { month: 'long' })} {y}</b>
          <button className="out" onClick={() => setMo(mo + 1)} aria-label="Next month">›</button>
          <div className="sp" />
          <label><input type="checkbox" checked={hide} onChange={(e) => setHide(e.target.checked)} /> Hide completed</label>
        </div>
        <div className="cal">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div className="h" key={d}>{d}</div>)}
          {Array.from({ length: first }, (_, i) => <div key={'e' + i} />)}
          {Array.from({ length: len }, (_, i) => {
            const k = key(i + 1);
            const ts = tasks.filter((t) => t.dueDate === k && !(hide && t.completed));
            return (
              <button key={k} className={'day' + (k === today() ? ' today' : '') + (k === sel ? ' sel' : '')} onClick={() => setSel(k)}>
                <b>{i + 1}</b>
                {ts.slice(0, 2).map((t) => <span key={t._id} className={'chip ' + t.priority}>{t.title}</span>)}
                {ts.length > 2 && <span className="chip">+{ts.length - 2}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <h3>{sel === today() ? 'Today' : dl(sel)}</h3>
      <TaskForm key={sel} date={sel} />
      <TaskList list={tasks.filter((t) => t.dueDate === sel)} />
    </>
  );
}
