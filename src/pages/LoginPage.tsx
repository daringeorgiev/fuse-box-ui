import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, signIn } = useAuth();

  if (user) return <Navigate to="/" replace />;

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

          <button className="login-btn" onClick={signIn}>
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
