import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  
  let formattedNotes: { id: string; title: string; preview: string; date: string }[] = [];

  if (isLoggedIn && session.user?.id) {
    const rawNotes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    formattedNotes = rawNotes.map(note => ({
      id: note.id,
      title: note.title,
      // Create a small preview of the content, max 100 characters
      preview: note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content,
      // Format the date simply as YYYY-MM-DD
      date: note.createdAt.toISOString().split('T')[0],
    }));
  }

  return <HomeClient isLoggedIn={isLoggedIn} notes={formattedNotes} />;
}
