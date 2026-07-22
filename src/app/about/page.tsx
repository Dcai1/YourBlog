import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function About() {
  return (
    <main className="page-shell min-h-screen">
      <div className="page-frame">
        <div className="page-grid page-grid--about">
          <aside className="page-rail">
            <span className="home-kicker">Mission brief</span>
            <h1 className="page-title">About</h1>
            <p className="page-subtitle mt-3">
              A secure publishing space for stories, authors, and readers.
            </p>
          </aside>

          <section className="page-panel">
            <p className="fs-5 mb-3">
              YourBlog is a space-themed, full-stack blogging platform built to
              feel polished, secure, and easy to maintain. Readers can browse
              published posts, while signed-in authors can create drafts,
              publish when ready, and manage their own content from a dedicated
              dashboard.
            </p>

            <h3 className="fs-3 my-3 blog-title">
              <b>What&apos;s in this site?</b>
            </h3>
            <p className="fs-5">
              The experience covers account creation, login, session-based auth,
              rich-text writing, draft/publish workflows, and a public reading
              experience that only exposes published content. Drafts remain
              private to the author until they are published.
            </p>

            <hr className="my-5" />

            <h3 className="fs-3 mt-5 blog-title">
              <b>Stack and tooling</b>
            </h3>
            <p className="fs-5">
              This application is currently built with Next.js 15, React 19, and
              TypeScript on the frontend, backed by PostgreSQL, Prisma ORM, and
              custom session-based authentication with bcrypt. The UI uses
              Bootstrap 5 and Sass, while rich-text editing is powered by Quill
              and content is sanitized with sanitize-html before it is stored or
              rendered.
            </p>
            <p className="fs-5 mb-0">
              The project is still moving toward a more polished production
              experience, but the core security, ownership, and publishing flows
              are already in place. You can explore the public blog list or jump
              into the dashboard once you&apos;re signed in.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
