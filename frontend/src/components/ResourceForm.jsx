import React, { useState, useRef } from 'react';
import { Zap, Droplets, Flame, Calendar, Send, Loader2, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './ResourceForm.css';

gsap.registerPlugin(useGSAP);

const FIELDS = [
  {
    key: 'electricity_kwh',
    label: 'Electricity',
    placeholder: '0.00',
    unit: 'kWh',
    icon: Zap,
    color: '#a78bfa',
    bgColor: 'rgba(167, 139, 250, 0.12)',
  },
  {
    key: 'water_liters',
    label: 'Water',
    placeholder: '0.00',
    unit: 'L',
    icon: Droplets,
    color: '#60a5fa',
    bgColor: 'rgba(96, 165, 250, 0.12)',
  },
  {
    key: 'lpg_kg_remaining',
    label: 'LPG Remaining',
    placeholder: '0.00',
    unit: 'kg',
    icon: Flame,
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.12)',
  },
  {
    key: 'days_since_refill',
    label: 'Days Since Refill',
    placeholder: '0',
    unit: 'days',
    icon: Calendar,
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.12)',
  },
];

export default function ResourceForm({ householdId, onSubmit }) {
  const [form, setForm] = useState({
    electricity_kwh: '',
    water_liters: '',
    lpg_kg_remaining: '',
    days_since_refill: '',
  });

  const [status, setStatus] = useState('idle');

  const cardRef = useRef(null);
  const iconRefs = useRef({});
  const btnRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    tl.from(cardRef.current, {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out"
    });

    tl.from(".form-header-stagger", {
      y: 8,
      opacity: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: "power2.out"
    }, "-=0.4");

    tl.from(".resource-field", {
      y: 15,
      opacity: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: "back.out(1.2)"
    }, "-=0.2");
  }, { scope: cardRef });

  const handleFocus = (key) => {
    gsap.to(iconRefs.current[key], {
      scale: 1.2,
      rotation: key === 'electricity_kwh' ? 12 : key === 'water_liters' ? -8 : 0,
      duration: 0.35,
      ease: "back.out(2.5)"
    });
  };

  const handleBlur = (key) => {
    gsap.to(iconRefs.current[key], {
      scale: 1,
      rotation: 0,
      duration: 0.25,
      ease: "power2.out"
    });
  };

  const handleSubmit = async () => {
    gsap.to(btnRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    setStatus('loading');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');

      gsap.fromTo(btnRef.current,
        { scale: 0.9 },
        { scale: 1.03, backgroundColor: '#34d399', duration: 0.45, ease: "elastic.out(1, 0.5)" }
      );

      onSubmit?.();

      setTimeout(() => {
        gsap.to(btnRef.current, { scale: 1, backgroundColor: '#a78bfa', duration: 0.3 });
        setForm({ electricity_kwh: '', water_liters: '', lpg_kg_remaining: '', days_since_refill: '' });
        setStatus('idle');
      }, 2500);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="resource-form-card" ref={cardRef}>
      <div className="form-header-stagger">
        <h3 className="card-title">Log Daily Usage</h3>
      </div>
      <div className="form-header-stagger">
        <p className="resource-form-desc">
          Enter today's resource consumption to update your AI resilience forecast.
        </p>
      </div>

      <div className="resource-form-grid">
        {FIELDS.map(({ key, label, placeholder, unit, icon: Icon, color, bgColor }) => (
          <div key={key} className="resource-field">
            <label htmlFor={`field-${key}`} className="resource-field-label">
              <div
                className="resource-field-icon-wrap"
                style={{ backgroundColor: bgColor, color: color }}
                ref={el => iconRefs.current[key] = el}
              >
                <Icon size={13} strokeWidth={2.5} />
              </div>
              {label}
            </label>

            <div className="resource-input-wrap">
              <input
                id={`field-${key}`}
                className="resource-input"
                type="number"
                min="0"
                step="any"
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                onFocus={() => handleFocus(key)}
                onBlur={() => handleBlur(key)}
                disabled={status !== 'idle'}
              />
              <div className="resource-unit">
                <span>{unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="resource-form-footer">
        <button
          ref={btnRef}
          className={`btn-submit ${status === 'success' ? 'btn-success' : ''}`}
          onClick={handleSubmit}
          disabled={status !== 'idle'}
        >
          {status === 'loading' ? (
            <div className="btn-content loading">
              <Loader2 size={15} className="spinner" />
              <span>Processing Model...</span>
            </div>
          ) : status === 'success' ? (
            <div className="btn-content success">
              <CheckCircle2 size={17} strokeWidth={2.5} />
              <span>Forecast Updated</span>
            </div>
          ) : (
            <div className="btn-content idle">
              <Send size={15} />
              <span>Submit & Run Forecast</span>
            </div>
          )}

          {status === 'idle' && <div className="btn-glow-layer" />}
        </button>
      </div>
    </div>
  );
}