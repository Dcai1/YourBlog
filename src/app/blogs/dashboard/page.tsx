"use client";

// Add an option to delete posts with a prompt

import { useAuth } from "@/app/lib/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BlogPosts {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: { firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const { user, userloading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPosts[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!userloading && !user) {
      router.replace("/login");
    }

    async function getPosts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog/getUserPosts?id=${user?.id}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
        }
      } catch (err) {
        console.error("Error fetching blog posts: ", err);
      } finally {
        setLoading(false);
      }
    }
    getPosts();
  }, [user, router, userloading]);

  if (userloading) {
    return null;
  }

  const handleDelete = async (id: string) => {
    if (processing) return;
    setProcessing(true);
    try {
      await fetch(`/api/blog/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting blog post: ", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="container py-5">
      <h1 className="mb-4 blog-title">Your Dashboard</h1>

      <div className="blog-container">
        <section className="blog-box">
          <h2 className="mb-3 fw-bold">Your Blog Posts</h2>

          {loading ? (
            <div className="text-center">
              <p className="fw-bold fs-5 text-primary">Loading!</p>
              <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
            </div>
          ) : (
            <div className="row g-4">
              {posts.map((post) => (
                <div key={post.id} className="col-12 col-sm-6 col-md-4">
                  <div className="card h-100 shadow border-2 card-blog">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center">
                        <h3 className="card-title fw-bold">{post.title}</h3>
                        <div className="ms-auto">
                          <Link
                            href={`/blogs/edit/${post.id}`}
                            className="text-muted opacity-75 fw-bolder text-secondary"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="btn btn-link text-muted ms-2 p-0 m-0 opacity-75 fw-bolder text-secondary"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="card-text text-muted grow">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="card-footer bg-transparent border-0 text-end">
                      <small className="text-muted">
                        Last updated{" "}
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
