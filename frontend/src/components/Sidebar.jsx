import React, { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Sidebar.css';

gsap.registerPlugin(useGSAP);

const SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { to: '/introduction', label: 'Introduction' },
      { to: '/dashboard', label: 'Dashboard' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { to: '/forecast', label: 'Forecast' },
      { to: '/alerts', label: 'Alerts', badge: '2', badgeRed: true },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/settings', label: 'Settings' },
    ],
  },
];

export default function Sidebar() {
  const sidebarRef = useRef(null);
  const logoutBtnRef = useRef(null);
  const navigate = useNavigate();

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    tl.from(sidebarRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    })
      .from(".sidebar-brand", {
        y: 8,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.3")
      .from(".sidebar-section", {
        y: 8,
        opacity: 0,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out"
      }, "-=0.2")
      .from(".sidebar-link", {
        x: -8,
        opacity: 0,
        duration: 0.3,
        stagger: 0.04,
        ease: "power2.out"
      }, "-=0.2")
      .from(".sidebar-bottom-container", {
        y: 8,
        opacity: 0,
        duration: 0.35,
        ease: "power2.out"
      }, "-=0.1");
  }, { scope: sidebarRef });

  const handleLogoutMove = (e) => {
    if (!logoutBtnRef.current) return;
    const rect = logoutBtnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    gsap.to(logoutBtnRef.current, { x, y, duration: 0.3, ease: "power2.out" });
  };

  const handleLogoutLeave = () => {
    gsap.to(logoutBtnRef.current, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <aside className="sidebar" ref={sidebarRef}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Shield size={15} strokeWidth={2.5} />
        </div>
        <div>
          <p className="sidebar-brand-name">ResilientNet</p>
          <span className="sidebar-brand-version">v2.0</span>
        </div>
      </div>

      {SECTIONS.map(({ title, items }) => (
        <div key={title} className="sidebar-section">
          <div className="sidebar-section-header">
            <span>{title}</span>
          </div>
          <nav className="sidebar-nav">
            {items.map(({ to, label, badge, badgeRed }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                {label}
                {badge && (
                  <span className={`sidebar-badge ${badgeRed ? 'sidebar-badge--red' : ''}`}>
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      ))}

      <div className="sidebar-spacer" />

      <div className="sidebar-bottom-container">
        <div className="sidebar-divider" />
        <div className="sidebar-status">
          <span className="sidebar-status-dot" />
          <span className="sidebar-status-text">All systems operational</span>
        </div>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">AJ</div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">Admin User</p>
              <p className="sidebar-user-role">HH · test123</p>
            </div>
            <div className="logout-magnetic-zone" onMouseMove={handleLogoutMove} onMouseLeave={handleLogoutLeave}>
              <button className="sidebar-logout" ref={logoutBtnRef} title="Logout" onClick={() => navigate('/login')}>
                <LogOut size={13} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}