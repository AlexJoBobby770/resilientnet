import './StatCard.css';

export default function StatCard({ label, value, unit, delta, deltaDir = 'neutral', icon, status = 'blue' }) {
  const deltaClass =
    deltaDir === 'up' ? 'stat-delta--up' :
      deltaDir === 'down' ? 'stat-delta--down' :
        'stat-delta--neutral';

  const deltaPrefix =
    deltaDir === 'up' ? '▲ ' :
      deltaDir === 'down' ? '▼ ' : '— ';

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        {icon && <span className={`stat-icon stat-icon--${status}`}>{icon}</span>}
      </div>

      <div className="stat-value-row">
        <span className="stat-value">{value}</span>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>

      {delta && (
        <span className={`stat-delta ${deltaClass}`}>
          {deltaPrefix}{delta}
        </span>
      )}
    </div>
  );
}