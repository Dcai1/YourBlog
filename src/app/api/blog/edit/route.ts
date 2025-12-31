import { GetUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  if (req.method !== "PATCH") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const { id, title, content, excerpt, published } = await req.json();

  const user = await GetUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate and extract post ID
  if (!id) {
    return NextResponse.json({ message: "Missing post ID" }, { status: 400 });
  }

  // Check for empty edits
  if (!title && !content && !excerpt && typeof published !== "boolean") {
    return NextResponse.json(
      { message: "No fields to update" },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (post.authorId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        published,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Post updated successfully: ", post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
