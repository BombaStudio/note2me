'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bot, Save, Sparkles, Check } from 'lucide-react';
import AnalysisModal from '@/components/AnalysisModal';

// Mock data for existing notes
const MOCK_NOTES_DETAIL = {
  '1': { title: 'Bugün biraz gergindim', content: 'İş yerindeki toplantı beklediğimden uzun sürdü ve yöneticimin geri bildirimleri beni biraz savunmacı bir pozisyona itti. Aslında söyledikleri doğruydu ama üslubu beni kırdı. Akşam eve geldiğimde bu durumu eşimle paylaştım ve biraz rahatladım.', hasAnalysis: true },
  '2': { title: 'Hafta sonu planları', content: 'Doğa yürüyüşüne çıkmak bana çok iyi gelecek gibi hissediyorum. Şehrin gürültüsünden uzaklaşmak, sadece kuş seslerini duymak istiyorum. Belki yanıma bir kitap da alırım.', hasAnalysis: false },
  '3': { title: 'Terapi sonrası düşünceler', content: 'Danışmanımla konuştuğumuz çocukluk anıları üzerine derin derin düşündüm. Bazı davranışlarımın kökenini anlamak beni hem şaşırttı hem de bir nebze olsun özgürleştirdi.', hasAnalysis: true },
};

export default function NotePage() {
  return (
    <React.Suspense fallback={<div>Yükleniyor...</div>}>
      <NoteEditor />
    </React.Suspense>
  );
}

function NoteEditor() {
  const searchParams = useSearchParams();
  const noteId = searchParams.get('id');
  
  const initialData = useMemo(() => {
    if (noteId && MOCK_NOTES_DETAIL[noteId as keyof typeof MOCK_NOTES_DETAIL]) {
      return MOCK_NOTES_DETAIL[noteId as keyof typeof MOCK_NOTES_DETAIL];
    }
    return { title: '', content: '', hasAnalysis: false };
  }, [noteId]);

  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isDirty = title !== initialData.title || content !== initialData.content;

  const handleSave = () => {
    if (!isDirty) return;
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-serif font-bold text-stone-900 hidden sm:block">
              {noteId ? 'Notu Düzenle' : 'Yeni Not'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSave}
              disabled={!isDirty}
              className={`px-6 py-2 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2 ${
                isDirty 
                  ? 'bg-stone-900 text-white hover:bg-stone-800' 
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isSaved ? <Check size={18} /> : <Save size={18} />}
              {isSaved ? 'Kaydedildi' : 'Kaydet'}
            </button>
          </div>
        </div>
      </header>

      {/* Editor Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 flex-1 flex flex-col"
        >
          <input 
            type="text" 
            placeholder="Not Başlığı..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-serif font-bold bg-transparent border-none focus:ring-0 placeholder:text-stone-300 p-0"
          />
          
          <div className="h-px bg-stone-200 w-full" />

          <textarea 
            placeholder="Bugün nasıl hissediyorsun? Neler yaşadın? Buraya dökebilirsin..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full flex-1 text-lg leading-relaxed bg-transparent border-none focus:ring-0 placeholder:text-stone-300 p-0 resize-none min-h-[400px]"
          />
        </motion.div>
      </main>

      {/* AI FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 z-20 group"
      >
        <Bot size={32} className="group-hover:animate-pulse" />
        <div className="absolute -top-12 right-0 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm text-stone-900 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1">
          <Sparkles size={12} className="text-stone-500" />
          {initialData.hasAnalysis ? 'Analizi Gör' : 'AI Analizi'}
        </div>
      </button>

      {/* Analysis Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AnalysisModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            noteContent={content}
            hasPreviousAnalysis={initialData.hasAnalysis}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
