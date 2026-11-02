import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useTasks } from '../tasks.jsx';
import Avatar from '../components/Avatar.jsx';
import { LINKEDIN, hm } from '../utils.js';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { tasks } = useTasks();
  const [a, setA] = useState(null);
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ name: user.name, bio: user.bio || '' });
  const [err, setErr] = useState('');
  const file = useRef(null);
  useEffect(() => { api('/analytics/overview?days=30').then(setA).catch(() => {}); }, []);

  const done = tasks.filter((t) => t.completed).length;
  const focusMin = a ? Math.round(a.overview.productiveHours * 60) : 0;
  const badges = [
    ['First task done', done >= 1], ['3 tasks done', done >= 3],
    ['100 minutes focused', focusMin >= 100], ['3-day streak', (a?.overview.streak || 0) >= 3],
  ];

  // 1) upload the image, 2) save its URL on the user.
  async function pick(e) {
    const img = e.target.files[0];
    if (!img) return;
    setErr('');
    const form = new FormData();
    form.append('image', img);
    try {
      const { url } = await api('/upload', { method: 'POST', form });
      setUser(await api('/auth/me', { method: 'PATCH', body: { avatar: url } }));
    } catch (er) { setErr(er.message); }
    e.target.value = '';
  }
  async function removePhoto() { setUser(await api('/auth/me', { method: 'PATCH', body: { avatar: '' } })); }
  async function save(e) {
    e.preventDefault();
    try { setUser(await api('/auth/me', { method: 'PATCH', body: f })); setEdit(false); } catch (er) { setErr(er.message); }
  }

  return (
    <>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="ban" />
        <div className="pf">
          <Avatar user={user} className="big" />
          <div style={{ flex: 1 }}><h1 className="plain">{user.name}</h1><span className="sub">Productive learner · {user.email}</span></div>
          <button className="out" onClick={() => file.current.click()}>Change photo</button>
          {user.avatar && <button className="out" onClick={removePhoto}>Remove photo</button>}
          <a className="out" href={LINKEDIN} target="_blank" rel="noopener noreferrer">in LinkedIn ↗</a>
          <button className="btn" onClick={() => setEdit(!edit)}>✎ Edit</button>
          <input ref={file} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={pick} aria-label="Choose profile photo" />
        </div>
      </div>
      {err && <div className="err" role="alert">{err}</div>}
      <div className="grid g2">
        <div className="card">
          <h2>About</h2>
          {edit ? (
            <form className="form" onSubmit={save}>
              <input className="grow" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label="Name" />
              <input className="grow" value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} placeholder="Short bio" aria-label="Bio" />
              <button className="btn">Save</button>
            </form>
          ) : <p>{user.bio || 'No bio yet. Click Edit to add one.'}</p>}
        </div>
        <div className="card">
          <h2>Stats Summary</h2>
          <div className="bd"><span>Tasks completed</span><b>{done}</b></div>
          <div className="bd"><span>Tasks pending</span><b>{tasks.length - done}</b></div>
          <div className="bd"><span>Focus (30 days)</span><b>{hm(focusMin)}</b></div>
        </div>
      </div>
      <h3>Achievements</h3>
      <div className="grid g4">
        {badges.map(([n, g]) => <div key={n} className={'badge' + (g ? ' got' : '')}><b>{n}</b><br /><small>{g ? 'Earned' : 'Keep going'}</small></div>)}
      </div>
    </>
  );
}
