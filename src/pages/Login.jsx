import { useState } from 'react';
import { useAuth } from '../auth.jsx';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      if (mode === 'login') await login(f.email, f.password);
      else await register(f.name, f.email, f.password);
    } catch (er) { setErr(er.message); setBusy(false); }
  }

  return (
    <div className="login-wrap">
      <form className="card login" onSubmit={submit}>
        <div className="logo-c"><Logo size={60} /></div>
        <h1>FocusEngine</h1>
        <p className="sub">{mode === 'login' ? 'Welcome back. Log in to continue.' : 'Create your account.'}</p>
        {mode === 'register' && <input placeholder="Your name" value={f.name} onChange={set('name')} required aria-label="Name" />}
        <input type="email" placeholder="Email" value={f.email} onChange={set('email')} required aria-label="Email" />
        <input type="password" placeholder="Password (8+ characters)" value={f.password} onChange={set('password')} required minLength={mode === 'register' ? 8 : 1} aria-label="Password" />
        {err && <div className="err" role="alert">{err}</div>}
        <button className="btn" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
        <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>
          {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}
        </button>
      </form>
    </div>
  );
}
