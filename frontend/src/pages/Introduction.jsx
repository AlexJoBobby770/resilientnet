import React, { useRef } from 'react';
import { Activity, BarChart3, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Introduction.css';

gsap.registerPlugin(useGSAP);

const FEATURES = [
  {
    icon: Activity,
    badge: 'All Resources',
    title: 'AI-Powered Forecasting',
    desc: 'Leverage machine learning models to predict energy, water, and LPG consumption patterns 14 days into the future.',
  },
  {
    icon: BarChart3,
    badge: 'Real-time',
    title: 'Resilience Analytics',
    desc: 'Real-time scoring engine that evaluates your household infrastructure resilience across all utility vectors.',
  },
  {
    icon: ShieldCheck,
    badge: 'Proactive',
    title: 'Smart Alert System',
    desc: 'Proactive notifications with AI-generated recommendations when resource levels approach critical thresholds.',
  },
];

const BULLETS = [
  {
    bold: 'Stop guessing.',
    text: 'Every component is optimized for accuracy and tested across real household scenarios.',
  },
  {
    bold: 'Act with confidence.',
    text: 'Battle-tested forecasts that look sharp and work reliably out of the box.',
  },
  {
    bold: 'Own your data.',
    text: 'All insights generated locally. No cloud dependency, no runtime overhead.',
  },
];

export default function Introduction() {
  const pageRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.15 });

    tl.from('.intro-title', {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    })
      .from('.intro-description', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
      }, '-=0.3')
      .from('.intro-divider', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.6,
        ease: 'power3.inOut',
      }, '-=0.2')
      .from('.intro-section', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power3.out',
      }, '-=0.3')
      .from('.intro-bullet', {
        x: -10,
        opacity: 0,
        duration: 0.35,
        stagger: 0.06,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.intro-card', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
      }, '-=0.2');
  }, { scope: pageRef });

  return (
    <main className="intro-page" ref={pageRef}>
      {/* ── Hero ─────────────────────────────────────── */}
      <h1 className="intro-title">Introduction</h1>
      <p className="intro-description">
        AI-powered household resource intelligence. Monitor consumption,
        forecast demand, and build resilience. One platform, lifetime access.
      </p>

      <div className="intro-divider" />

      {/* ── Why ResilientNet ─────────────────────────── */}
      <section className="intro-section">
        <h2 className="intro-section-title">Why ResilientNet?</h2>
        <p className="intro-section-text">
          Building reliable infrastructure from scratch takes months. ResilientNet gives you
          production-ready intelligence so you can protect your household in days, not months.
        </p>
        <ul className="intro-bullets">
          {BULLETS.map((b, i) => (
            <li key={i} className="intro-bullet">
              <span className="intro-bullet-check">✓</span>
              <div>
                <strong>{b.bold}</strong>{' '}
                <span>{b.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── What's Included ──────────────────────────── */}
      <section className="intro-section intro-cards-section">
        <h2 className="intro-section-title">What's Included</h2>
        <div className="intro-cards-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="intro-card">
              <div className="intro-card-top">
                <div className="intro-card-icon">
                  <f.icon size={18} strokeWidth={1.8} />
                </div>
                <span className="intro-card-badge">{f.badge}</span>
              </div>
              <h3 className="intro-card-title">{f.title}</h3>
              <p className="intro-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="intro-footer-note">
          New features and models added monthly — all included with your access.
        </p>
      </section>
    </main>
  );
}
