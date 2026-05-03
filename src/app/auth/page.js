/* ============================================
   Bacar.az — Auth Sayfası (Daxil ol / Qeydiyyat)
   ============================================ */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Kısa bir gecikme simülasyonu
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isLogin) {
      const result = login(email, password);
      if (result.success) {
        addToast(`Xoş gəldiniz, ${result.user.name}!`, 'success');
        router.push('/dashboard');
      } else {
        setError(result.error);
      }
    } else {
      if (!name.trim()) {
        setError('Ad daxil edin');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Şifrə ən az 6 simvol olmalıdır');
        setLoading(false);
        return;
      }
      const result = register(name, email, password);
      if (result.success) {
        addToast('Qeydiyyat uğurla tamamlandı!', 'success');
        router.push('/dashboard');
      } else {
        setError(result.error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Kart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 shadow-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2">
              <span className="gradient-text-blue">BACAR</span>
              <span className="text-[var(--text-primary)]">.</span>
              <span className="gradient-text-green">AZ</span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {isLogin ? 'Hesabınıza daxil olun' : 'Yeni hesab yaradın'}
            </p>
          </div>

          {/* Sekmeler */}
          <div className="flex bg-[var(--bg-primary)] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isLogin
                  ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/25'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Daxil ol
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isLogin
                  ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/25'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Qeydiyyat
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input
                    label="Ad Soyad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınızı daxil edin"
                    icon="👤"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="E-poçt"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@bacar.az"
              icon="📧"
              required
            />

            <Input
              label="Şifrə"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              icon="🔒"
              required
            />

            {/* Hata Mesajı */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500"
              >
                ⚠ {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              {isLogin ? 'Daxil ol' : 'Qeydiyyatdan keç'}
            </Button>
          </form>

          {/* Demo Bilgi */}
          <div className="mt-6 p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
            <p className="text-xs font-semibold text-brand-blue mb-2">🧪 Demo hesablar:</p>
            <div className="space-y-1 text-xs text-[var(--text-secondary)]">
              <p>📧 eli@bacar.az / 🔑 123456</p>
              <p>📧 gunel@bacar.az / 🔑 123456</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
