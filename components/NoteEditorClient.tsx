'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bot, Save, Sparkles, Check, Trash2 } from 'lucide-react';
import AnalysisModal from '@/components/AnalysisModal';
import { createNote, updateNote, deleteNote } from '@/app/actions/notes';

interface NoteEditorClientProps {
  noteId?: string;
  initialTitle?: string;
  initialContent?: string;
  hasAnalysis?: boolean;
}

export default function NoteEditorClient({
  noteId,
  initialTitle = '',
  initialContent = '',
  hasAnalysis = false,
}: NoteEditorClientProps) {
  const router = useRouter();
  
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = title !== initialTitle || content !== initialContent;

  const handleSave = async () => {
    if (!title && !content) return;
    setIsSaving(true);
    
    try {
      if (noteId) {
        await updateNote(noteId, { title, content });
      } else {
        const result = await createNote({ title, content });
        if (result.success && result.noteId) {
          // Redirect to the newly created note's edit page smoothly
          router.replace(`/note?id=${result.noteId}`);
          router.refresh();
        }
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!noteId) return;
    if (confirm('Bu notu silmek istediğinize emin misiniz?')) {
      setIsSaving(true);
      try {
        await deleteNote(noteId);
        router.push('/');
        router.refresh();
      } catch (error) {
        console.error("Delete failed", error);
        setIsSaving(false);
      }
    }
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
            {noteId && (
              <button 
                onClick={handleDelete}
                disabled={isSaving}
                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Sil"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              onClick={handleSave}
              disabled={(!isDirty && !!noteId) || isSaving}
              className={`px-6 py-2 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2 ${
                isDirty || (!noteId && (title || content))
                  ? 'bg-stone-900 text-white hover:bg-stone-800' 
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isSaved ? <Check size={18} /> : <Save size={18} />}
              {isSaving ? 'Kaydediliyor...' : isSaved ? 'Kaydedildi' : 'Kaydet'}
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
            className="w-full text-4xl font-serif font-bold bg-transparent border-none focus:ring-0 placeholder:text-stone-300 p-0 outline-none"
          />
          
          <div className="h-px bg-stone-200 w-full" />

          <textarea 
            placeholder="Bugün nasıl hissediyorsun? Neler yaşadın? Buraya dökebilirsin..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full flex-1 text-lg leading-relaxed bg-transparent border-none focus:ring-0 placeholder:text-stone-300 p-0 resize-none min-h-[400px] outline-none"
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
          {hasAnalysis ? 'Analizi Gör' : 'AI Analizi'}
        </div>
      </button>

      {/* Analysis Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AnalysisModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            noteContent={content}
            hasPreviousAnalysis={hasAnalysis}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
