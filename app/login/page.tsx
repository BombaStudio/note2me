'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Geçersiz e-posta veya şifre.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-xl"
      >
        <Link href="/" className="inline-flex items-center text-stone-400 hover:text-stone-900 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Geri Dön
        </Link>
        
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">Hoş Geldiniz</h1>
        <p className="text-stone-500 mb-8">Duygularınızı not etmeye devam edin.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-stone-400 ml-1">E-Posta</label>
            <input 
              type="email" 
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-stone-400 ml-1">Şifre</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-stone-900 text-white rounded-2xl font-medium hover:bg-stone-800 transition-all shadow-md pt-4 disabled:opacity-70"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-stone-500">veya</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="mt-6 w-full flex items-center justify-center gap-3 py-4 bg-white border border-stone-200 text-stone-700 rounded-2xl font-medium hover:bg-stone-50 transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
            </svg>
            Google ile Giriş Yap
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-stone-500">
          Hesabınız yok mu? <Link href="/register" className="text-stone-900 font-semibold hover:underline">Kayıt Olun</Link>
        </div>
      </motion.div>
    </div>
  );
}
