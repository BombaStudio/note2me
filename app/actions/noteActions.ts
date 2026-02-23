"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Kullanıcının oturum açıp açmadığını kontrol eden yardımcı fonksiyon
 */
async function getSession() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Bu işlem için giriş yapmanız gerekmektedir.");
  }
  return session;
}

/**
 * Yeni bir not oluşturur
 */
export async function createNote(title: string, content: string) {
  try {
    const session = await getSession();

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: session.user.id as string,
      },
    });

    revalidatePath("/");
    return { success: true, data: note };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Kullanıcının tüm notlarını getirir
 */
export async function getUserNotes() {
  try {
    const session = await getSession();

    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id as string,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        analysis: true, // Analiz verilerini de getir
      },
    });

    return { success: true, data: notes };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Bir nota ait analiz verisini kaydeder (Mock/Taslak)
 */
export async function createAnalysis(noteId: string, data: {
  awarenessPoints: string[];
  counselorTopics: string[];
  emotionDistribution: Record<string, number>;
}) {
  try {
    await getSession(); // Güvenlik kontrolü

    const analysis = await prisma.analysis.create({
      data: {
        noteId,
        awarenessPoints: data.awarenessPoints,
        counselorTopics: data.counselorTopics,
        emotionDistribution: data.emotionDistribution,
      },
    });

    revalidatePath(`/note?id=${noteId}`);
    return { success: true, data: analysis };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
