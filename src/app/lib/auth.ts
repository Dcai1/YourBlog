import { cookies } from "next/headers";
import { prisma } from "./prisma_client";

// Check for logged in user's session
export async function GetUser() {
  const cookieStore = cookies();
  const sessionId = (await cookieStore).get("sessionId")?.value;

  if (!sessionId) {
    console.warn("session is null");
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  // Ensure session has not expired
  if (!session || session.expiresAt < new Date()) {
    console.log("session not found or has expired");
    await prisma.session.deleteMany({
      where: { id: sessionId },
    });
    return null;
  }

  console.warn("session is not null");
  return session.user;
}
