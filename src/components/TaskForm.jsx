import { useState } from 'react';
import { useTasks } from '../tasks.jsx';
import { today } from '../utils.js';

export default function TaskForm({ date, onDone }) {
  const { add } = useTasks();
  const [f, setF] = useState({ title: '', priority: 'medium', area: 'College', dueDate: date || today(), estimateHours: 1 });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await add({ ...f, estimateHours: Number(f.estimateHours) });
      setF({ ...f, title: '' });
      onDone && onDone();
    } catch (er) { setErr(er.message); }
  }

  return (
    <form className="card form" onSubmit={submit}>
      <input className="grow" placeholder="Task title" value={f.title} onChange={set('title')} required aria-label="Title" />
      <select value={f.priority} onChange={set('priority')} aria-label="Priority">
        <option>high</option><option>medium</option><option>low</option>
      </select>
      <input value={f.area} onChange={set('area')} size="8" aria-label="Category" />
      <input type="date" value={f.dueDate} onChange={set('dueDate')} aria-label="Due date" />
      <input type="number" min="0.5" step="0.5" value={f.estimateHours} onChange={set('estimateHours')} style={{ width: 70 }} aria-label="Hours" />
      <button className="btn">Add task</button>
      {err && <div className="err">{err}</div>}
    </form>
  );
}
