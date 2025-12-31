"use client";

import { useContext, createContext, useEffect, useState } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  creationDate: Date;
}

interface AuthContextType {
  user: User | null;
  fetchUser: () => void;
  userloading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userloading, setLoading] = useState<boolean>(true);

  // Acquire the user authentication details from API
  async function fetchUser() {
    try {
      setLoading(true);
      const res = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    // Insert user authentication details into the React Context
    <AuthContext.Provider value={{ user, fetchUser, userloading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
