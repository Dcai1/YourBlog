"use client";

import { useAuth } from "../lib/AuthContext";

export const Hello = () => {
  const { user } = useAuth();
  // console.warn("User: " + user);
  return (
    <div className="d-flex">
      {user && (
        <p className="text-center my-auto text-primary fw-bolder fs-6">
          Hello, {user.firstName}!
        </p>
      )}
    </div>
  );
};
