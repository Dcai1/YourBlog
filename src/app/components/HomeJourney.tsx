"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BlogButton } from "./BlogButton";

export function HomeJourney() {
  useEffect(() => {
    const introSection = document.getElementById("intro");
    if (introSection) {
      window.scrollTo({
        top: introSection.offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <main className="home-journey">
      {/* Info Section 2 */}
      <section className="home-stage home-stage--launch min-h-screen">
        <div className="launch-card">
          <span className="home-kicker">Final approach</span>
          <h2 className="display-5 fw-bold mb-3">Start Your Journey Today</h2>
          <p className="lead mb-4">
            Start writing and sharing your stories with the world.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link
              href="/blogs"
              className="btn btn-primary btn-lg px-4 py-3 rounded-pill"
            >
              Visit the blog
            </Link>
            <Link
              href="/about"
              className="btn btn-outline-primary btn-lg px-4 py-3 rounded-pill"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Boxes Section */}

      <section className="home-stage home-stage--mission glass stripe-pattern">
        <div className="home-stage__content home-grid">
          <article className="glass-card">
            <h3>Write freely</h3>
            <p>Write comfortly with a rich text editor provided by Quill.</p>
          </article>
          <article className="glass-card">
            <h3>Publish with safety</h3>
            <p>
              Publish your work securely with author-enforced security, and XSS
              sanitization.{" "}
            </p>
          </article>
          <article className="glass-card">
            <h3>Discover stories</h3>
            <p>Read what others have publicly shared. </p>
          </article>
        </div>
      </section>

      {/* Rising Section */}
      <section className="home-stage home-stage--speed min-h-screen">
        <div className="speed-lines" aria-hidden="true" />
        <div className="home-stage__content">
          <span className="home-kicker">Transit</span>
          <h2 className="display-6 fw-bold mb-3">Momentum building</h2>
          <p className="lead mx-auto" style={{ maxWidth: "760px" }}>
            Takeoff!
          </p>
        </div>
      </section>

      {/* Starting Section */}
      <section className="home-stage home-stage--intro">
        <div className="home-stage__content">
          <span className="home-kicker">YourBlog</span>
          <h1 className="display-4 fw-bold mb-4">
            Stories that feel like they are arriving from beyond the horizon.
          </h1>
          <p className="lead mb-4">Scroll up to begin the journey</p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            <BlogButton href="/blogs" text="Explore Existing Posts" />
            <BlogButton href="/register" text="Join the Mission" />
          </div>

          <p id="intro" className="small fw-semibold">
            A Personal and Secure Blog Application.
          </p>
        </div>
      </section>
    </main>
  );
}
