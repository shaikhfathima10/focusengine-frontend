import { useTasks } from '../tasks.jsx';
import { dl } from '../utils.js';

export default function TaskItem({ t }) {
  const { toggle, remove } = useTasks();
  return (
    <div className={'task' + (t.completed ? ' done' : '')}>
      <button className={'chk' + (t.completed ? ' d' : '')} onClick={() => toggle(t)} aria-label={'Complete ' + t.title}>
        {t.completed ? '✓' : ''}
      </button>
      <div className="tl">{t.title}<small>{dl(t.dueDate)} · {t.estimateHours}h</small></div>
      <span className={'tag ' + t.priority}>{t.priority}</span>
      <span className="tag c">{t.area}</span>
      <button className="x" onClick={() => remove(t)} aria-label="Delete task">✕</button>
    </div>
  );
}

export const TaskList = ({ list }) =>
  list.length ? list.map((t) => <TaskItem key={t._id} t={t} />) : <div className="empty">No tasks here yet.</div>;
