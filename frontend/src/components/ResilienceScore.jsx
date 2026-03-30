import { Zap, Droplets, Flame } from 'lucide-react';
import './ResilienceScore.css';

function getStatus(score) {
  if (score >= 70) return { label: 'Stable',   cls: 'green',  badge: 'badge-green'  };
  if (score >= 40) return { label: 'Warning',  cls: 'orange', badge: 'badge-orange' };
  return             { label: 'Critical',  cls: 'red',    badge: 'badge-red'    };
}

function MetricBar({ label, value, icon: Icon, colorCls }) {
  return (
    <div className="rs-metric">
      <div className="rs-metric-header">
        <div className={`rs-metric-icon rs-metric-icon--${colorCls}`}>
          <Icon size={14} strokeWidth={2.2} />
        </div>
        <span className="rs-metric-label">{label}</span>
        <span className="rs-metric-value">{value}</span>
      </div>
      <div className="rs-bar-track">
        <div
          className={`rs-bar-fill rs-bar-fill--${colorCls}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function ResilienceScore({ score = 72, breakdown = {} }) {
  const { label, cls, badge } = getStatus(score);

  // Compute ring offset for circular gauge
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  const energy = breakdown.energy ?? 75;
  const water  = breakdown.water  ?? 60;
  const lpg    = breakdown.lpg    ?? 48;

  const energyStatus = energy >= 70 ? 'green' : energy >= 40 ? 'orange' : 'red';
  const waterStatus  = water  >= 70 ? 'green' : water  >= 40 ? 'orange' : 'red';
  const lpgStatus    = lpg    >= 70 ? 'green' : lpg    >= 40 ? 'orange' : 'red';

  return (
    <div className="card rs-card">
      <p className="card-title">Community Resilience Score</p>

      {/* Gauge + label */}
      <div className="rs-gauge-wrap">
        <svg className="rs-gauge-svg" viewBox="0 0 128 128">
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="10"
          />
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={cls === 'green' ? 'var(--status-green)' : cls === 'orange' ? 'var(--status-orange)' : 'var(--status-red)'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 64 64)"
            style={{ transition: 'stroke-dashoffset .6s ease' }}
          />
        </svg>

        <div className="rs-gauge-inner">
          <span className={`rs-score rs-score--${cls}`}>{score}</span>
          <span className={`badge ${badge}`}>{label}</span>
        </div>
      </div>

      {/* Resource breakdown */}
      <div className="rs-metrics">
        <MetricBar label="Energy"  value={energy} icon={Zap}      colorCls={energyStatus} />
        <MetricBar label="Water"   value={water}  icon={Droplets} colorCls={waterStatus}  />
        <MetricBar label="LPG"     value={lpg}    icon={Flame}    colorCls={lpgStatus}    />
      </div>
    </div>
  );
}