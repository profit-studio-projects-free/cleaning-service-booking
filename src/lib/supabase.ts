import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Returns true only when both env values are present, not placeholders,
 * and the URL is structurally valid.
 *
 * IMPORTANT: This is only used to decide whether to build a real Supabase
 * client or a no-op stub. When this returns true, the rest of the app uses
 * the real Supabase client with the exact same logic as before.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  const placeholder = /paste_your|your_supabase|your-supabase|example\.com/i;
  if (placeholder.test(supabaseUrl) || placeholder.test(supabaseAnonKey)) return false;
  try {
    const u = new URL(supabaseUrl);
    if (!/^https?:$/.test(u.protocol)) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Stub client used only when Supabase env values are missing or invalid.
 * It mimics the parts of the supabase-js surface area the app touches and
 * resolves every query to a safe empty payload so the UI never crashes.
 *
 * The real Supabase client is created and used unchanged when env is valid.
 */
function createStubClient(): SupabaseClient {
  // A chainable query builder where every method returns the same thenable
  // and `await` on it resolves to { data: [], error: null }.
  const makeChain = (): any => {
    const promise: Promise<{ data: any; error: any }> = Promise.resolve({
      data: [],
      error: null,
    });

    const handler: ProxyHandler<any> = {
      get(_target, prop: string) {
        if (prop === 'then') return promise.then.bind(promise);
        if (prop === 'catch') return promise.catch.bind(promise);
        if (prop === 'finally') return promise.finally.bind(promise);
        if (prop === 'maybeSingle' || prop === 'single') {
          return () =>
            Promise.resolve({
              data: null,
              error: null,
            });
        }
        // Any other call (.select, .insert, .update, .delete, .eq, .order, .limit, ...)
        return () => makeChain();
      },
    };
    return new Proxy(function () {}, handler);
  };

  const noAuthError = {
    name: 'SupabaseNotConfigured',
    message:
      'Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env to enable login.',
    status: 0,
  };

  const stub = {
    from: (_table: string) => makeChain(),
    rpc: () => Promise.resolve({ data: null, error: null }),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: noAuthError,
      }),
      signUp: async () => ({ data: { user: null, session: null }, error: noAuthError }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (_cb: any) => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  } as unknown as SupabaseClient;

  return stub;
}

export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createStubClient();

if (!isSupabaseConfigured()) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Lumen & Bloom] Supabase env vars are missing or use placeholder values. ' +
      'The site is running in demo mode. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
      'to your .env to enable the real backend.'
  );
}
