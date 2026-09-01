"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { BlogButton } from "./BlogButton";

const TRAIL_FADE_MS = 3000;
const TRAIL_MIN_INTERVAL_MS = 20;
const MAX_ACTIVE_TRAIL_PARTICLES = 48;

export function HomeJourney() {
  const launchStageRef = useRef<HTMLElement | null>(null);
  const trailLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const introSection = document.getElementById("intro");
    if (introSection) {
      window.scrollTo({
        top: introSection.offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  // ------------------------ Trail Animation -----------------------------
  useEffect(() => {
    const stage = launchStageRef.current;
    const trailLayer = trailLayerRef.current;

    if (!stage || !trailLayer) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const hoverQuery = window.matchMedia("(hover: hover)");

    if (
      reducedMotionQuery.matches ||
      coarsePointerQuery.matches ||
      !hoverQuery.matches
    ) {
      return;
    }

    let active = true;
    let lastSpawnAt = 0;
    let particleId = 0;
    const particleTimers = new Map<number, number>();
    const particleOrder: number[] = [];

    const removeParticle = (id: number) => {
      const timeoutId = particleTimers.get(id);
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
        particleTimers.delete(id);
      }

      const particleIndex = particleOrder.indexOf(id);
      if (particleIndex !== -1) {
        particleOrder.splice(particleIndex, 1);
      }

      const node = trailLayer.querySelector<HTMLElement>(
        `[data-trail-id="${id}"]`,
      );

      node?.remove();
    };

    // Remove old particles
    const pruneParticles = () => {
      while (particleOrder.length > MAX_ACTIVE_TRAIL_PARTICLES) {
        const oldestId = particleOrder.shift();

        if (oldestId !== undefined) {
          removeParticle(oldestId);
        }
      }
    };

    // Spawn a particle
    const spawnParticle = (clientX: number, clientY: number) => {
      if (!active) {
        return;
      }

      const now = performance.now();
      if (now - lastSpawnAt < TRAIL_MIN_INTERVAL_MS) {
        return;
      }

      lastSpawnAt = now;

      const rect = stage.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const id = ++particleId;
      const size = 75;
      const driftX = (Math.random() - 0.5) * 24;
      const driftY = (Math.random() - 0.5) * 24;
      const hue = 194 + Math.random() * 20;
      const particle = document.createElement("span");

      particle.className = "home-trail__particle";
      particle.dataset.trailId = String(id);
      particle.style.setProperty("--trail-x", `${x}px`);
      particle.style.setProperty("--trail-y", `${y}px`);
      particle.style.setProperty("--trail-size", `${size}px`);
      particle.style.setProperty("--trail-drift-x", `${driftX}px`);
      particle.style.setProperty("--trail-drift-y", `${driftY}px`);
      particle.style.setProperty("--trail-hue", `${hue}`);

      trailLayer.appendChild(particle);
      particleOrder.push(id);
      pruneParticles();

      const timeoutId = window.setTimeout(() => {
        removeParticle(id);
      }, TRAIL_FADE_MS);

      particleTimers.set(id, timeoutId);
    };

    const handleMove = (event: PointerEvent | MouseEvent) => {
      if ("pointerType" in event && event.pointerType === "touch") {
        return;
      }

      spawnParticle(event.clientX, event.clientY);
    };

    const handlePointerLeave = () => {
      lastSpawnAt = 0;
    };

    stage.addEventListener("pointermove", handleMove);
    stage.addEventListener("mousemove", handleMove);
    stage.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      active = false;
      stage.removeEventListener("pointermove", handleMove);
      stage.removeEventListener("mousemove", handleMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      particleTimers.forEach((timeoutId) => window.clearTimeout(timeoutId));
      particleTimers.clear();
      trailLayer.replaceChildren();
    };
  }, []);

  // ----------------------------- MAIN ------------------------------------
  return (
    <main className="home-journey">
      {/* Info Section 2 */}
      <section
        ref={launchStageRef}
        className="home-stage home-stage--launch min-h-screen"
      >
        <div
          className="home-stage__trail"
          ref={trailLayerRef}
          aria-hidden="true"
        >
          <div className="home-stage__trail-sheen" aria-hidden="true" />
        </div>
        <div className="home-stage__content">
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
          <h2 className="display-6 fw-bold mb-3">
            Momentum Building (yeah, this will look better soon)
          </h2>
          <p className="lead mx-auto" style={{ maxWidth: "760px" }}>
            Takeoff!
          </p>
        </div>
      </section>

      {/* Starting Section */}
      <section className="home-stage home-stage--intro" id="intro">
        <div className="home-stage__content">
          <span className="home-kicker">YourBlog</span>
          <h1 className="display-4 fw-bold mb-4">
            Stories that feel like they are arriving from beyond the event
            horizon.
          </h1>
          <p className="lead mb-4">Scroll up to begin the journey.</p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4 ">
            <BlogButton href="/blogs" text="Explore Existing Posts" />
            <BlogButton href="/register" text="Join the Mission" />
          </div>

          <p className="small fw-semibold">
            A Personal and Secure Blog Application.
          </p>
        </div>
      </section>
    </main>
  );
}
