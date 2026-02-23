'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
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
        
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">Kayıt Ol</h1>
        <p className="text-stone-500 mb-8">Farkındalık yolculuğuna bugün başlayın.</p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-stone-400 ml-1">Ad Soyad</label>
            <input 
              type="text" 
              placeholder="John Doe"
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-stone-400 ml-1">E-Posta</label>
            <input 
              type="email" 
              placeholder="email@example.com"
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-stone-400 ml-1">Şifre</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all"
            />
          </div>
          
          <button className="w-full py-4 bg-stone-900 text-white rounded-2xl font-medium hover:bg-stone-800 transition-all shadow-md pt-4">
            Hesap Oluştur
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-stone-500">
          Zaten hesabınız var mı? <Link href="/login" className="text-stone-900 font-semibold hover:underline">Giriş Yapın</Link>
        </div>
      </motion.div>
    </div>
  );
}
