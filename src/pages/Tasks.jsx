import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../tasks.jsx';
import { TaskList } from '../components/TaskItem.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { today, iso } from '../utils.js';

const weekEnd = () => { const d = new Date(); d.setDate(d.getDate() + 7); return iso(d); };
const FILTERS = {
  all: ['All Tasks', () => true],
  today: ['Today', (t) => t.dueDate === today()],
  week: ['This Week', (t) => t.dueDate >= today() && t.dueDate <= weekEnd()],
  month: ['This Month', (t) => t.dueDate.slice(0, 7) === today().slice(0, 7)],
  high: ['High Priority', (t) => t.priority === 'high'],
  completed: ['Completed', (t) => t.completed],
};

export default function Tasks() {
  const { tasks, loading } = useTasks();
  const [params] = useSearchParams();
  const q = (params.get('q') || '').toLowerCase();
  const [f, setF] = useState('all');
  const [open, setOpen] = useState(false);
  const pending = tasks.filter((t) => !t.completed);
  const stats = [
    ['Total', tasks.length, '#3b82f6'], ['Completed', tasks.length - pending.length, '#10b981'],
    ['Pending', pending.length, '#f59e0b'], ['High priority', tasks.filter(FILTERS.high[1]).length, '#ef4444'],
    ['Overdue', pending.filter((t) => t.dueDate && t.dueDate < today()).length, '#f97316'],
    ['Due today', tasks.filter(FILTERS.today[1]).length, '#8b5cf6'],
  ];
  const list = tasks.filter(FILTERS[f][1]).filter((t) => t.title.toLowerCase().includes(q));

  return (
    <>
      <div className="head">
        <div className="ic">✓</div>
        <div><h1>My Tasks</h1><p className="sub">{tasks.length} tasks • {tasks.length - pending.length} completed • {pending.length} pending</p></div>
        <button className="btn" onClick={() => setOpen(!open)}>+ New Task</button>
      </div>
      {open && <TaskForm onDone={() => setOpen(false)} />}
      <div className="grid g6">
        {stats.map(([l, v, c]) => (
          <div className="card kpi small" key={l}><div><small>{l}</small><b>{v}</b></div><div className="kt" style={{ background: c, width: 28, height: 28 }} /></div>
        ))}
      </div>
      <div className="pills">
        {Object.entries(FILTERS).map(([k, [name, fn]]) => (
          <button key={k} className={'pill' + (f === k ? ' on' : '')} onClick={() => setF(k)}>{name}<span>{tasks.filter(fn).length}</span></button>
        ))}
      </div>
      {loading ? <div className="empty">Loading…</div> : <TaskList list={list} />}
    </>
  );
}
