import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Kpi from '../components/Kpi.jsx';
import { Combo, Donut, color } from '../components/Charts.jsx';
import { hm } from '../utils.js';

const TABS = ['Overview', 'Trends', 'Categories', 'Time Analysis', 'Performance', 'Forecast'];

export default function Analytics() {
  const [tab, setTab] = useState('Overview');
  const [days, setDays] = useState(7);
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    setD(null); setErr('');
    api('/analytics/overview?days=' + days).then(setD).catch((e) => setErr(e.message));
  }, [days]);

  const o = d?.overview;
  const labels = d ? d.range.map((x) => x.slice(8)) : [];

  return (
    <>
      <div className="head">
        <div className="ic">▮</div>
        <div><h1>Productivity Analytics</h1><p className="sub">Track your performance and optimise your workflow</p></div>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Range">
          <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option>
        </select>
      </div>
      <div className="card tabs">
        {TABS.map((t) => <button key={t} className={'pill' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      {err && <div className="err">{err}</div>}
      {!d && !err && <div className="empty">Loading…</div>}
      {d && tab === 'Overview' && (
        <>
          <div className="grid g4">
            <Kpi label="Completion Rate" value={o.completionRate + '%'} color="#10b981" icon="✓" pct={o.completionRate} />
            <Kpi label="Productive Hours" value={o.productiveHours} sub="total focused" color="#3b82f6" icon="◷" />
            <Kpi label="Focus Score" value={o.focusScore + '/100'} sub="concentration" color="#8b5cf6" icon="⚡" />
            <Kpi label="Current Streak" value={o.streak} sub="days in a row" color="#f97316" icon="◎" />
          </div>
          <div className="card">
            <h2>Daily Productivity Overview</h2>
            <Combo bars={d.trends.tasksPerDay} line={d.trends.minutesPerDay} labels={labels} />
            <small className="sub">■ Tasks completed &nbsp; — Focus minutes</small>
          </div>
        </>
      )}
      {d && tab === 'Trends' && (
        <div className="card"><h2>Focus minutes per day</h2><Combo bars={d.trends.minutesPerDay} line={d.trends.minutesPerDay} labels={labels} /></div>
      )}
      {d && tab === 'Categories' && (
        <div className="card">
          <h2>Task Distribution by Category</h2>
          {d.categories.length ? (
            <div className="grid g2" style={{ alignItems: 'center' }}>
              <Donut items={d.categories} />
              <div>
                {d.categories.map((c, i) => (
                  <div className="bd" key={c.area}><span><i className="dot" style={{ background: color(i) }} />{c.area}</span><b>{c.count} tasks · {c.percent}%</b></div>
                ))}
              </div>
            </div>
          ) : <div className="empty">Add some tasks to see categories.</div>}
        </div>
      )}
      {d && tab === 'Time Analysis' && (() => {
        const { plannedMinutes: p, focusedMinutes: f } = d.timeAnalysis, mx = Math.max(p, f, 1);
        return (
          <div className="card">
            <h2>Estimated vs actual focus time</h2>
            {[['Estimated (finished tasks)', p], ['Actual focus', f]].map(([l, v]) => (
              <div className="bd block" key={l}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{l}</span><b>{hm(v)}</b></div>
                <div className="pb"><i style={{ width: (v / mx) * 100 + '%', background: 'var(--g)' }} /></div>
              </div>
            ))}
          </div>
        );
      })()}
      {d && tab === 'Performance' && (
        <div className="grid g4">
          <Kpi label="Sessions" value={d.performance.sessions} sub="in range" color="#3b82f6" icon="◷" />
          <Kpi label="Average" value={d.performance.averageMinutes} sub="minutes" color="#8b5cf6" icon="⚡" />
          <Kpi label="Longest" value={d.performance.longestMinutes} sub="minutes" color="#10b981" icon="▮" />
          <Kpi label="Streak" value={o.streak} sub="days" color="#f97316" icon="◎" />
        </div>
      )}
      {d && tab === 'Forecast' && (
        <>
          <div className="grid g4">
            <Kpi label="Daily average" value={d.forecast.avgMinutesPerDay + 'm'} sub="focus" color="#3b82f6" icon="◷" />
            <Kpi label="Next week" value={hm(d.forecast.nextWeekMinutes)} sub="expected focus" color="#8b5cf6" icon="▮" />
            <Kpi label="Open work" value={hm(d.forecast.openTaskMinutes)} sub="estimated" color="#f59e0b" icon="☰" />
            <Kpi label="To clear" value={d.forecast.daysToClear ? d.forecast.daysToClear + ' days' : '–'} sub="at this pace" color="#10b981" icon="✓" />
          </div>
          <p className="sub">A projection from your recent pace, not a promise.</p>
        </>
      )}
    </>
  );
}
