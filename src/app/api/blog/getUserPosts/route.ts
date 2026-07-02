import { prisma } from "@/app/lib/prisma_client";
import { NextResponse } from "next/server";
import { GetUser } from "@/app/lib/auth";

export async function GET() {
  try {
    // Extract the user ID from the user and validate
    const user = await GetUser();
    const id = user?.id;

    // ID Validation
    if (!id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch all posts by the author
    const posts = await prisma.blogPost.findMany({
      where: { authorId: user.id },
      select: {
        id: true,
        title: true,
        excerpt: true,
        createdAt: true,
        updatedAt: true,
        published: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
