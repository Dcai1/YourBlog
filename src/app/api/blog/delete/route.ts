// Delete a blog post
import { NextRequest, NextResponse } from "next/server";
import { GetUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma_client";

export async function DELETE(req: NextRequest) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
  const user = await GetUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Extract post ID
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { message: "Invalid/Missing post ID" },
      { status: 400 }
    );
  }

  try {
    // Verify the post belongs to the user
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Delete the post
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
