import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User | null;
  error?: string | null;
  onSignOut: () => void;
}

export function UnauthorizedScreen({ user, error, onSignOut }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-brand-50/40 to-white px-6">
      <div className="card max-w-md p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
          <ShieldAlert size={22} />
        </div>
        <h1 className="display-heading mt-5 text-2xl">Not authorized</h1>
        <p className="mt-2 text-sm text-ink-600">
          You're signed in as{' '}
          <span className="font-medium text-ink-900">{user?.email}</span>, but this account isn't
          an admin of the cleaning company.
        </p>
        {error && (
          <p className="mt-3 text-xs text-rose-700">{error}</p>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <button onClick={onSignOut} className="btn-primary">
            Sign out
          </button>
          <Link to="/" className="btn-ghost">
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
