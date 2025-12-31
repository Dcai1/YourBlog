import { prisma } from "@/app/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract the user ID from the query string
    const { searchParams } = new URL(req.url);
    console.log(searchParams);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch all posts by this author
    const posts = await prisma.blogPost.findMany({
      where: { authorId: id },
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
      { status: 500 }
    );
  }
}
