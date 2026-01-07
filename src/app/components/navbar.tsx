"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { Hello } from "./hello";
import { BlogButton } from "./BlogButton";
import Image from "next/image";

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
    <nav className="navbar navbar-expand-lg shadow bg-nav">
      <div className="container-fluid">
        {/* Left: Logo */}
        <Link className="navbar-brand mb-0" href="/">
          <Image src={`/logotext.svg`} alt="YourBlog" width={85} height={30} />
        </Link>

        {/* Mobile Navbar */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div
          className="navbar-collapse collapse align-items-center"
          id="navbarSupportedContent"
        >
          {/* Center: Nav links */}
          <ul className="navbar-nav mx-auto gap-3 h5">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  pathName === "/" && "active text-black"
                }`}
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

          <div className="d-flex gap-3 align-items-center justify-content-center">
            <Hello />
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
      </div>
    </nav>
  );
};
