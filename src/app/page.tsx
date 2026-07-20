import type { Metadata } from "next";
import { HomeJourney } from "./components/HomeJourney";

export const metadata: Metadata = {
  title: "Home",
  description:
    "YourBlog is a free blogging platform where anybody is capable of making a post. All you need is an account to get started.",
};

export default function Home() {
  return <HomeJourney />;
}
