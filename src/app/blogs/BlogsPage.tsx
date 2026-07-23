"use client";

import Link from "next/link";
import { useAuth } from "../lib/AuthContext";
import { useState, useEffect } from "react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: { firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLikedByUser: boolean;
}

export default function Blog() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog/getPosts", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
        }
      } catch (err) {
        console.error("Error fetching posts: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  async function toggleLike(postId: string) {
    if (!user) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLikedByUser: !p.isLikedByUser,
              likeCount: p.isLikedByUser ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p,
      ),
    );

    try {
      const res = await fetch("/api/blog/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (res.status === 401) return;
        throw new Error(data?.message || "Failed to toggle like");
      }

      const data = await res.json();
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, isLikedByUser: data.liked, likeCount: data.likeCount }
            : p,
        ),
      );
    } catch (err) {
      console.error("Error toggling like: ", err);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                isLikedByUser: !p.isLikedByUser,
                likeCount: p.isLikedByUser ? p.likeCount + 1 : p.likeCount - 1,
              }
            : p,
        ),
      );
    }
  }

  return (
    <main className="page-shell min-h-screen">
      <div className="page-frame">
        <div className="page-hero mb-4 text-center">
          <span className="home-kicker">Public feed</span>
          <h1 className="page-title">Blogs</h1>
          <p className="page-subtitle mt-3 mb-0">
            Browse published posts from the blog. Unpublished posts remain
            visible only to their authors.
          </p>
        </div>

        {/* Show button to create a post on login */}
        {user && (
          <div className="mb-4 text-center">
            <Link className="btn btn-primary rounded-pill" href="/blogs/create">
              Create a Post
            </Link>
          </div>
        )}

        {/* Display blog posts from database */}
        <section className="page-panel row g-4 align-items-stretch">
          {loading && (
            <div className="text-center">
              <p className="fw-bold fs-5 text-primary">Loading!</p>
              <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
            </div>
          )}

          {posts.map((post) => (
            <div key={post.id} className="col-12 col-sm-6 col-md-4">
              <div className="border shadow-sm card card-blog h-100">
                <div className="card-body d-flex flex-column">
                  <h3 className="mb-2 card-title fw-bold">{post.title}</h3>
                  <p className="card-text text-muted grow fw-bolder">
                    {post.excerpt}
                  </p>

                  <small className="mb-2 text-muted fw-bolder">
                    by {post.author.firstName} {post.author.lastName} •{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </small>

                  <div className="d-flex align-items-center justify-content-end mt-auto">
                    <button
                      onClick={() => toggleLike(post.id)}
                      disabled={!user}
                      className={`btn btn-sm d-inline-flex align-items-center gap-1 ${
                        post.isLikedByUser
                          ? "text-warning"
                          : "text-muted"
                      }`}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: user ? "pointer" : "not-allowed",
                        opacity: user ? 1 : 0.5,
                      }}
                      title={
                        user
                          ? post.isLikedByUser
                            ? "Unlike"
                            : "Like"
                          : "Log in to like"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={post.isLikedByUser ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="fw-bold">{post.likeCount}</span>
                    </button>
                  </div>

                  <Link
                    href={`/blogs/${post.id}`}
                    className="stretched-link text-decoration-none text-secondary fw-semibold"
                  >
                    Read More -→
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
