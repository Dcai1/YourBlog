import { prisma } from "@/app/lib/prisma_client";
import { notFound } from "next/navigation";
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

// Renders the post content on this page by ID and using dangerouslySetInnerHTML

// publish added to the page props
interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { id } = await params;

  // grab blog post by id
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { author: true },
  });

  // redirect to a 404 if the post doesn’t exist
  if (!post) {
    notFound();
  }

  // redirect to a 404 if the post is not published, or the user accessing this is not the author
  if (!post.published) {
    const user = await GetUser();
    if (!user || user.id !== post.authorId) {
      notFound();
    }
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
    <main className="container my-5 d-flex align-items-center justify-content-center">
      <div className="card shadow-sm border-0 blog-box">
        <div className="card-body p-5">
          <h1 className="card-title display-4 fw-bold mb-4 text-dark">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="card-subtitle mb-4 fs-5 text-muted fst-italic">
              {post.excerpt}
            </p>
          )}

          <p className="text-muted mb-5">
            By{" "}
            <span className="fw-semibold">
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
        </div>
      </div>
    </main>
  );
}
