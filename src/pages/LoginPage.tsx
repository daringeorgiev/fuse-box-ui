import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type IMode = 'signin' | 'signup';

export default function LoginPage() {
  const { user, signIn, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<IMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleEmailSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setError(friendlyError(msg));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <header className="topbar">
        <Link to="/" className="brand">
          <div className="brand-mark">F</div>
          <span className="brand-name">Fuse Box</span>
          <span className="brand-sub">Panel Configurator</span>
        </Link>
      </header>

      <div className="login-content">
        <div className="login-card">
          <div className="login-brand">
            <div className="brand-mark login-brand-mark">F</div>
            <h1 className="login-title">Fuse Box</h1>
            <p className="login-sub">Panel Configurator</p>
          </div>

          <ul className="login-features">
            <li>Map every circuit to a slot and label it clearly</li>
            <li>Track amp ratings and visualize load at a glance</li>
            <li>Manage multiple panels from one place</li>
          </ul>

          <form className="login-email-form" onSubmit={handleEmailSubmit} noValidate>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="login-error">{error}</p>}
            <button className="login-btn" type="submit" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="login-mode-toggle">
            {mode === 'signin' ? (
              <>
                No account?{' '}
                <button className="login-link-btn" onClick={() => { setMode('signup'); setError(''); }}>
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have one?{' '}
                <button className="login-link-btn" onClick={() => { setMode('signin'); setError(''); }}>
                  Sign in
                </button>
              </>
            )}
          </div>

          <div className="login-divider"><span>or</span></div>

          <button className="login-btn login-btn-google" onClick={signIn}>
            Sign in with Google
          </button>
          <button className="login-btn-back" onClick={() => window.history.back()}>
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

function friendlyError(msg: string): string {
  if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
    return 'Incorrect email or password.';
  }
  if (msg.includes('email-already-in-use')) {
    return 'An account with this email already exists.';
  }
  if (msg.includes('weak-password')) {
    return 'Password must be at least 6 characters.';
  }
  if (msg.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  return 'Something went wrong. Please try again.';
}
