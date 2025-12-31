import { prisma } from "@/app/lib/prisma_client";
import { notFound } from "next/navigation";

import EditForm from "./EditForm";

interface BlogParams {
  params: Promise<{ id: string }>;
}

export default async function Edit({ params }: BlogParams) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }
  return <EditForm post={post} />;
}
