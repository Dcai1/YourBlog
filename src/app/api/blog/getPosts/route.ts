import { prisma } from "@/app/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";
import { GetUser } from "@/app/lib/auth";
// @ts-expect-error - sanitize-html has no bundled types in this project
import sanitizeHtml from "sanitize-html";

interface SanitizeOptions {
  allowedTags: string[];
  allowedAttributes: {
    [key: string]: string[];
  };
  allowedSchemes: string[];
}

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }

  // Fetch all posts that are published
  try {
    const user = await GetUser();

    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      include: {
        author: {
          select: { firstName: true, lastName: true },
        },
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let likedPostIds = new Set<string>();
    if (user) {
      const likes = await prisma.like.findMany({
        where: {
          userId: user.id,
          postId: { in: posts.map((p) => p.id) },
        },
        select: { postId: true },
      });
      likedPostIds = new Set(likes.map((l) => l.postId));
    }

    // post sanitization using the sanitize-html package
    const sanitizeOptions = {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "title"],
      },
      allowedSchemes: ["http", "https", "data"],
    } as SanitizeOptions;

    const safePosts = posts.map((p) => ({
      id: p.id,
      title: p.title,
      content: sanitizeHtml(p.content ?? "", sanitizeOptions),
      excerpt: p.excerpt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      author: p.author,
      likeCount: p._count.likes,
      isLikedByUser: likedPostIds.has(p.id),
    }));

    return NextResponse.json({ posts: safePosts }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error. Please try again later." },
      { status: 500 },
    );
  }
}
