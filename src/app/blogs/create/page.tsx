"use client";

import { useState, useEffect } from "react";
import { InputBar } from "@/app/components/inputbar";
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function Create() {
  const { user, userloading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Redirect back to login if the user is not logged in
  useEffect(() => {
    if (!userloading && !user) {
      router.replace("/login");
    }
  }, [user, router, userloading]);

  if (userloading) return null;

  // Function to handle submitting information
  const handleSubmit = async (e: React.FormEvent) => {
    if (saving) return;
    e.preventDefault();
    setSaving(true);

    try {
      setLoading(true);
      const res = await fetch(`/api/blog/save-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, excerpt }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(true);
        setMessage(data.error);
      } else {
        setError(false);
        setMessage(data.message);
        router.replace("blogs/dashboard");
      }
    } catch {
      setError(true);
      setMessage("An unexpected error occurred, please try again later.");
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <main className="container py-5 bg-light min-vh-100">
      <div className="mx-auto bg-white p-5 rounded-4 shadow-sm">
        <h1 className="text-center mb-4 fw-bold text-dark">
          Create a New Post
        </h1>

        {/* Title Input */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Title</label>
          <InputBar
            type="text"
            placeholder="Enter your blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Excerpt Input */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Excerpt</label>
          <InputBar
            type="text"
            placeholder="A short summary or teaser for your post..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        {/* Content Editor */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Content</label>
          <div className="border rounded overflow-hidden">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              placeholder="Start writing your post here..."
              style={{ height: "100%", minHeight: "500px" }}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          {/* Message alert */}
          {message && (
            <div
              className={`alert ${error ? "alert-danger" : "alert-success"}`}
              role="alert"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary px-5 py-2 fs-5"
          >
            Save Draft
          </button>
          {loading && (
            <p className="text-muted text-center fw-bolder">Processing...</p>
          )}
        </div>
      </div>
    </main>
  );
}
