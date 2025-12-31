import { prisma } from "@/app/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";
import { GetUser } from "@/app/lib/auth";

//** Current Issues
// Empty Drafts should not be saved * Complete
// Same existing Drafts should not be saved
// Issue: Unsaved drafts have no id, letting existing draft be saved as if they were unique
// Optional: Implement auto-saving if session runs out while editing */

export async function POST(req: NextRequest) {
  const user = await GetUser();
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  function isEmptyRichText(html: string): boolean {
    // Remove all HTML tags and decode HTML entities
    const text = html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();
    return text.length === 0;
  }

  // Require logged in user
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id, title, content, excerpt } = await req.json();
  console.warn({ id });

  // Draft must not be empty
  if (!title.trim() || isEmptyRichText(content) || !excerpt.trim()) {
    console.log("Title: ", title.trim());
    console.log("Excerpt: ", excerpt.trim());
    console.log(isEmptyRichText(content));
    return NextResponse.json(
      { message: "Please fill in the required fields before saving." },
      { status: 400 }
    );
  }

  // Draft must not be a duplicate
  if (id) {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (
      existing &&
      existing.title === title &&
      existing.content === content &&
      existing.excerpt === excerpt
    ) {
      return NextResponse.json(
        { message: "No changes detected — draft not saved." },
        { status: 200 }
      );
    }
  }

  // Add or edit
  try {
    let post;
    if (!id) {
      post = await prisma.blogPost.create({
        data: {
          title,
          content,
          excerpt,
          published: false,
          createdAt: new Date(),
          author: {
            connect: { id: user.id },
          },
        },
      });
    } else {
      post = await prisma.blogPost.update({
        where: { id },
        data: {
          title,
          content,
          excerpt,
          published: false,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json(
        { message: "Draft updated successfully. ", post: post },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Draft saved successfully. ", post: post },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error saving draft: ", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
