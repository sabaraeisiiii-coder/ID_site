import { redirect } from "next/navigation";

/** Compatibility redirect for the former /admin/* URL namespace. */
export default async function LegacyAdminRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  redirect(`/${slug.join("/")}`);
}
