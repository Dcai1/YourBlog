"use client";

import React, { useState } from "react";
import { InputBar } from "../components/inputbar";

import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const router = useRouter();

  // Function to handle submitting information
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || passwordError) {
      setError(true);
      setMessage("Please fix the required fields before submitting.");
      return;
    }
    const res = await fetch(`/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, lastName, password }),
    });

    try {
      const data = await res.json();

      if (!res.ok) {
        setError(true);
        setMessage(data.error);
      } else {
        setError(false);
        setMessage(data.message);
        router.push("/login");
      }
    } catch {
      setError(true);
      setMessage("An unexpected error occurred, please try again later.");
    }
  };

  {
    /* Validate Email */
  }
  const validateEmail = (value: string) => {
    {
      /* Regex to confirm email matches intended format (e.g. email@example.org
      CANNOT contain: spaces, extra @ symbols, must have a @ and a period */
    }
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(value)) {
      setEmailError("Email does not match expected format.");
    } else {
      setEmailError(null);
    }
  };

  {
    /* Validate Password */
  }
  const validatePassword = (value: string) => {
    {
      /* Use Regex to test password security */
    }
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else if (!/[A-Z]/.test(value)) {
      setPasswordError("Password must include at least one uppercase letter.");
    } else if (!/[0-9]/.test(value)) {
      setPasswordError("Password must include at least one number.");
    } else if (!/[!@#$%^&*]/.test(value)) {
      setPasswordError("Password must include at least one special character.");
    } else {
      setPasswordError(null);
    }
  };

  return (
    <main className="container mt-5 d-flex justify-content-center align-items-center page-section">
      <div className="col-10 col-sm-8 col-md-6 col-lg-5 p-4 rounded shadow bg-primary">
        <div className="d-flex flex-column">
          <h1 className="text-center mb-4 blog-title"> Register </h1>

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
              validateEmail(e.target.value);
            }}
          />
          {emailError && <small className="text-danger">{emailError}</small>}

          <InputBar
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <InputBar
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <InputBar
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />
          {passwordError && (
            <small className="text-danger">{passwordError}</small>
          )}
        </div>

        {/* Submit */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            name="submit"
            id=""
            className="d-flex btn btn-outline-primary mx-auto mt-4"
          >
            Register
          </button>
        </form>
      </div>
    </main>
  );
}
