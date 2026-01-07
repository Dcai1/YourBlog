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

  return (
    <main className="container min-h-screen py-4">
      <div className="mb-4 text-center">
        <h1 className="blog-title">Blogs</h1>
      </div>

      {/* Show button to create a post on login */}
      {user && (
        <div className="mb-4 text-center">
          {" "}
          <Link className="btn btn-primary" href="/blogs/create">
            Create Post
          </Link>
        </div>
      )}

      {/* Display blog posts from database */}
      <div className="d-flex align-items-center justify-content-center">
        <section className="d-flex my-auto row g-4 blog-box">
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
              <div className="border shadow-sm card card-blog">
                <div className="card-body d-flex flex-column">
                  <h3 className="mb-2 card-title fw-bold">{post.title}</h3>
                  <p className="card-text text-muted grow fw-bolder">
                    {post.excerpt}
                  </p>

                  <small className="mb-2 text-muted fw-bolder">
                    by {post.author.firstName} {post.author.lastName} •{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </small>

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
