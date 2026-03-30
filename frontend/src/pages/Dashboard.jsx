import { useEffect, useState } from 'react';
import api from '../api';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import ResilienceScore from '../components/ResilienceScore';
import ForecastChart from '../components/ForecastChart';
import ResourceForm from '../components/ResourceForm';
import AlertsPanel from '../components/AlertsPanel';
import { Zap, Droplets, Flame, TrendingUp } from 'lucide-react';
import './Dashboard.css';

/* Mock data for UI demonstrations */
const MOCK_RESILIENCE = { overall: 72, energy: 75, water: 60, lpg: 48 };
const MOCK_ALERTS = [];

export default function Dashboard() {
  const [resilience, setResilience] = useState(MOCK_RESILIENCE);
  const [forecast, setForecast]     = useState([]);
  const [alerts, setAlerts]         = useState(MOCK_ALERTS);
  const [loading, setLoading]       = useState(false);

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

  const score = resilience?.overall ?? 72;

  return (
    <main className="dashboard">
      <Topbar
        title="Overview"
        subtitle="Household · test123"
        onRefresh={loadData}
        loading={loading}
      />

      <div className="dashboard-body">
        {/* ── KPI row ─────────────────────────────────── */}
        <section className="kpi-row">
          <StatCard
            label="Resilience Score"
            value={score}
            delta={score >= 70 ? "Stable" : score >= 40 ? "Warning" : "Critical"}
            deltaDir={score >= 70 ? 'up' : score >= 40 ? 'neutral' : 'down'}
            icon={<TrendingUp size={14} />}
            status={score >= 70 ? 'green' : score >= 40 ? 'orange' : 'red'}
          />
          <StatCard
            label="Energy"
            value={resilience?.energy ?? 75}
            unit="/ 100"
            icon={<Zap size={14} />}
            status={(resilience?.energy ?? 75) >= 70 ? 'green' : (resilience?.energy ?? 75) >= 40 ? 'orange' : 'red'}
          />
          <StatCard
            label="Water"
            value={resilience?.water ?? 60}
            unit="/ 100"
            icon={<Droplets size={14} />}
            status={(resilience?.water ?? 60) >= 70 ? 'green' : (resilience?.water ?? 60) >= 40 ? 'orange' : 'red'}
          />
          <StatCard
            label="LPG"
            value={resilience?.lpg ?? 48}
            unit="/ 100"
            icon={<Flame size={14} />}
            status={(resilience?.lpg ?? 48) >= 70 ? 'green' : (resilience?.lpg ?? 48) >= 40 ? 'orange' : 'red'}
          />
        </section>

        {/* ── Main grid ────────────────────────────────── */}
        <section className="main-grid">
          {/* Left column */}
          <div className="left-col">
            <ResilienceScore score={score} breakdown={resilience} />
            <AlertsPanel alerts={alerts} />
          </div>

          {/* Right column */}
          <div className="right-col">
            <ForecastChart data={forecast} resource="Electricity" />
            <ResourceForm householdId={householdId} onSubmit={runForecast} />
          </div>
        </section>
      </div>
    </main>
  );
}