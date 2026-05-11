import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : (user.email?.[0] ?? '?').toUpperCase();

  const avatar = user.photoURL && !imgError
    ? (
      <img
        src={user.photoURL}
        alt={user.displayName ?? ''}
        onError={() => setImgError(true)}
        className="user-menu-photo"
      />
    )
    : (
      <div className="user-menu-initials">{initials}</div>
    );

  return (
    <div ref={ref} className="user-menu">
      <div className="user-menu-avatar" onClick={() => setOpen(o => !o)}>
        {avatar}
      </div>
      {open && (
        <div className="user-menu-dropdown">
          <div className="user-menu-email">{user.email}</div>
          <button
            className="user-menu-signout"
            onClick={() => { setOpen(false); signOut(); }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
