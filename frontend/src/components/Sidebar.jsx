import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Bell,
  Settings,
  LogOut,
  Zap,
  Shield,
} from 'lucide-react';
import './Sidebar.css';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/forecast',  icon: Activity,        label: 'Forecast'  },
  { to: '/alerts',    icon: Bell,            label: 'Alerts'    },
  { to: '/settings',  icon: Settings,        label: 'Settings'  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Shield size={18} strokeWidth={2.2} />
        </div>
        <span className="sidebar-brand-name">ResilientNet</span>
      </div>

      <div className="divider" style={{ margin: '4px 0 16px' }} />

      {/* Nav links */}
      <nav className="sidebar-nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
            }
          >
            <Icon size={16} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">AJ</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">Admin User</p>
            <p className="sidebar-user-role">Household · test123</p>
          </div>
        </div>
        <button className="sidebar-logout btn btn-ghost" title="Logout">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
