import { prisma } from "@/app/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";
import { GetUser } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  const user = await GetUser();

  // Require logged in user
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title, content, excerpt } = await req.json();

  // Data Validation
  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    typeof excerpt !== "string" ||
    !title.trim() ||
    !content.trim()
  ) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      content,
      excerpt,
      published: false,
      createdAt: new Date(Date.now()),
      author: {
        connect: { id: user.id },
      },
    },
  });

  return NextResponse.json(
    { message: "Post created successfully", post: post },
    { status: 201 }
  );
}
