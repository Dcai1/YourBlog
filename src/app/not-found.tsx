import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center box-primary p-5 rounded-4 shadow-sm">
        <p className="text-uppercase fw-semibold text-muted mb-3">404</p>
        <h1 className="display-5 fw-bold mb-3">Page not found</h1>
        <p className="text-muted mb-4">
          The page you are looking for may have been moved, deleted, or never
          existed.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link href="/" className="btn btn-primary">
            Back home
          </Link>
          <Link href="/blogs" className="btn btn-outline-primary">
            Browse posts
          </Link>
        </div>
      </div>
    </main>
  );
}
