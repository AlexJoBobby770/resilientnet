import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, ArrowRight, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Login.css';

gsap.registerPlugin(useGSAP);

/* ── Animated Background ──────────────────────────────── */
const AnimatedBackground = () => {
  const bgRef = useRef(null);
  const orbsRef = useRef([]);

  useGSAP(() => {
    orbsRef.current.forEach((orb, i) => {
      gsap.to(orb, {
        y: "random(-25, 25)",
        x: "random(-25, 25)",
        rotation: "random(-10, 10)",
        duration: "random(5, 9)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.5,
      });
    });

    const xTo = gsap.quickTo(bgRef.current, "x", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(bgRef.current, "y", { duration: 0.8, ease: "power3.out" });

    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) * -0.03;
      const y = (e.clientY - window.innerHeight / 2) * -0.03;
      xTo(x);
      yTo(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bg-container">
      <div className="bg-grid-overlay" />
      <div className="bg-parallax-layer" ref={bgRef}>
        <div className="bg-orb bg-orb-1" ref={(el) => (orbsRef.current[0] = el)} />
        <div className="bg-orb bg-orb-2" ref={(el) => (orbsRef.current[1] = el)} />
        <div className="bg-orb bg-orb-3" ref={(el) => (orbsRef.current[2] = el)} />
      </div>
    </div>
  );
};

/* ── Brand Panel (Left 60%) ───────────────────────────── */
const BrandPanel = () => {
  const brandRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.from(".brand-logo", { y: 15, opacity: 0, duration: 0.7, ease: "power3.out" })
      .from(".brand-word", {
        y: 30,
        opacity: 0,
        rotationX: -30,
        duration: 0.7,
        stagger: 0.06,
        ease: "back.out(1.2)"
      }, "-=0.3")
      .from(".brand-tagline", { y: 15, opacity: 0, duration: 0.7, ease: "power2.out" }, "-=0.4")
      .from(".brand-feature", { x: -15, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "-=0.3")
      .from(".brand-bg-word", { opacity: 0, y: 40, duration: 1, stagger: 0.15, ease: "power3.out" }, "-=0.8");
  }, { scope: brandRef });

  return (
    <div className="brand-panel" ref={brandRef}>
      {/* Giant faded words */}
      <div className="brand-bg-words">
        <span className="brand-bg-word">Monitor</span>
        <span className="brand-bg-word">Predict</span>
        <span className="brand-bg-word">Protect</span>
      </div>

      <div className="brand-logo">
        <Shield className="logo-icon" size={26} />
        <span className="logo-text">ResilientNet</span>
      </div>

      <h1 className="brand-headline">
        {["Monitor", "smarter.", "Predict", "earlier.", "Act", "faster."].map((word, i) => (
          <span key={i} className="brand-word">{word}&nbsp;</span>
        ))}
      </h1>

      <p className="brand-tagline">
        AI-powered household resource intelligence. Track consumption, forecast demand,
        and build resilience across your entire utility infrastructure.
      </p>

      <div className="brand-features">
        {['Predictive AI Forecasting', 'Real-time Resilience Scoring', 'Smart Alert System'].map((feat, i) => (
          <div key={i} className="brand-feature">
            <Check size={15} className="feature-icon" />
            <span>{feat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Login Component ──────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const containerRef = useRef(null);
  const formCardRef = useRef(null);
  const googleBtnRef = useRef(null);
  const demoBtnRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(containerRef.current, { opacity: 1, duration: 0.1 })
      .from(formCardRef.current, {
        y: 45,
        opacity: 0,
        scale: 0.97,
        duration: 0.9,
        ease: "expo.out"
      })
      .from(".form-element", {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power3.out"
      }, "-=0.5");
  }, { scope: containerRef });

  const handleHoverEnter = (ref) => gsap.to(ref.current, { y: -2, duration: 0.2, ease: "power2.out" });
  const handleHoverLeave = (ref) => gsap.to(ref.current, { y: 0, duration: 0.25, ease: "power2.out" });

  const handleGoogleLogin = () => {
    setLoading(true);
    gsap.to(googleBtnRef.current, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      const tl = gsap.timeline();
      tl.to(".form-element:not(.google-btn-wrapper)", { opacity: 0, y: -8, duration: 0.25, stagger: 0.04 })
        .to(googleBtnRef.current, {
          scale: 1.03,
          duration: 0.45,
          ease: "back.out(1.5)",
          onComplete: () => {
            setTimeout(() => navigate('/introduction'), 300);
          }
        });
    }, 1500);
  };

  const handleDemoLogin = () => {
    const tl = gsap.timeline({ onComplete: () => navigate('/introduction') });
    tl.to(demoBtnRef.current, { scale: 0.96, duration: 0.1, ease: 'power1.in' })
      .to(demoBtnRef.current, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.5)' });
  };

  return (
    <div className="auth-layout" ref={containerRef} style={{ opacity: 0 }}>
      <AnimatedBackground />

      <div className="auth-container">
        <BrandPanel />

        <div className="auth-form-side">
          <div className="auth-card" ref={formCardRef}>

            <div className="auth-header form-element">
              <span className="login-card-eyebrow">Secure Access</span>
              <h2>Welcome back</h2>
              <p>Sign in to your ResilientNet dashboard</p>
            </div>

            <div className="login-divider form-element">
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ padding: '0 1rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>sign in with</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-element google-btn-wrapper">
                <button
                  ref={googleBtnRef}
                  onClick={handleGoogleLogin}
                  onMouseEnter={() => handleHoverEnter(googleBtnRef)}
                  onMouseLeave={() => handleHoverLeave(googleBtnRef)}
                  disabled={loading || success}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '13px 20px',
                    background: success ? '#34d399' : 'rgba(255,255,255,0.06)',
                    color: success ? '#05010a' : '#ffffff',
                    border: `1px solid ${success ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '12px', fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer',
                    boxShadow: success ? '0 4px 16px rgba(52, 211, 153, 0.25)' : 'none',
                    transition: 'all 0.3s ease', fontFamily: 'inherit'
                  }}
                >
                  {loading ? (
                    <Loader2 className="spinner" size={18} />
                  ) : success ? (
                    <><Check size={18} /> Verified</>
                  ) : (
                    <>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>
              </div>

              {!success && (
                <div className="form-element">
                  <button
                    ref={demoBtnRef}
                    onClick={handleDemoLogin}
                    onMouseEnter={() => handleHoverEnter(demoBtnRef)}
                    onMouseLeave={() => handleHoverLeave(demoBtnRef)}
                    disabled={loading}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px 20px',
                      background: '#a78bfa', color: '#05010a', border: 'none',
                      borderRadius: '12px', fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(167, 139, 250, 0.2)',
                      transition: 'all 0.3s ease', fontFamily: 'inherit'
                    }}
                  >
                    View Demo Dashboard
                    <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </div>

            {!success && (
              <p className="auth-footer form-element">
                By continuing you agree to our terms of service.<br />
                No account needed for demo access.
              </p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}