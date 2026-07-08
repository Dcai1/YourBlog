import { prisma } from "@/app/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";
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
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      include: {
        author: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

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
      ...p,
      content: sanitizeHtml(p.content ?? "", sanitizeOptions),
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
