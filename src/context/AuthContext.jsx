import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const AuthContext = createContext(null);

const USERS_KEY = 'shopwave_users';
const USER_KEY = 'shopwave_user';

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || '') || fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user || null);
        setLoading(false);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      });
      return () => subscription.unsubscribe();
    }
    setUser(readJSON(USER_KEY, null));
    setLoading(false);
  }, []);

  const value = useMemo(() => {
    async function signIn({ email, password }) {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
      }
      const users = readJSON(USERS_KEY, []);
      const match = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (!match) throw new Error('Invalid email or password.');
      const sessionUser = { id: match.id, email: match.email };
      localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return sessionUser;
    }

    async function signUp({ name, email, password }) {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        return data.user;
      }
      const users = readJSON(USERS_KEY, []);
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        throw new Error('An account with this email already exists.');
      }
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email: email.trim(),
        password,
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      const sessionUser = { id: newUser.id, email: newUser.email };
      localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return sessionUser;
    }

    async function signOut() {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } else {
        localStorage.removeItem(USER_KEY);
      }
      setUser(null);
    }

    return { user, loading, signIn, signUp, signOut, isDemo: !isSupabaseConfigured };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
