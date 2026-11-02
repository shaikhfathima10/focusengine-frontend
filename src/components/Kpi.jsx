export default function Kpi({ label, value, sub, color, icon, pct }) {
  return (
    <div className="card kpi">
      <div>
        <small>{label}</small>
        <b>{value}</b>
        {sub && <small>{sub}</small>}
        {pct !== undefined && <div className="pb"><i style={{ width: pct + '%' }} /></div>}
      </div>
      <div className="kt" style={{ background: color }}>{icon}</div>
    </div>
  );
}
