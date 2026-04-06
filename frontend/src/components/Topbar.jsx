import React, { useEffect, useState, useRef } from 'react';
import { Bell, RefreshCw, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Topbar.css';

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

export default function Topbar({ title = 'Overview', subtitle, onRefresh, loading }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  // Refs for GSAP
  const topbarRef = useRef(null);
  const refreshIconRef = useRef(null);
  const bellIconRef = useRef(null);

  /* ── Live Clock ── */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── 1. Entrance Animation ── */
  useGSAP(() => {
    gsap.from(".topbar-anim", {
      y: -15,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "power3.out",
      clearProps: "transform"
    });
  }, { scope: topbarRef });

  /* ── 2. Refresh Button Physics (Loading State) ── */
  useGSAP(() => {
    let spinTween;

    if (loading && refreshIconRef.current) {
      // Continuous linear spin while loading
      spinTween = gsap.to(refreshIconRef.current, {
        rotation: "+=360",
        duration: 1,
        repeat: -1,
        ease: "none"
      });
    } else if (refreshIconRef.current) {
      // Smoothly stop and snap back to 0
      gsap.killTweensOf(refreshIconRef.current);
      gsap.to(refreshIconRef.current, {
        rotation: 0,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true
      });
    }

    return () => { if (spinTween) spinTween.kill(); };
  }, [loading]);

  /* ── 3. Hover Micro-interactions ── */
  const handleRefreshEnter = () => {
    if (!loading) {
      gsap.to(refreshIconRef.current, { rotation: 45, duration: 0.3, ease: "back.out(2)" });
    }
  };

  const handleRefreshLeave = () => {
    if (!loading) {
      gsap.to(refreshIconRef.current, { rotation: 0, duration: 0.3, ease: "power2.out" });
    }
  };

  const handleBellEnter = () => {
    // Ringing physics
    gsap.to(bellIconRef.current, {
      rotation: 15,
      duration: 0.08,
      yoyo: true,
      repeat: 3,
      ease: "sine.inOut",
      onComplete: () => {
        gsap.to(bellIconRef.current, { rotation: 0, duration: 0.1, ease: "power2.out" });
      }
    });
  };

  return (
    <header className="topbar glass-panel" ref={topbarRef}>

      {/* Left: Branding & Breadcrumbs */}
      <div className="topbar-left">
        <div className="topbar-breadcrumb topbar-anim">
          <span className="breadcrumb-root">ResilientNet</span>
          <ChevronRight size={14} className="breadcrumb-sep" strokeWidth={2.5} />
          <span className={`breadcrumb-node ${!subtitle ? 'breadcrumb-current' : ''}`}>
            {title}
          </span>

          {subtitle && (
            <>
              <ChevronRight size={14} className="breadcrumb-sep" strokeWidth={2.5} />
              <span className="breadcrumb-node breadcrumb-current">{subtitle}</span>
            </>
          )}
        </div>
        <h1 className="topbar-title topbar-anim">{title}</h1>
      </div>

      {/* Right: Tools & Clock */}
      <div className="topbar-right">

        {/* Live Clock */}
        <div className="topbar-clock topbar-anim">
          <span className="topbar-clock-date">{date}</span>
          <div className="topbar-clock-sep" />
          <span className="topbar-clock-time">{time}</span>
        </div>

        {/* Action: Refresh */}
        {onRefresh && (
          <div className="topbar-anim">
            <button
              className={`topbar-btn ${loading ? 'is-loading' : ''}`}
              onClick={onRefresh}
              onMouseEnter={handleRefreshEnter}
              onMouseLeave={handleRefreshLeave}
              title="Refresh data"
            >
              <div ref={refreshIconRef} className="icon-wrapper">
                <RefreshCw size={16} strokeWidth={2.5} />
              </div>
            </button>
          </div>
        )}

        <div className="topbar-divider topbar-anim" />

        {/* Action: Notifications */}
        <div className="topbar-notif-wrap topbar-anim">
          <button
            className="topbar-btn"
            title="Notifications"
            onMouseEnter={handleBellEnter}
          >
            <div ref={bellIconRef} className="icon-wrapper">
              <Bell size={16} strokeWidth={2.5} />
            </div>
          </button>
          <span className="topbar-notif-dot" />
        </div>

      </div>
    </header>
  );
}