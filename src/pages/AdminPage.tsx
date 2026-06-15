import { Routes, Route, Link } from 'react-router-dom';
import { Database } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { isSupabaseConfigured } from '../lib/supabase';
import { Login } from '../components/admin/Login';
import { Sidebar, MobileBottomBar } from '../components/admin/Sidebar';
import { Overview } from '../components/admin/Overview';
import { AppointmentsAdmin } from '../components/admin/AppointmentsAdmin';
import { ServicesAdmin } from '../components/admin/ServicesAdmin';
import { BusinessHoursAdmin } from '../components/admin/BusinessHoursAdmin';
import { BlockedDatesAdmin } from '../components/admin/BlockedDatesAdmin';
import { BusinessSettingsAdmin } from '../components/admin/BusinessSettingsAdmin';
import { UnauthorizedScreen } from '../components/admin/UnauthorizedScreen';

export default function AdminPage() {
  // Demo mode: don't run the real auth check, show a friendly placeholder.
  if (!isSupabaseConfigured()) {
    return <AdminDemoScreen />;
  }

  return <AdminApp />;
}

function AdminApp() {
  const { state, user, error, signOut } = useAdminAuth();

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-brand-50/40 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          <div className="text-sm text-ink-500">Verifying access…</div>
        </div>
      </div>
    );
  }

  if (state === 'signed-out') {
    return <Login />;
  }

  if (state === 'unauthorized') {
    return <UnauthorizedScreen user={user} error={error} onSignOut={signOut} />;
  }

  return (
    <div className="flex min-h-screen bg-ink-50/40">
      <Sidebar user={user} onSignOut={signOut} />
      <main className="min-w-0 flex-1 px-5 py-8 pb-24 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-6xl">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="appointments" element={<AppointmentsAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="hours" element={<BusinessHoursAdmin />} />
            <Route path="blocked-dates" element={<BlockedDatesAdmin />} />
            <Route path="settings" element={<BusinessSettingsAdmin />} />
          </Routes>
        </div>
      </main>
      <MobileBottomBar onSignOut={signOut} />
    </div>
  );
}

function AdminDemoScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-brand-50/40 to-white px-6">
      <div className="card max-w-lg p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Database size={22} />
        </div>
        <h1 className="display-heading mt-6 text-2xl">Admin is in demo mode</h1>
        <p className="mt-2 text-sm text-ink-600">
          The dashboard uses Supabase Auth to keep your data secure. Once you add your{' '}
          <span className="font-medium text-ink-900">Supabase URL</span> and{' '}
          <span className="font-medium text-ink-900">anon key</span> to your{' '}
          <code className="rounded bg-ink-100 px-1.5 py-0.5 text-xs">.env</code> file, the real
          admin login and dashboard will appear here automatically — with your real services,
          appointments, business hours, and settings.
        </p>

        <div className="mt-6 rounded-2xl border border-ink-100 bg-ink-50/60 p-4 text-left text-xs text-ink-700">
          <div className="font-medium text-ink-900">What you'll need</div>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Your Supabase project's <span className="font-medium">Project URL</span></li>
            <li>Your <span className="font-medium">anon / publishable key</span></li>
            <li>A row in <code>admin_users</code> linking your Supabase user.id</li>
          </ol>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <Link to="/" className="btn-primary">
            Back to website
          </Link>
          <div className="text-xs text-ink-400">
            The setup banner at the top of the screen has the full instructions.
          </div>
        </div>
      </div>
    </div>
  );
}
