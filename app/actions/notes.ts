"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNote(data: { title: string; content: string }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const note = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    return { success: true, noteId: note.id };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, error: "Not oluşturulurken bir hata meydana geldi." };
  }
}

export async function updateNote(id: string, data: { title: string; content: string }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    // First verify the note belongs to the user
    const existingNote = await prisma.note.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingNote || existingNote.userId !== session.user.id) {
      throw new Error("Note not found or unauthorized");
    }

    await prisma.note.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
      },
    });

    revalidatePath("/");
    revalidatePath(`/note`); // Need to revalidate the note page with query params
    return { success: true };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, error: "Not güncellenirken bir hata meydana geldi." };
  }
}

export async function deleteNote(id: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const existingNote = await prisma.note.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingNote || existingNote.userId !== session.user.id) {
      throw new Error("Note not found or unauthorized");
    }

    await prisma.note.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: "Not silinirken bir hata meydana geldi." };
  }
}
