import { prisma } from "@/app/lib/prisma_client";
import { notFound } from "next/navigation";

interface BlogPageProps {
  params: { id: string };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    include: { author: true },
  });

  if (!post) {
    notFound(); // built-in 404 if the post doesn’t exist
  }

  return (
    <main className="container my-5">
      <div className="card shadow-sm border-0">
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

          <div
            className="card-text fs-5 lh-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </main>
  );
}
