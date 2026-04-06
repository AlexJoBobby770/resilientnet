import { useEffect, useState, useRef } from 'react';
import api from '../api';
import StatCard from '../components/StatCard';
import ResilienceScore from '../components/ResilienceScore';
import ForecastChart from '../components/ForecastChart';
import ResourceForm from '../components/ResourceForm';
import AlertsPanel from '../components/AlertsPanel';
import { Zap, Droplets, Flame, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Dashboard.css';

gsap.registerPlugin(useGSAP);

const MOCK_RESILIENCE = { overall: 72, energy: 75, water: 60, lpg: 48 };
const MOCK_ALERTS = [];

export default function Dashboard() {
  const [resilience, setResilience] = useState(MOCK_RESILIENCE);
  const [forecast, setForecast]     = useState([]);
  const [alerts, setAlerts]         = useState(MOCK_ALERTS);
  const [loading, setLoading]       = useState(false);
  const pageRef = useRef(null);

  const householdId = 'test123';

  const loadData = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/api/resilience/${householdId}`);
      setResilience(r.data);
      const a = await api.get(`/api/alerts/${householdId}`);
      setAlerts(a.data);
    } catch {
      // keep mock data if API unavailable
    } finally {
      setLoading(false);
    }
  };

  const runForecast = async () => {
    setLoading(true);
    try {
      const f = await api.post(`/api/forecast/trigger/${householdId}`);
      setForecast(f.data.predictions);
      await loadData();
    } catch {
      // keep mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    tl.from('.dashboard-page-title', {
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
      .from('.dashboard-page-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4')
      .from('.dash-divider', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.7,
        ease: 'power3.inOut',
      }, '-=0.2')
      .from('.dash-section', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      }, '-=0.3');
  }, { scope: pageRef });

  const score = resilience?.overall ?? 72;

  return (
    <main className="dashboard" ref={pageRef}>
      <div className="dashboard-body">
        {/* ── Page Header ───────────────────────────────── */}
        <h1 className="dashboard-page-title">Dashboard</h1>
        <p className="dashboard-page-subtitle">
          Monitor household resilience, track resource consumption, and forecast
          future demand across all utility vectors.
        </p>

        <div className="dash-divider" />

        {/* ── Overview Metrics ──────────────────────────── */}
        <section className="dash-section">
          <h2 className="dash-section-title">Overview Metrics</h2>
          <div className="kpi-row">
            <StatCard
              label="Resilience Score"
              value={score}
              delta={score >= 70 ? "Stable" : score >= 40 ? "Warning" : "Critical"}
              deltaDir={score >= 70 ? 'up' : score >= 40 ? 'neutral' : 'down'}
              icon={<TrendingUp size={16} />}
              status={score >= 70 ? 'green' : score >= 40 ? 'amber' : 'red'}
            />
            <StatCard
              label="Energy"
              value={resilience?.energy ?? 75}
              unit="/ 100"
              icon={<Zap size={16} />}
              status={(resilience?.energy ?? 75) >= 70 ? 'green' : (resilience?.energy ?? 75) >= 40 ? 'amber' : 'red'}
            />
            <StatCard
              label="Water"
              value={resilience?.water ?? 60}
              unit="/ 100"
              icon={<Droplets size={16} />}
              status={(resilience?.water ?? 60) >= 70 ? 'green' : (resilience?.water ?? 60) >= 40 ? 'amber' : 'red'}
            />
            <StatCard
              label="LPG"
              value={resilience?.lpg ?? 48}
              unit="/ 100"
              icon={<Flame size={16} />}
              status={(resilience?.lpg ?? 48) >= 70 ? 'green' : (resilience?.lpg ?? 48) >= 40 ? 'amber' : 'red'}
            />
          </div>
        </section>

        {/* ── Main Insight ──────────────────────────────── */}
        <section className="dash-section">
          <h2 className="dash-section-title">Main Insight</h2>
          <p className="dash-section-desc">
            14-day AI-powered consumption forecast paired with your current
            resilience breakdown.
          </p>
          <div className="dash-main-grid">
            <ForecastChart data={forecast} resource="Electricity" />
            <ResilienceScore score={score} breakdown={resilience} />
          </div>
        </section>

        {/* ── Resource Logging & Alerts ──────────────────── */}
        <section className="dash-section">
          <h2 className="dash-section-title">Actions & Alerts</h2>
          <p className="dash-section-desc">
            Log your daily resource usage to feed the AI model, and review any
            active system alerts.
          </p>
          <div className="dash-secondary-grid">
            <ResourceForm householdId={householdId} onSubmit={runForecast} />
            <AlertsPanel alerts={alerts} />
          </div>
        </section>
      </div>
    </main>
  );
}