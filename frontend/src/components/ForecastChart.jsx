import React, { useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './ForecastChart.css';

gsap.registerPlugin(useGSAP);

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="premium-tooltip">
      <p className="premium-tooltip-date">
        {new Date(label).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </p>
      <div className="premium-tooltip-metrics">
        {payload.map((p, i) => (
          <div key={i} className="metric-row">
            <div className="metric-indicator" style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}60` }} />
            <span className="metric-name">{p.name}</span>
            <span className="metric-value">
              {Number(p.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const cardRef = useRef(null);
  const chartWrapRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    tl.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    });

    tl.from(".stagger-header", {
      y: 12,
      opacity: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: "power2.out"
    }, "-=0.4");

    tl.fromTo(chartWrapRef.current,
      { clipPath: "inset(0% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.inOut" },
      "-=0.2"
    );
  }, { scope: cardRef, dependencies: [chartData] });

  return (
    <div
      className="forecast-card"
      ref={cardRef}
    >
      <div className="forecast-header">
        <div className="header-text-group">
          <div className="stagger-header title-row">
            <TrendingUp size={17} className="icon-accent" />
            <p className="card-eyebrow">14-Day Forecast</p>
          </div>
          <h2 className="forecast-resource stagger-header">{resource} Usage</h2>
        </div>

        <div className="header-badges stagger-header">
          {isMock && (
            <span className="badge-demo">
              <Info size={11} /> Sample Data
            </span>
          )}
          <div className="live-pulse-indicator">
            <div className="pulse-dot" />
            <span>Live AI Model</span>
          </div>
        </div>
      </div>

      <div className="forecast-chart-wrap" ref={chartWrapRef}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="ds"
              tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />

            <YAxis
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={40}
              dx={-10}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(167,139,250,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />

            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,.5)', paddingTop: '16px' }}
            />

            <Line
              type="monotone"
              dataKey="yhat_lower"
              name="Lower Bound"
              stroke="#818cf8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
              opacity={0.4}
            />

            <Line
              type="monotone"
              dataKey="yhat_upper"
              name="Upper Bound"
              stroke="#818cf8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
              opacity={0.4}
            />

            <Line
              type="monotone"
              dataKey="yhat"
              name="Predicted"
              stroke="#a78bfa"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, stroke: '#08060e', strokeWidth: 2, fill: '#a78bfa' }}
              style={{ filter: "drop-shadow(0px 6px 8px rgba(167, 139, 250, 0.3))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}