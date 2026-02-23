'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, LogOut, BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

// Mock data for notes
const MOCK_NOTES = [
  { id: 1, title: 'Bugün biraz gergindim', date: '2024-05-20', preview: 'İş yerindeki toplantı beklediğimden uzun sürdü ve...' },
  { id: 2, title: 'Hafta sonu planları', date: '2024-05-18', preview: 'Doğa yürüyüşüne çıkmak bana çok iyi gelecek gibi hissediyorum.' },
  { id: 3, title: 'Terapi sonrası düşünceler', date: '2024-05-15', preview: 'Danışmanımla konuştuğumuz çocukluk anıları üzerine...' },
];

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center space-y-8"
        >
          <h1 className="text-6xl font-serif font-bold text-stone-900 tracking-tight">Note2Me</h1>
          <p className="text-xl text-stone-600 font-light leading-relaxed">
            Duygularınızı keşfedin, farkındalığınızı artırın. 
            Psikolojik danışmanlık sürecinizi yapay zeka destekli 
            modern bir duygu defteri ile destekleyin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={() => setIsLoggedIn(true)} // Mock login for demo
              className="px-8 py-4 bg-stone-900 text-white rounded-2xl font-medium hover:bg-stone-800 transition-all shadow-md"
            >
              Giriş Yap
            </button>
            <Link 
              href="/register"
              className="px-8 py-4 bg-white text-stone-900 border border-stone-200 rounded-2xl font-medium hover:bg-stone-50 transition-all shadow-sm"
            >
              Kayıt Ol
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-stone-900">Note2Me</h1>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto p-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-semibold text-stone-900">Notlarım</h2>
          <span className="text-sm text-stone-500 font-mono uppercase tracking-widest">
            {MOCK_NOTES.length} Kayıt
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_NOTES.map((note) => (
            <Link
              key={note.id}
              href={`/note?id=${note.id}`}
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group h-full"
              >
                <div className="flex items-center gap-2 text-stone-400 mb-3">
                  <Calendar size={14} />
                  <span className="text-xs font-mono">{note.date}</span>
                </div>
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-2 group-hover:text-stone-700 transition-colors">
                  {note.title}
                </h3>
                <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed mb-4">
                  {note.preview}
                </p>
                <div className="flex items-center text-stone-900 text-sm font-medium">
                  Detayları Gör <ChevronRight size={16} className="ml-1" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>

      {/* FAB */}
      <Link 
        href="/note"
        className="fixed bottom-8 right-8 w-16 h-16 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 z-20"
      >
        <Plus size={32} />
      </Link>
    </div>
  );
}
