import { useState } from 'react';
import { Sparkles, X, Copy, Check } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { Modal } from './admin/Modal';

const ENV_SNIPPET = `VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key`;

export function SetupBanner() {
  const configured = isSupabaseConfigured();
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (configured || dismissed) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(ENV_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[60] max-w-sm animate-slide-up sm:bottom-6 sm:right-6">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-white/95 p-4 shadow-lift backdrop-blur">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Sparkles size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-semibold text-ink-900">Demo mode</div>
              <button
                onClick={() => setDismissed(true)}
                className="-mr-1 -mt-1 rounded-full p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-600">
              Supabase isn't connected yet. The site is showing sample data. Add your Supabase URL
              and anon key to enable real bookings and admin.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-ink-800"
              >
                How to connect
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[11px] font-medium text-ink-700 hover:bg-ink-50"
              >
                Continue in demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Connect Supabase"
        description="Add your Supabase URL and anon key — the app will switch to real data automatically."
        size="lg"
        footer={
          <button onClick={() => setOpen(false)} className="btn-primary">
            Got it
          </button>
        }
      >
        <ol className="space-y-4 text-sm text-ink-700">
          <li>
            <div className="font-medium text-ink-900">1. Open your project's <code className="rounded bg-ink-100 px-1.5 py-0.5 text-xs">.env</code> file</div>
            <div className="mt-1 text-ink-500">It lives at the root of this project.</div>
          </li>
          <li>
            <div className="font-medium text-ink-900">2. Paste your Supabase values</div>
            <div className="relative mt-2">
              <pre className="overflow-auto rounded-xl border border-ink-100 bg-ink-50 p-4 text-xs text-ink-800">
{ENV_SNIPPET}
              </pre>
              <button
                onClick={copy}
                className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50"
              >
                {copied ? <Check size={12} className="text-mint-600" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="mt-2 text-xs text-ink-500">
              Find these in your Supabase project under{' '}
              <span className="font-medium text-ink-700">Project Settings → API</span>.
            </div>
          </li>
          <li>
            <div className="font-medium text-ink-900">3. Restart the dev server</div>
            <div className="mt-1 text-ink-500">Stop and re-run <code className="rounded bg-ink-100 px-1.5 py-0.5 text-xs">npm run dev</code> so Vite picks up the new env values.</div>
          </li>
          <li>
            <div className="font-medium text-ink-900">4. You're live</div>
            <div className="mt-1 text-ink-500">
              The site will automatically use your real Supabase data — services, business hours,
              appointments, and admin access — without changing any code.
            </div>
          </li>
        </ol>
      </Modal>
    </>
  );
}
