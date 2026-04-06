import React, { useRef } from 'react';
import { Zap, Droplets, Flame, Activity } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './ResilienceScore.css';

gsap.registerPlugin(useGSAP);

function getStatus(score) {
  if (score >= 70) return 'success';
  if (score >= 40) return 'warning';
  return 'critical';
}

function getLabel(score) {
  if (score >= 70) return 'Stable';
  if (score >= 40) return 'Warning';
  return 'Critical';
}

function MetricBar({ label, value, icon: Icon, colorCls }) {
  const numRef = useRef(null);

  return (
    <div className="rs-metric hover-lift">
      <div className="rs-metric-header">
        <div className={`rs-metric-icon rs-metric-icon--${colorCls}`}>
          <Icon size={11} strokeWidth={2.5} />
        </div>
        <span className="rs-metric-label">{label}</span>
        <span
          className="rs-metric-value metric-number"
          ref={numRef}
          data-target={value}
        >
          0
        </span>
      </div>
      <div className="rs-bar-track">
        <div
          className={`rs-bar-fill rs-bar-fill--${colorCls}`}
          data-width={`${Math.min(value, 100)}%`}
          style={{ width: '0%' }}
        />
      </div>
    </div>
  );
}

export default function ResilienceScore({ score = 72, breakdown = {} }) {
  const cardRef = useRef(null);
  const mainScoreRef = useRef(null);

  const cls = getStatus(score);
  const label = getLabel(score);

  const radius = 60;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  const energy = breakdown.energy ?? 75;
  const water = breakdown.water ?? 60;
  const lpg = breakdown.lpg ?? 48;

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    tl.from(cardRef.current, {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    });

    tl.fromTo(".rs-gauge-arc",
      { strokeDashoffset: circ },
      { strokeDashoffset: offset, duration: 1.4, ease: "power3.out" },
      "-=0.3"
    );

    gsap.to({ val: 0 }, {
      val: score,
      duration: 1.4,
      ease: "power3.out",
      onUpdate: function () {
        if (mainScoreRef.current) {
          mainScoreRef.current.innerText = Math.round(this.targets()[0].val);
        }
      }
    });

    tl.to(".rs-bar-fill", {
      width: (i, el) => el.dataset.width,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out"
    }, "-=1");

    const subMetrics = gsap.utils.toArray('.metric-number');
    subMetrics.forEach((el, i) => {
      const targetVal = parseFloat(el.dataset.target);
      gsap.to({ val: 0 }, {
        val: targetVal,
        duration: 0.9,
        delay: 0.35 + (i * 0.12),
        ease: "power3.out",
        onUpdate: function () {
          el.innerText = Math.round(this.targets()[0].val);
        }
      });
    });

    tl.from(".rs-fade-in", {
      opacity: 0,
      y: 8,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out"
    }, "-=0.8");

  }, { scope: cardRef, dependencies: [score, breakdown] });

  return (
    <div className="rs-card" ref={cardRef}>
      <div className="rs-header rs-fade-in">
        <Activity size={17} className="rs-header-icon" />
        <h3 className="rs-card-title">Resilience Score</h3>
      </div>

      <div className="rs-gauge-wrap">
        <svg className="rs-gauge-svg" viewBox="0 0 150 150">
          <circle className="rs-gauge-track" cx="75" cy="75" r={radius} />
          <circle
            className={`rs-gauge-arc rs-gauge-arc--${cls}`}
            cx="75" cy="75" r={radius}
            strokeDasharray={circ}
            strokeDashoffset={circ}
            strokeLinecap="round"
          />
        </svg>
        <div className="rs-gauge-inner">
          <span className={`rs-score-number rs-score-number--${cls}`} ref={mainScoreRef}>0</span>
          <span className={`rs-score-label rs-score-label--${cls} rs-fade-in`}>{label}</span>
        </div>
      </div>

      <div className="rs-divider rs-fade-in" />

      <div className="rs-metrics">
        <MetricBar label="Energy Grid" value={energy} icon={Zap} colorCls={getStatus(energy)} />
        <MetricBar label="Water Supply" value={water} icon={Droplets} colorCls={getStatus(water)} />
        <MetricBar label="LPG Levels" value={lpg} icon={Flame} colorCls={getStatus(lpg)} />
      </div>
    </div>
  );
}