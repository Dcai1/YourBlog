import { prisma } from "@/app/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";
import { GetUser } from "@/app/lib/auth";

//** Current Issues
// Empty Drafts should not be saved * Complete
// Same existing Drafts should not be saved
// Issue: Unsaved drafts have no postId, letting existing draft be saved as if they were unique
// Optional: Implement auto-saving if session runs out while editing */

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }

  // acquire the user's session
  const user = await GetUser();

  function isEmptyRichText(html: string): boolean {
    // Remove all HTML tags and decode HTML entities
    const text = html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();
    return text.length === 0;
  }

  // Require logged in user

  // won't work if the user isn't logged in
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // receive post contents postId, title, content and excerpt from request
  // support both `id` and `postId` in the payload for backward-compatibility
  const payload = await req.json();
  const {
    id: payloadId,
    postId: payloadPostId,
    title,
    content,
    excerpt,
  } = payload;
  const postId = payloadId ?? payloadPostId ?? null;

  // Draft must not be empty
  // validate for empty fields
  if (!title.trim() || isEmptyRichText(content) || !excerpt.trim()) {
    console.log("Title: ", title.trim());
    console.log("Excerpt: ", excerpt.trim());
    console.log(isEmptyRichText(content));
    return NextResponse.json(
      { message: "Please fill in the required fields before saving." },
      { status: 400 },
    );
  }

  // Draft must not be a duplicate
  // validate for duplicate posts using postId
  if (postId) {
    const existing = await prisma.blogPost.findUnique({
      where: { id: postId },
    });
    if (
      existing &&
      existing.title === title &&
      existing.content === content &&
      existing.excerpt === excerpt
    ) {
      return NextResponse.json(
        { message: "No changes detected. Make a change and try again." },
        { status: 200 },
      );
    }
    // Ensure the current session user owns the post before allowing updates
    if (existing && existing.authorId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  }

  // operations to add or update the post using prisma
  try {
    let post;
    if (!postId) {
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
        where: { id: postId },
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
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Draft saved successfully. ", post: post },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error saving draft: ", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
