import { useState } from 'react';
import api from '../api';
import { Zap, Droplets, Flame, Calendar, Send, Loader2 } from 'lucide-react';
import './ResourceForm.css';

const FIELDS = [
  {
    key: 'electricity_kwh',
    label: 'Electricity',
    placeholder: '0.00',
    unit: 'kWh',
    icon: Zap,
    type: 'electricity',
  },
  {
    key: 'water_liters',
    label: 'Water',
    placeholder: '0.00',
    unit: 'L',
    icon: Droplets,
    type: 'water',
  },
  {
    key: 'lpg_kg_remaining',
    label: 'LPG Remaining',
    placeholder: '0.00',
    unit: 'kg',
    icon: Flame,
    type: 'lpg',
  },
  {
    key: 'days_since_refill',
    label: 'Days Since Refill',
    placeholder: '0',
    unit: 'days',
    icon: Calendar,
    type: 'days',
  },
];

export default function ResourceForm({ householdId, onSubmit }) {
  const [form, setForm] = useState({
    electricity_kwh: '',
    water_liters: '',
    lpg_kg_remaining: '',
    days_since_refill: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/api/logs', {
        householdId,
        date: new Date(),
        ...Object.fromEntries(
          Object.entries(form).map(([k, v]) => [k, v === '' ? 0 : Number(v)])
        ),
      });
      onSubmit?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const iconColor = { electricity: '#3b82f6', water: '#0891b2', lpg: '#ea580c', days: '#6b7280' };

  return (
    <div className="card resource-form-card">
      <p className="card-title">Log Daily Usage</p>
      <p className="resource-form-desc">Enter today's resource consumption to update your resilience score.</p>

      <div className="resource-form-grid">
        {FIELDS.map(({ key, label, placeholder, unit, icon: Icon, type }) => (
          <div key={key} className="resource-field">
            <label htmlFor={`field-${key}`} className="resource-field-label">
              <span className="resource-field-icon" style={{ color: iconColor[type] }}>
                <Icon size={13} strokeWidth={2.2} />
              </span>
              {label}
            </label>
            <div className="resource-input-wrap">
              <input
                id={`field-${key}`}
                className="input resource-input"
                type="number"
                min="0"
                step="any"
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
              />
              <span className="resource-unit">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="resource-form-footer">
        <button
          id="submit-forecast-btn"
          className="btn btn-primary resource-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <><Loader2 size={14} style={{ animation: 'spin .8s linear infinite' }} /> Processing…</>
            : <><Send size={14} /> Submit & Run Forecast</>
          }
        </button>
      </div>
    </div>
  );
}