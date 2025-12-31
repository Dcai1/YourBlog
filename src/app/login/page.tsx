"use client";

import React, { useState } from "react";
import { InputBar } from "../components/inputbar";

import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useAuth();

  const router = useRouter();

  // Function to handle submitting information
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    try {
      const data = await res.json();

      if (!res.ok) {
        setError(true);
        setMessage(data.error);
      } else {
        await fetchUser();
        setError(false);
        setMessage(data.message);
        router.push("/blogs/dashboard");
      }
    } catch {
      setError(true);
      setMessage("An unexpected error occurred, please try again later.");
    }
  };

  return (
    <main className="container mt-5 d-flex justify-content-center align-items-center page-section">
      <div className="col-10 col-sm-8 col-md-6 col-lg-5 p-4 rounded shadow bg-primary">
        <div className="d-flex flex-column">
          <h1 className="text-center mb-4 blog-title"> Login </h1>

          {/* Message alert */}
          {message && (
            <div
              className={`alert ${error ? "alert-danger" : "alert-success"}`}
              role="alert"
            >
              {message}
            </div>
          )}

          <InputBar
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <InputBar
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        {/* Submit */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            name="submit"
            className="d-flex btn btn-outline-primary mx-auto mt-4 fs-5"
          >
            Login
          </button>
          {loading && (
            <p className="text-center text-muted fw-bolder">Processing...</p>
          )}
        </form>
      </div>
    </main>
  );
}
