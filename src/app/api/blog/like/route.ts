import { prisma } from "@/app/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";
import { GetUser } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }

  const user = await GetUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { postId } = await req.json();

    // <!---------- VALIDATION ------------->
    if (!postId) {
      return NextResponse.json(
        { message: "postId is required" },
        { status: 400 },
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    // <!---------- END VALIDATION ------------->

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId: user.id, postId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      const likeCount = await prisma.like.count({ where: { postId } });

      return NextResponse.json({ liked: false, likeCount }, { status: 200 });
    }

    await prisma.like.create({
      data: {
        userId: user.id,
        postId,
      },
    });

    const likeCount = await prisma.like.count({ where: { postId } });

    return NextResponse.json({ liked: true, likeCount }, { status: 200 });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
