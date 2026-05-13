import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

type IMode = 'signin' | 'signup';

export default function LoginPage() {
  const { user, signIn, signInWithEmail, signUpWithEmail } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState<IMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const friendlyError = (msg: string): string => {
    if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
      return t('loginPage.errorInvalidCredential');
    }
    if (msg.includes('email-already-in-use')) {
      return t('loginPage.errorEmailInUse');
    }
    if (msg.includes('weak-password')) {
      return t('loginPage.errorWeakPassword');
    }
    if (msg.includes('invalid-email')) {
      return t('loginPage.errorInvalidEmail');
    }
    return t('loginPage.errorGeneric');
  };

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
      <Topbar />

      <div className="login-content">
        <div className="login-card">
          <div className="login-brand">
            <div className="brand-mark login-brand-mark">F</div>
            <h1 className="login-title">Fuse Box</h1>
            <p className="login-sub">{t('topbar.brandSub')}</p>
          </div>

          <ul className="login-features">
            <li>{t('loginPage.featureMap')}</li>
            <li>{t('loginPage.featureTrack')}</li>
            <li>{t('loginPage.featureManage')}</li>
          </ul>

          <form className="login-email-form" onSubmit={handleEmailSubmit} noValidate>
            <input
              className="login-input"
              type="email"
              placeholder={t('loginPage.emailPlaceholder')}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder={t('loginPage.passwordPlaceholder')}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="login-error">{error}</p>}
            <button className="login-btn" type="submit" disabled={busy}>
              {busy ? t('loginPage.pleaseWait') : mode === 'signin' ? t('loginPage.signIn') : t('loginPage.createAccount')}
            </button>
          </form>

          <div className="login-mode-toggle">
            {mode === 'signin' ? (
              <>
                {t('loginPage.noAccount')}{' '}
                <button className="login-link-btn" onClick={() => { setMode('signup'); setError(''); }}>
                  {t('loginPage.signUp')}
                </button>
              </>
            ) : (
              <>
                {t('loginPage.alreadyHaveOne')}{' '}
                <button className="login-link-btn" onClick={() => { setMode('signin'); setError(''); }}>
                  {t('loginPage.signIn')}
                </button>
              </>
            )}
          </div>

          <div className="login-divider"><span>{t('loginPage.or')}</span></div>

          <button className="login-btn login-btn-google" onClick={signIn}>
            {t('loginPage.signInWithGoogle')}
          </button>
          <button className="login-btn-back" onClick={() => window.history.back()}>
            {t('loginPage.goBack')}
          </button>
        </div>
      </div>
    </div>
  );
}
