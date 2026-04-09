import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Check, Shield, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Login.css';

gsap.registerPlugin(useGSAP);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/* ── Animated Background ──────────────────────────────── */
const AnimatedBackground = () => {
    const bgRef = useRef(null);
    const orbsRef = useRef([]);

    useGSAP(() => {
        orbsRef.current.forEach((orb, i) => {
            gsap.to(orb, {
                y: 'random(-25, 25)',
                x: 'random(-25, 25)',
                rotation: 'random(-10, 10)',
                duration: 'random(5, 9)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.5,
            });
        });

        const xTo = gsap.quickTo(bgRef.current, 'x', { duration: 0.8, ease: 'power3.out' });
        const yTo = gsap.quickTo(bgRef.current, 'y', { duration: 0.8, ease: 'power3.out' });

        const handleMouseMove = (e) => {
            const x = (e.clientX - window.innerWidth / 2) * -0.03;
            const y = (e.clientY - window.innerHeight / 2) * -0.03;
            xTo(x);
            yTo(y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
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
        tl.from('.brand-logo', { y: 15, opacity: 0, duration: 0.7, ease: 'power3.out' })
            .from('.brand-word', { y: 30, opacity: 0, rotationX: -30, duration: 0.7, stagger: 0.06, ease: 'back.out(1.2)' }, '-=0.3')
            .from('.brand-tagline', { y: 15, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
            .from('.brand-feature', { x: -15, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.3')
            .from('.brand-bg-word', { opacity: 0, y: 40, duration: 1, stagger: 0.15, ease: 'power3.out' }, '-=0.8');
    }, { scope: brandRef });

    return (
        <div className="brand-panel" ref={brandRef}>
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
                {['Monitor', 'smarter.', 'Predict', 'earlier.', 'Act', 'faster.'].map((word, i) => (
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

/* ── Main Login Component ─────────────────────────────── */
function LoginContent() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const containerRef = useRef(null);
    const formCardRef = useRef(null);
    const demoBtnRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.1 });
        tl.to(containerRef.current, { opacity: 1, duration: 0.1 })
            .from(formCardRef.current, { y: 45, opacity: 0, scale: 0.97, duration: 0.9, ease: 'expo.out' })
            .from('.form-element', { y: 15, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' }, '-=0.5');
    }, { scope: containerRef });

    const handleHoverEnter = (ref) => gsap.to(ref.current, { y: -2, duration: 0.2, ease: 'power2.out' });
    const handleHoverLeave = (ref) => gsap.to(ref.current, { y: 0, duration: 0.25, ease: 'power2.out' });

    /**
     * Called by GoogleLogin's onSuccess callback.
     * Sends the Google credential token to our backend.
     */
    const handleGoogleSuccess = async (credentialResponse) => {
        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`,
                { token: credentialResponse.credential }
            );

            // Persist JWT and user info
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            setStatus('success');

            // Animate success then redirect
            gsap.timeline()
                .to('.form-element:not(.google-btn-wrapper)', { opacity: 0, y: -8, duration: 0.25, stagger: 0.04 })
                .to(formCardRef.current, { scale: 1.02, duration: 0.3, ease: 'back.out(1.5)' })
                .call(() => setTimeout(() => navigate('/dashboard'), 250));

        } catch (err) {
            setStatus('error');
            const msg = err.response?.data?.message || 'Authentication failed. Please try again.';
            setErrorMsg(msg);

            // Shake the card on error
            gsap.timeline()
                .to(formCardRef.current, { x: -8, duration: 0.08 })
                .to(formCardRef.current, { x: 8, duration: 0.08 })
                .to(formCardRef.current, { x: -5, duration: 0.06 })
                .to(formCardRef.current, { x: 0, duration: 0.06 });
        }
    };

    const handleGoogleError = () => {
        setStatus('error');
        setErrorMsg('Google sign-in was cancelled or failed. Please try again.');
    };

    const handleDemoLogin = () => {
        // Bypass auth for demo — sets a mock token so api.js doesn't redirect
        localStorage.setItem('token', 'demo-mode');
        localStorage.setItem('user', JSON.stringify({ name: 'Demo User', email: 'demo@resilientnet.app' }));

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

                        {/* Header */}
                        <div className="auth-header form-element">
                            <span className="login-card-eyebrow">Secure Access</span>
                            <h2>Welcome back</h2>
                            <p>Sign in to your ResilientNet dashboard</p>
                        </div>

                        {/* Divider */}
                        <div className="login-divider form-element">
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                            <span style={{ padding: '0 1rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                sign in with
                            </span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                        </div>

                        {/* Error Banner */}
                        {status === 'error' && errorMsg && (
                            <div className="form-element auth-error-banner">
                                <AlertCircle size={15} />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

                            {/* Google Login Button */}
                            <div className="form-element google-btn-wrapper">
                                {status === 'success' ? (
                                    <div className="auth-success-pill">
                                        <Check size={16} strokeWidth={3} />
                                        <span>Verified — redirecting…</span>
                                    </div>
                                ) : status === 'loading' ? (
                                    <div className="auth-loading-pill">
                                        <Loader2 size={16} className="spinner" />
                                        <span>Authenticating…</span>
                                    </div>
                                ) : (
                                    /* Render the real GoogleLogin button from @react-oauth/google */
                                    <div className="google-login-wrap">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            theme="filled_black"
                                            size="large"
                                            width="100%"
                                            text="continue_with"
                                            shape="rectangular"
                                            logo_alignment="left"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Demo Button */}
                            {status !== 'success' && (
                                <div className="form-element">
                                    <button
                                        ref={demoBtnRef}
                                        onClick={handleDemoLogin}
                                        onMouseEnter={() => handleHoverEnter(demoBtnRef)}
                                        onMouseLeave={() => handleHoverLeave(demoBtnRef)}
                                        disabled={status === 'loading'}
                                        className="auth-demo-btn"
                                    >
                                        View Demo Dashboard
                                        <ArrowRight size={17} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {status !== 'success' && (
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

/* ── Exported Page: wraps with GoogleOAuthProvider ────── */
export default function LoginPage() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <LoginContent />
        </GoogleOAuthProvider>
    );
}