import { Bell, RefreshCw } from 'lucide-react';
import './Topbar.css';

export default function Topbar({ title = 'Overview', subtitle, onRefresh, loading }) {
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
      </div>

      <div className="topbar-right">
        <span className="topbar-date">{now}</span>

        {onRefresh && (
          <button
            className={`btn btn-secondary topbar-refresh${loading ? ' topbar-refresh--spin' : ''}`}
            onClick={onRefresh}
            title="Refresh data"
            id="topbar-refresh-btn"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        )}

        <button className="topbar-notif btn btn-ghost" title="Notifications" id="topbar-notif-btn">
          <Bell size={16} />
          <span className="topbar-notif-dot" />
        </button>
      </div>
    </header>
  );
}
