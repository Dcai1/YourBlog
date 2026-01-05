import BlogsPage from "./BlogsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Blog Posts",
  description: "Read various blog posts loaded straight from our database.",
};

export default function Blog() {
  return <BlogsPage />;
}
