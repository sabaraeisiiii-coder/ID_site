import { redirect } from "next/navigation";

/** Compatibility redirect for bookmarks that used the former combined app. */
export default function LegacyAdminIndex() {
  redirect("/");
}
