"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { BlogButton } from "./BlogButton";

export const Navbar = () => {
  const pathName = usePathname();
  const router = useRouter();

  const { user, fetchUser } = useAuth();

  async function handleLogout() {
    const res = await fetch("/api/logout", { method: "POST" });

    if (res.ok) {
      fetchUser();
      router.push("/login");
    }
  }

  return (
    <nav className="navbar navbar-expand-md shadow bg-nav">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left: Logo */}
        <Link
          className="navbar-brand mb-0 h1 text-black fs-4 fw-bolder"
          href="/"
        >
          YourBlog
        </Link>

        {/* Center: Nav links */}
        <ul className="navbar-nav flex-row gap-3 h5">
          <li className="nav-item">
            <Link
              className={`nav-link ${pathName === "/" && "active text-black"}`}
              href="/"
              aria-current="page"
            >
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link ${
                pathName === "/blogs" && "active text-black"
              }`}
              href="/blogs"
            >
              Blogs
            </Link>
          </li>

          {user && (
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  pathName === "/blogs/dashboard" && "active text-black"
                }`}
                href="/blogs/dashboard"
              >
                Dashboard
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link
              className={`nav-link ${
                pathName === "/about" && "active text-black"
              }`}
              href="/about"
            >
              About
            </Link>
          </li>
        </ul>

        {/* Right: Auth buttons */}

        <div className="d-flex gap-2">
          {user ? (
            <>
              <button
                className="btn btn-outline-primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <BlogButton href="/login" text="Login" />
              <BlogButton href="/register" text="Register" />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
