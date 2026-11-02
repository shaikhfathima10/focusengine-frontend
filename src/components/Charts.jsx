const COL = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
export const color = (i) => COL[i % COL.length];

// Bars (green) plus a line (purple) drawn as plain SVG: no chart library needed.
export function Combo({ bars, line, labels }) {
  const W = 600, H = 220, L = 10, B = 28, n = bars.length, w = (W - L) / n;
  const mb = Math.max(1, ...bars), ml = Math.max(1, ...line);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Daily productivity chart" style={{ width: '100%' }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 10 + ((H - B - 10) * i) / 4;
        return <line key={i} x1={L} x2={W} y1={y} y2={y} stroke="var(--line)" />;
      })}
      {bars.map((v, i) => {
        const h = ((H - B - 10) * v) / mb;
        return <rect key={i} x={L + i * w + w * 0.2} y={H - B - h} width={w * 0.6} height={h} rx="3" fill="#10b981" />;
      })}
      <polyline fill="none" stroke="#8b5cf6" strokeWidth="2.5"
        points={line.map((v, i) => `${L + i * w + w / 2},${H - B - ((H - B - 10) * v) / ml}`).join(' ')} />
      {labels.map((l, i) => (n <= 10 || i % 5 === 0) && (
        <text key={i} x={L + i * w + w / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--mute)">{l}</text>
      ))}
    </svg>
  );
}

// Donut made with a CSS conic-gradient.
export function Donut({ items }) {
  let a = 0;
  const seg = items.map((it, i) => { const s = `${color(i)} ${a}% ${a + it.percent}%`; a += it.percent; return s; });
  return <div className="donut" style={{ background: `conic-gradient(${seg.join(',')})` }} role="img" aria-label="Category donut chart" />;
}
