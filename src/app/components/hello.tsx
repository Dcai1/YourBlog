"use client";

import { useAuth } from "../lib/AuthContext";

export const Hello = () => {
  const { user } = useAuth();
  console.warn("User: " + user);
  return (
    <div className="text-center bg-secondary">
      {user && (
        <h2 className="p-5 text-center mt-3">Hello, {user.firstName}!</h2>
      )}
    </div>
  );
};
