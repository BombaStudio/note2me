'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertCircle, MessageCircle, Loader2 } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteContent: string;
  hasPreviousAnalysis?: boolean;
}

const COLORS = ['#141414', '#5A5A40', '#8E9299', '#E4E3E0'];

const MOCK_CHART_DATA = [
  { name: 'Stres', value: 40 },
  { name: 'Mutluluk', value: 30 },
  { name: 'Kaygı', value: 20 },
  { name: 'Diğer', value: 10 },
];

export default function AnalysisModal({ isOpen, onClose, noteContent, hasPreviousAnalysis = false }: AnalysisModalProps) {
  const [isAnalyzed, setIsAnalyzed] = useState(hasPreviousAnalysis);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAnalyzed(true);
    }, 2000);
  };

  const handleReanalyze = () => {
    setIsAnalyzed(false);
    handleAnalyze();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900">Yapay Zeka Analizi</h3>
              <p className="text-xs text-stone-500 font-mono uppercase tracking-widest">Note2Me AI Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X size={24} className="text-stone-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {!isAnalyzed ? (
              <motion.div 
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
                  <Sparkles size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-serif font-medium text-stone-900">Analize Hazır mısınız?</h4>
                  <p className="text-stone-500 max-w-sm mx-auto">
                    Yapay zekamız notunuzu tarayarak duygusal örüntüleri ve farkındalık noktalarını belirleyecek.
                  </p>
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="px-10 py-4 bg-stone-900 text-white rounded-2xl font-medium hover:bg-stone-800 transition-all shadow-lg flex items-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Analiz Ediliyor...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Notumu Analiz Et
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                {/* Awareness Points */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-stone-900">
                    <AlertCircle size={20} className="text-stone-600" />
                    <h4 className="font-serif text-lg font-bold">Farkındalık Kazanılması Gereken Noktalar</h4>
                  </div>
                  <ul className="grid gap-3">
                    {['İş-özel hayat dengesindeki hassasiyet', 'Belirsizlik anlarında artan kontrol ihtiyacı', 'Sosyal etkileşim sonrası enerji düşüşü'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-stone-700 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Counselor Topics */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-stone-900">
                    <MessageCircle size={20} className="text-stone-600" />
                    <h4 className="font-serif text-lg font-bold">Danışmanla Görüşülecek Konular</h4>
                  </div>
                  <ul className="grid gap-3">
                    {['Geçen haftaki rüyanın tekrarlayan sembolleri', 'Sınır koyma pratiklerindeki zorlanmalar'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-stone-700 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Emotion Chart */}
                <section className="space-y-4">
                  <h4 className="font-serif text-lg font-bold text-stone-900">Duygu Durumu Dağılımı</h4>
                  <div className="h-[300px] w-full bg-stone-50 rounded-3xl border border-stone-100 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={MOCK_CHART_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {MOCK_CHART_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Re-analyze Button */}
                <div className="pt-6 flex justify-center">
                  <button 
                    onClick={handleReanalyze}
                    className="flex items-center gap-2 px-6 py-3 border border-stone-200 rounded-2xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all font-medium"
                  >
                    <Sparkles size={18} />
                    Yeniden Analiz Et
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 bg-stone-50/50 border-t border-stone-100 text-center">
          <p className="text-[10px] text-stone-400 font-mono uppercase tracking-[0.2em]">
            Bu analiz bir tanı niteliği taşımaz, sadece farkındalık amaçlıdır.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
