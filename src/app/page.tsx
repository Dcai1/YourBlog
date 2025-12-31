import Link from "next/link";
import { BlogButton } from "./components/BlogButton";
import { Hello } from "./components/hello";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main className="container d-flex flex-column align-items-center justify-content-center">
      <Hello />

      <div className="p-5 min-w-screen text-center bg-secondary">
        <h1>Welcome to Your Blog!</h1>
      </div>

      <section className="page-section d-flex flex-column flex-grow-1 gap-3 align-items-center px-3 my-3 gap-3 justify-content-between">
        <p className="fs-3 text-center my-5">
          A simple, quick blogging website that gets the job done. Allows anyone
          to create a blog post.
          <br /> Create, edit, and modify your posts as effortlessly as
          possible.
        </p>

        <BlogButton
          href="/blogs"
          text="Explore Articles"
          size="fs-1"
          gradient="btn-primary-to-dark"
        />

        <div>
          <p className="fs-2 text-primary"> Scroll Down </p>
        </div>
      </section>

      <div className="d-flex flex-column section-10 bg-warning align-items-center justify-content-center">
        <div className="warning-box">
          <h1 className="fs-1 fw-bold my-auto blog-warning mb-5">But WAIT!</h1>
          <p className="fs-3 text-center mt-3 blog-warning">
            {" "}
            You should read this below before continuing...
          </p>
        </div>
      </div>

      <div className="container d-flex flex-column min-w-height p-5 bg-info rounded m-3 mb-5">
        <div className="align-items-center justify-content-center">
          <p className="fs-5">
            This site is a{" "}
            <Link
              href={"https://en.wikipedia.org/wiki/Minimum_viable_product"}
              rel="noopener noreferrer"
              target="_blank"
            >
              Minimum Viable Product.
            </Link>{" "}
            This was developed for experience by one person. Expect only the
            essential functionalities to be implemented (so, not additions like{" "}
            <b>Likes/Dislikes, Comments, or article view counts.</b>)
          </p>
          <h2>What you can do:</h2>
          <ol>
            <li>Register/Login</li>
            <li>Create Blog Posts</li>
            <li>Modify and Delete Blog Posts</li>
            <li>
              View Blog Postings on the <Link href={"/blogs"}>Blogs page</Link>
            </li>
          </ol>
          <p className="fs-6 fst-italic">
            However, user blog posts are treated differently. Refer to the{" "}
            <Link href={"/about"}>About</Link> page for more details.
          </p>
        </div>
      </div>
    </main>
  );
}
