import { AlertTriangle, XCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import './AlertsPanel.css';

/* Mock alerts shown when no real data */
const MOCK_ALERTS = [
  {
    _id: 'm1',
    severity: 'critical',
    resource: 'Electricity',
    resilience_score: 28,
    recommendations: ['Reduce peak-hour usage', 'Enable load shedding plan'],
  },
  {
    _id: 'm2',
    severity: 'warning',
    resource: 'Water',
    resilience_score: 51,
    recommendations: ['Check for leaks', 'Reduce daily consumption by 15%'],
  },
];

function AlertItem({ alert }) {
  const isCritical = alert.severity === 'critical';

  return (
    <div className={`alert-item alert-item--${isCritical ? 'red' : 'orange'}`}>
      <div className="alert-item-header">
        <div className={`alert-icon alert-icon--${isCritical ? 'red' : 'orange'}`}>
          {isCritical
            ? <XCircle size={15} strokeWidth={2} />
            : <AlertTriangle size={15} strokeWidth={2} />
          }
        </div>
        <div className="alert-meta">
          <span className="alert-resource">{alert.resource}</span>
          <span className={`badge ${isCritical ? 'badge-red' : 'badge-orange'}`}>
            {alert.severity.toUpperCase()}
          </span>
        </div>
        <span className="alert-score">Score: {alert.resilience_score}</span>
      </div>

      {alert.recommendations?.length > 0 && (
        <ul className="alert-recs">
          {alert.recommendations.map((r, i) => (
            <li key={i}>
              <ChevronRight size={11} strokeWidth={2.5} />
              {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AlertsPanel({ alerts = [] }) {
  const displayAlerts = alerts.length > 0 ? alerts : MOCK_ALERTS;
  const isMock = alerts.length === 0;

  return (
    <div className="card alerts-card">
      <div className="alerts-header">
        <div>
          <p className="card-title">Active Alerts</p>
          <p className="alerts-count">
            {displayAlerts.length} alert{displayAlerts.length !== 1 ? 's' : ''} detected
            {isMock && ' (sample)'}
          </p>
        </div>
        {displayAlerts.length === 0 && (
          <div className="alerts-all-good">
            <CheckCircle2 size={16} />
            All systems stable
          </div>
        )}
      </div>

      <div className="alerts-list">
        {displayAlerts.length === 0
          ? (
            <div className="alerts-empty">
              <CheckCircle2 size={32} strokeWidth={1.5} />
              <p>No active alerts — all resources are stable.</p>
            </div>
          )
          : displayAlerts.map(alert => (
            <AlertItem key={alert._id} alert={alert} />
          ))
        }
      </div>
    </div>
  );
}