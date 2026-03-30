import './StatCard.css';

/**
 * StatCard — compact KPI metric card
 * Props:
 *   label    : string
 *   value    : string | number
 *   unit     : string (optional)
 *   delta    : string  (e.g. "+12%")
 *   deltaDir : 'up' | 'down' | 'neutral'
 *   icon     : ReactNode
 *   status   : 'green' | 'orange' | 'red' | 'blue'
 */
export default function StatCard({ label, value, unit, delta, deltaDir = 'neutral', icon, status = 'blue' }) {
  const deltaClass = deltaDir === 'up'
    ? 'stat-delta--up'
    : deltaDir === 'down'
      ? 'stat-delta--down'
      : 'stat-delta--neutral';

  return (
    <div className={`card stat-card stat-card--${status}`}>
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        {icon && <span className={`stat-icon stat-icon--${status}`}>{icon}</span>}
      </div>

      <div className="stat-value-row">
        <span className="stat-value">{value}</span>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>

      {delta && (
        <span className={`stat-delta ${deltaClass}`}>{delta}</span>
      )}
    </div>
  );
}
