import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, signIn } = useAuth();

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4 text-center" style={{ width: 340 }}>
        <h4 className="mb-1">Fuse Box</h4>
        <p className="text-muted mb-4">Sign in to manage your panels</p>
        <button className="btn btn-dark w-100" onClick={signIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
