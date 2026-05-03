/* ============================================
   Bacar.az — Legacy Auth Context (NextAuth Wrapper)
   ============================================ */
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(status === 'loading');
  }, [status]);

  const login = async (email, password) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (result?.error) return { success: false, error: 'E-poçt və ya şifrə yanlışdır' };
    return { success: true, user: session?.user };
  };

  const register = async (name, email, password) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      return { success: false, error: 'Qeydiyyat zamanı xəta baş verdi' };
    }
    await login(email, password);
    return { success: true, user: session?.user };
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
