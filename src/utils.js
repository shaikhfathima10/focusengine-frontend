// Empty while developing (the Vite proxy handles it). In production set VITE_API_URL to your backend address.
export const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
// Local-dev uploads are relative (/uploads/...); Cloudinary images are already full https URLs.
export const asset = (u) => (u && u.startsWith('/uploads') ? BASE + u : u);
export const LINKEDIN = 'https://www.linkedin.com/in/fathima-shaik-b99616303/';
export const pad = (n) => String(n).padStart(2, '0');
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => iso(new Date());
export const hm = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);
export const dl = (d) => (d ? new Date(d + 'T00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'No date');
export const initials = (n) => (n || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
