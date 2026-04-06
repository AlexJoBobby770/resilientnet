import React, { useState, useRef } from 'react';
import { AlertTriangle, XCircle, CheckCircle2, ChevronRight, BellRing, Check } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './AlertsPanel.css';

gsap.registerPlugin(useGSAP);

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

function AlertItem({ alert, onAcknowledge }) {
  const itemRef = useRef(null);
  const iconRef = useRef(null);
  const isCritical = alert.severity === 'critical';

  useGSAP(() => {
    if (isCritical && iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.12,
        opacity: 0.7,
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  }, { scope: itemRef });

  const handleMouseEnter = () => {
    gsap.to(itemRef.current, {
      y: -1,
      duration: 0.25,
      ease: "power2.out"
    });
    gsap.to(itemRef.current.querySelectorAll('.rec-chevron'), {
      x: 3,
      color: "var(--accent)",
      duration: 0.25,
      stagger: 0.04
    });
  };

  const handleMouseLeave = () => {
    gsap.to(itemRef.current, {
      y: 0,
      duration: 0.25,
      ease: "power2.out"
    });
    gsap.to(itemRef.current.querySelectorAll('.rec-chevron'), {
      x: 0,
      color: "var(--text-muted)",
      duration: 0.25
    });
  };

  const handleDismiss = () => {
    const tl = gsap.timeline({
      onComplete: () => onAcknowledge(alert._id)
    });
    tl.to(itemRef.current, { x: 40, opacity: 0, duration: 0.3, ease: "power2.in" })
      .to(itemRef.current, { height: 0, paddingBottom: 0, paddingTop: 0, marginBottom: 0, duration: 0.25, ease: "power3.inOut" });
  };

  return (
    <div
      className={`alert-item alert-item--${isCritical ? 'critical' : 'warning'}`}
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="alert-item-header">
        <div className="alert-icon-wrapper">
          <div className="alert-icon-glow" ref={iconRef} />
          {isCritical ? (
            <XCircle className="alert-icon" size={17} strokeWidth={2.5} />
          ) : (
            <AlertTriangle className="alert-icon" size={17} strokeWidth={2.5} />
          )}
        </div>

        <div className="alert-meta">
          <span className="alert-resource">{alert.resource}</span>
          <span className={`alert-badge badge-${isCritical ? 'critical' : 'warning'}`}>
            {alert.severity.toUpperCase()}
          </span>
        </div>

        <div className="alert-actions">
          <span className="alert-score">
            Score: <strong className={isCritical ? 'text-critical' : 'text-warning'}>{alert.resilience_score}</strong>
          </span>
          <button className="btn-acknowledge" onClick={handleDismiss} title="Acknowledge Alert">
            <Check size={13} strokeWidth={3} />
          </button>
        </div>
      </div>

      {alert.recommendations?.length > 0 && (
        <ul className="alert-recs">
          {alert.recommendations.map((r, i) => (
            <li key={i} className="rec-item">
              <ChevronRight className="rec-chevron" size={13} strokeWidth={3} />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AlertsPanel({ initialAlerts = [] }) {
  const panelRef = useRef(null);
  const initialData = initialAlerts.length > 0 ? initialAlerts : MOCK_ALERTS;
  const [activeAlerts, setActiveAlerts] = useState(initialData);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.15 });

    tl.from(panelRef.current, {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out"
    });

    if (activeAlerts.length > 0) {
      tl.from(".alert-item", {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "back.out(1.2)"
      }, "-=0.3");
    } else {
      tl.from(".alerts-empty", {
        scale: 0.92,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3");
    }
  }, { scope: panelRef });

  const handleAcknowledge = (id) => {
    setActiveAlerts((prev) => prev.filter(alert => alert._id !== id));
  };

  const isAllClear = activeAlerts.length === 0;

  return (
    <div className="alerts-panel" ref={panelRef}>
      <div className="alerts-header">
        <div className="header-titles">
          <div className="title-row">
            <BellRing size={18} className={`title-icon ${!isAllClear ? 'icon-active' : ''}`} />
            <h3 className="panel-title">System Alerts</h3>
          </div>
          <p className="alerts-subtitle">
            {activeAlerts.length} active issue{activeAlerts.length !== 1 ? 's' : ''} detected
            {initialAlerts.length === 0 && activeAlerts.length > 0 && ' (demo mode)'}
          </p>
        </div>

        <div className={`global-status ${isAllClear ? 'status-good' : 'status-alert'}`}>
          {isAllClear ? (
            <><CheckCircle2 size={14} strokeWidth={2.5} /> Stable</>
          ) : (
            <><div className="status-dot pulsing" /> Attention</>
          )}
        </div>
      </div>

      <div className="alerts-content">
        {isAllClear ? (
          <div className="alerts-empty">
            <div className="empty-icon-wrapper">
              <div className="empty-icon-ring" />
              <CheckCircle2 size={32} strokeWidth={2} className="empty-icon" />
            </div>
            <h4>All systems stable</h4>
            <p>No critical resources currently require your attention.</p>
          </div>
        ) : (
          <div className="alerts-list">
            {activeAlerts.map(alert => (
              <AlertItem
                key={alert._id}
                alert={alert}
                onAcknowledge={handleAcknowledge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}