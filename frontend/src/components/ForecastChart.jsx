import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import './ForecastChart.css';

/* ── Custom Tooltip ──────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">
        {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          <span className="chart-tooltip-key">{p.name}:</span> {Number(p.value).toFixed(2)}
        </p>
      ))}
    </div>
  );
}

/* ── Mock data (shown when no real data provided) ── */
const MOCK_DATA = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  const base = 4.5 + Math.sin(i * 0.5) * 1.2;
  return {
    ds: date.toISOString(),
    yhat: parseFloat(base.toFixed(2)),
    yhat_upper: parseFloat((base + 0.8).toFixed(2)),
    yhat_lower: parseFloat((base - 0.8).toFixed(2)),
  };
});

export default function ForecastChart({ data = [], resource = 'Electricity' }) {
  const chartData = data.length > 0 ? data : MOCK_DATA;
  const isMock = data.length === 0;

  return (
    <div className="card forecast-card">
      <div className="forecast-header">
        <div>
          <p className="card-title">14-Day Forecast</p>
          <h2 className="forecast-resource">{resource} Usage</h2>
        </div>
        {isMock && (
          <span className="badge badge-blue">Sample Data</span>
        )}
      </div>

      <div className="forecast-chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />

            <XAxis
              dataKey="ds"
              tickFormatter={(d) =>
                new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
              width={36}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            />

            <Line
              type="monotone"
              dataKey="yhat"
              name="Predicted"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="yhat_upper"
              name="Upper"
              stroke="#93c5fd"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="yhat_lower"
              name="Lower"
              stroke="#93c5fd"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}