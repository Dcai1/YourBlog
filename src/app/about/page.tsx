import Link from "next/link";

export default function About() {
  return (
    <main className="container py-5 min-h-screen">
      <div className="row">
        <div className="col-12 col-md-3 d-flex align-items-start">
          <h1 className="blog-title my-auto">About</h1>
        </div>

        <div className="col-12 col-md-9 box-primary">
          <p className="fs-5 mb-3">
            Welcome! This is a blogging website where anyone can create a blog
            post after making an account. <br /> This site is a{" "}
            <b>
              <Link
                href={"https://en.wikipedia.org/wiki/Minimum_viable_product"}
                rel="noopener noreferrer"
                target="_blank"
              >
                Minimum Viable Product
              </Link>
            </b>
            {", "}
            so it only holds the main features since it was developed by one
            person.
          </p>
          <h3 className="fs-3 my-3 blog-title">
            <b> What&apos;s in this site?</b>
          </h3>
          <p className="fs-5">
            The ability to view blog posts by clicking on them and reading to
            your heart&apos;s content. Want to contribute? You can create an
            account and log in, which will authorize you to create a blog post
            immediately!{" "}
            <b>
              Unfortunately, only you can view your own posts.{" "}
              <span className="highlight">
                Since anyone can create an account and start posting
                immediately, this had to be implemented to prevent the risk of{" "}
                <Link
                  href={
                    "https://www.cloudflare.com/learning/security/threats/cross-site-scripting"
                  }
                  rel="noreferrer"
                  target="_blank"
                >
                  Cross Site Scripting/XSS!
                </Link>
              </span>
            </b>{" "}
            <br />
            For further clarification on how to make a blog post, take a look at
            this{" "}
            <Link href={"/placeholder"} rel="noreferrer" target="_blank">
              <b>link</b>
            </Link>
            .
          </p>

          <hr className="my-5" />

          <h3 className="fs-3 mt-5 blog-title">
            <b> And anything else?</b>
          </h3>
          <p className="fs-5">
            ..well, that&apos;s about it. I made this website to further my
            experience and attach onto my list of personal projects, so there
            isn&apos;t much to bring up... <br />
            So I figure I should move onto the tools used to make this possible.
            <br />
            <br />
            This site is built with Next.js (React) and uses a few third-party
            libraries to speed development and add features:{" "}
            <span className="highlight">
              <Link
                href="https://getbootstrap.com/"
                target="_blank"
                rel="noreferrer"
              >
                Bootstrap 5
              </Link>
              ,{" "}
              <Link
                href="https://tailwindcss.com/"
                target="_blank"
                rel="noreferrer"
              >
                Tailwind
              </Link>
              ,{" "}
              <Link
                href={"https://quilljs.com/"}
                rel="noreferrer"
                target="_blank"
              >
                {" "}
                Quill
              </Link>{" "}
              (rich text editor), and{" "}
              <Link
                href="https://www.prisma.io/"
                target="_blank"
                rel="noreferrer"
              >
                Prisma
              </Link>{" "}
              (for the database).
            </span>{" "}
            This app was deployed on{" "}
            <Link href="https://vercel.com/" target="_blank" rel="noreferrer">
              Vercel
            </Link>
            , as the URL also shows.
          </p>
        </div>
      </div>
    </main>
  );
}
