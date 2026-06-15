import { useEffect, useRef, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AdminState = 'loading' | 'signed-out' | 'unauthorized' | 'admin';

export interface UseAdminAuthResult {
  state: AdminState;
  user: User | null;
  session: Session | null;
  error: string | null;
  signOut: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthResult {
  const [state, setState] = useState<AdminState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const checkedFor = useRef<string | null>(null);

  async function verifyAdmin(currentUser: User) {
    try {
      const { data, error: queryErr } = await supabase
        .from('admin_users')
        .select('id, user_id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (queryErr) {
        // Don't sign out on transient query errors — keep the session, surface a soft message.
        setError(queryErr.message);
        setState('unauthorized');
        return;
      }

      if (data) {
        setError(null);
        setState('admin');
      } else {
        setError(null);
        setState('unauthorized');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      setState('unauthorized');
    }
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!mounted) return;

        if (!sessionData.session) {
          setSession(null);
          setUser(null);
          setState('signed-out');
          return;
        }

        setSession(sessionData.session);

        const { data: userData } = await supabase.auth.getUser();
        if (!mounted) return;

        const currentUser = userData.user;
        if (!currentUser) {
          setState('signed-out');
          return;
        }
        setUser(currentUser);
        checkedFor.current = currentUser.id;
        await verifyAdmin(currentUser);
      } catch (e) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : 'Unknown error';
        setError(msg);
        setState('signed-out');
      } finally {
        // Ensure loading state never gets stuck — state is set above.
      }
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);

      if (event === 'SIGNED_OUT' || !newSession) {
        setUser(null);
        setState('signed-out');
        checkedFor.current = null;
        return;
      }

      const currentUser = newSession.user;
      setUser(currentUser);

      // Avoid re-checking on token refresh for the same user (keeps dashboard available).
      if (event === 'TOKEN_REFRESHED' && checkedFor.current === currentUser.id) {
        return;
      }

      setState('loading');
      checkedFor.current = currentUser.id;
      await verifyAdmin(currentUser);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { state, user, session, error, signOut };
}
