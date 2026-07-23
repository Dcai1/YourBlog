import { prisma } from "@/app/lib/prisma_client";
import { notFound } from "next/navigation";
import { GetUser } from "@/app/lib/auth";
import type { Metadata } from "next";
// @ts-expect-error - sanitize-html has no bundled types in this project
import sanitizeHtml from "sanitize-html";
import LikeButton from "./LikeButton";

interface SanitizeOptions {
  allowedTags: string[];
  allowedAttributes: {
    [key: string]: string[];
  };
  allowedSchemes: string[];
}

// Renders the post content on this page by ID and using dangerouslySetInnerHTML

// publish added to the page props
interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: {
      title: true,
      excerpt: true,
    },
  });

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || "Read this post on YourBlog.",
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { id } = await params;

  // grab blog post by id
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      author: true,
      _count: { select: { likes: true } },
    },
  });

  // redirect to a 404 if the post doesn’t exist
  if (!post) {
    notFound();
  }

  const user = await GetUser();

  // redirect to a 404 if the post is not published, or the user accessing this is not the author
  if (!post.published) {
    if (!user || user.id !== post.authorId) {
      notFound();
    }
  }

  // Check if the current user has liked this post
  let isLikedByUser = false;
  if (user) {
    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId: user.id, postId: id } },
    });
    isLikedByUser = !!existingLike;
  }

  // sanitize content one more time for safety measures
  const sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title"],
    },
    allowedSchemes: ["http", "https", "data"],
  } as SanitizeOptions;

  const safeHtml = sanitizeHtml(post.content ?? "", sanitizeOptions);

  return (
    <main className="page-shell min-h-screen">
      <div className="page-frame">
        <div className="page-panel">
          <h1 className="page-title mb-4">{post.title}</h1>

          {post.excerpt && (
            <p className="page-subtitle mb-4 fst-italic">{post.excerpt}</p>
          )}

          <p className=" mb-5">
            By{" "}
            <span className="fw-semibold  text-primary">
              {post.author.firstName} {post.author.lastName}
            </span>{" "}
            on {new Date(post.createdAt).toLocaleDateString()}
          </p>

          <hr className="my-4" />

          {/* render post contents using dangerouslySetInnerHTML (sanitized) */}
          <div
            className="card-text fs-5 lh-lg"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />

          <hr className="my-4" />

          <div className="d-flex justify-content-start">
            <LikeButton
              postId={post.id}
              initialLiked={isLikedByUser}
              initialCount={post._count.likes}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
