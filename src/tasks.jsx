import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from './api.js';
import { useAuth } from './auth.jsx';

const Ctx = createContext(null);
export const useTasks = () => useContext(Ctx);

// Holds the task list once, so Dashboard, Tasks and Calendar all share it.
export function TasksProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => api('/tasks').then(setTasks).finally(() => setLoading(false)), []);
  useEffect(() => { if (user) reload().catch(() => {}); }, [user, reload]);

  const add = async (body) => { const t = await api('/tasks', { method: 'POST', body }); setTasks((x) => [t, ...x]); };
  const toggle = async (t) => {
    const n = await api('/tasks/' + t._id, { method: 'PATCH', body: { completed: !t.completed } });
    setTasks((x) => x.map((y) => (y._id === n._id ? n : y)));
  };
  const remove = async (t) => { await api('/tasks/' + t._id, { method: 'DELETE' }); setTasks((x) => x.filter((y) => y._id !== t._id)); };

  return <Ctx.Provider value={{ tasks, loading, add, toggle, remove, reload }}>{children}</Ctx.Provider>;
}
