import Link from "next/link";

type BlogProps = {
  href: string;
  text: string;
  size?: string;
  gradient?: string;
};

export const BlogButton = ({ href, text, size, gradient }: BlogProps) => {
  return (
    <Link
      className={`btn btn-outline-primary ${size ? size : "fs-6"} ${
        gradient ? gradient : ""
      } `}
      href={href}
    >
      {text}
    </Link>
  );
};
