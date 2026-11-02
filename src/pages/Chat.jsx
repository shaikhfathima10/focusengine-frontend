import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { api, getToken } from '../api.js';
import { useAuth } from '../auth.jsx';
import { BASE, asset } from '../utils.js';

export default function Chat() {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const sock = useRef(null);
  const box = useRef(null);

  useEffect(() => {
    api('/chat/general/messages').then(setMsgs).catch((e) => setErr(e.message));
    // Same JWT as the REST API. Connects through the Vite proxy to the backend.
    const s = BASE ? io(BASE, { auth: { token: getToken() } }) : io({ auth: { token: getToken() } });
    sock.current = s;
    s.on('connect', () => { setErr(''); s.emit('room:join', 'general'); });
    s.on('connect_error', (e) => setErr('Live chat unavailable: ' + e.message));
    s.on('message:new', (m) => setMsgs((x) => [...x, m]));
    return () => s.disconnect();
  }, []);
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [msgs]);

  const ack = (r) => { if (r && r.error) setErr(r.error); };
  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sock.current.emit('message:send', { room: 'general', text }, ack);
    setText('');
  };
  async function attach(e) {
    const img = e.target.files[0];
    if (!img) return;
    const form = new FormData();
    form.append('image', img);
    try {
      const { url } = await api('/upload', { method: 'POST', form });
      sock.current.emit('message:send', { room: 'general', image: url }, ack);
    } catch (er) { setErr(er.message); }
    e.target.value = '';
  }

  return (
    <>
      <div className="head"><div className="ic">✉</div><div><h1>Chat</h1><p className="sub">General room. Everyone who has an account can talk here, live.</p></div></div>
      <div className="card">
        <div className="msgs" ref={box}>
          {msgs.length === 0 && <div className="empty">No messages yet. Say hello.</div>}
          {msgs.map((m) => (
            <div key={m._id} className={'m' + (m.sender?._id === user._id ? ' me' : '')}>
              {m.sender?._id !== user._id && <small className="who-n">{m.sender?.name}</small>}
              {m.image && <img className="mi" src={asset(m.image)} alt="Shared in chat" />}
              {m.text}
            </div>
          ))}
        </div>
        {err && <div className="err" role="alert">{err}</div>}
        <form className="form" onSubmit={send}>
          <input className="grow" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" aria-label="Message" />
          <label className="out" style={{ cursor: 'pointer' }}>Image<input type="file" accept="image/*" hidden onChange={attach} /></label>
          <button className="btn">Send</button>
        </form>
      </div>
    </>
  );
}
