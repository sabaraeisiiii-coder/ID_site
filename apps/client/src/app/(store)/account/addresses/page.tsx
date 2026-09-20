/**
 * Addresses page — Server Component.
 * Lists the user's saved addresses and provides an "افزودن آدرس جدید" button.
 */

import { MapPin } from "lucide-react";

import { customerService } from "@/domains/customer";
import { Section, Stack } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { AccountNav } from "@/components/store/account-nav";
import { AddAddressButton, AddressCard } from "./address-card";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const [user, addresses] = await Promise.all([
    customerService.getCurrent(),
    customerService.listAddresses("u1"),
  ]);

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <main className="bg-background">
      <Section spacing="md" containerSize="default">
        <Stack gap={6}>
          <Breadcrumb
            items={[
              { label: "حساب کاربری", href: "/account" },
              { label: "آدرس‌ها" },
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
            <div className="flex flex-col gap-6 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl sm:text-2xl font-bold">آدرس‌های من</h1>
                  <p className="text-sm text-foreground-secondary">
                    آدرس‌های تحویل خود را مدیریت کنید.
                  </p>
                </div>
                <AddAddressButton />
              </div>

              {addresses.length === 0 ? (
                <div
                  className="bg-surface border border-border"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  <EmptyState
                    icon={MapPin}
                    title="هنوز آدرسی ثبت نکرده‌اید"
                    description="برای تسهیل فرآیند خرید، حداقل یک آدرس تحویل اضافه کنید."
                    action={<AddAddressButton />}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <AddressCard key={address.id} address={address} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Stack>
      </Section>
    </main>
  );
}
