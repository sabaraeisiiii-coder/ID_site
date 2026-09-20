/**
 * Wishlist page — Server Component.
 * Renders sidebar + breadcrumb + <WishlistContent /> (client).
 */

import { customerService } from "@/domains/customer";
import { Section, Stack } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { AccountNav } from "@/components/store/account-nav";
import { WishlistContent } from "./wishlist-content";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const user = await customerService.getCurrent();
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <main className="bg-background">
      <Section spacing="md" containerSize="default">
        <Stack gap={6}>
          <Breadcrumb
            items={[
              { label: "حساب کاربری", href: "/account" },
              { label: "علاقه‌مندی‌ها" },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div
                className="sticky top-6 bg-surface border border-border p-4"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <div className="flex items-center gap-3 pb-4 mb-3 border-b border-border">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground text-sm font-semibold"
                    style={{ borderRadius: "var(--radius-full)" }}
                  >
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{user.fullName}</p>
                    <p className="text-xs text-foreground-tertiary truncate">{user.role}</p>
                  </div>
                </div>
                <AccountNav />
              </div>
            </aside>

            {/* Main */}
            <WishlistContent />
          </div>
        </Stack>
      </Section>
    </main>
  );
}
