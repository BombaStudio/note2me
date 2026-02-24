import React from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import NoteEditorClient from '@/components/NoteEditorClient';

export default async function NotePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth();
  
  // Middleware already protects this route so session should exist
  if (!session?.user?.id) {
    return null;
  }

  // Await searchParams in Next 15+
  const resolvedParams = await searchParams;
  const noteId = typeof resolvedParams?.id === 'string' ? resolvedParams.id : undefined;

  let initialData = {
    title: '',
    content: '',
    hasAnalysis: false
  };

  if (noteId) {
    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
        userId: session.user.id // Ensure we only fetch if the user owns this note
      },
      include: {
        analysis: true
      }
    });

    if (!note) {
      notFound();
    }

    initialData = {
      title: note.title,
      content: note.content,
      hasAnalysis: !!note.analysis
    };
  }

  return (
    <React.Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center">Yükleniyor...</div>}>
      <NoteEditorClient 
        noteId={noteId}
        initialTitle={initialData.title}
        initialContent={initialData.content}
        hasAnalysis={initialData.hasAnalysis}
      />
    </React.Suspense>
  );
}
