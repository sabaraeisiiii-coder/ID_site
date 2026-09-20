/**
 * Contact page — Server Component for info + Client form sub-component.
 */

import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

import { Section, Container, Stack, Grid } from "@/design-system/primitives";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ContactForm } from "@/components/shared/contact-form";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const { contact } = siteConfig;

  const infoItems = [
    {
      icon: Phone,
      label: "تلفن تماس",
      value: contact.phone,
      href: `tel:${contact.phoneLatin}`,
      dir: "ltr" as const,
    },
    {
      icon: Mail,
      label: "ایمیل",
      value: contact.email,
      href: `mailto:${contact.email}`,
      dir: "ltr" as const,
    },
    {
      icon: MapPin,
      label: "نشانی",
      value: contact.address,
      href: undefined,
    },
    {
      icon: Clock,
      label: "ساعات کاری",
      value: contact.hours,
      href: undefined,
    },
  ];

  return (
    <main className="bg-background">
      <Section spacing="md">
        <Container>
          <Stack gap={6}>
            <Breadcrumb items={[{ label: "تماس با ما" }]} />

            <PageHeader
              title="تماس با ما"
              description="سوال یا پیشنهادی دارید؟ خوشحال می‌شویم بشنویم. تیم پشتیبانی ما آماده پاسخ‌گویی است."
              eyebrow="پشتیبانی"
            />

            <Grid cols={1} colsLg={2} gap={6}>
              {/* Info column */}
              <Stack gap={4}>
                <div
                  className="bg-surface border border-border p-6 shadow-sm"
                  style={{ borderRadius: "var(--radius-xl)" }}
                >
                  <Stack gap={5}>
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <span
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                        style={{
                          background: "var(--surface-secondary)",
                          color: "var(--primary)",
                        }}
                      >
                        <MessageCircle size={22} strokeWidth={1.75} />
                      </span>
                      <Stack gap={0}>
                        <h2 className="text-base font-semibold">راه‌های ارتباطی</h2>
                        <p className="text-xs text-foreground-tertiary">
                          در هر زمان از روز با ما در ارتباط باشید.
                        </p>
                      </Stack>
                    </div>

                    <Stack gap={4}>
                      {infoItems.map((item) => {
                        const Icon = item.icon;
                        const content = (
                          <Stack gap={1}>
                            <span className="text-xs text-foreground-tertiary">
                              {item.label}
                            </span>
                            <span
                              className="text-sm font-medium text-foreground nums-persian"
                              dir={item.dir ?? "rtl"}
                            >
                              {item.value}
                            </span>
                          </Stack>
                        );
                        return (
                          <div
                            key={item.label}
                            className="flex items-start gap-3"
                          >
                            <span
                              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                              style={{
                                background: "var(--surface-secondary)",
                                color: "var(--foreground-secondary)",
                              }}
                            >
                              <Icon size={18} strokeWidth={1.75} />
                            </span>
                            {item.href ? (
                              <a
                                href={item.href}
                                className="block hover:opacity-80 transition-opacity"
                                style={{ transitionDuration: "var(--duration-fast)" }}
                              >
                                {content}
                              </a>
                            ) : (
                              content
                            )}
                          </div>
                        );
                      })}
                    </Stack>
                  </Stack>
                </div>

                <div
                  className="bg-surface border border-border p-6 shadow-sm overflow-hidden"
                  style={{ borderRadius: "var(--radius-xl)" }}
                >
                  <Stack gap={3}>
                    <h3 className="text-sm font-semibold">ما را در نقشه پیدا کنید</h3>
                    <div
                      className="w-full h-48 rounded-md bg-surface-tertiary flex items-center justify-center"
                      style={{ borderRadius: "var(--radius-md)" }}
                    >
                      <span className="inline-flex items-center gap-2 text-sm text-foreground-tertiary">
                        <MapPin size={16} />
                        {contact.address}
                      </span>
                    </div>
                  </Stack>
                </div>
              </Stack>

              {/* Form column */}
              <div
                className="bg-surface border border-border p-6 sm:p-8 shadow-sm"
                style={{ borderRadius: "var(--radius-xl)" }}
              >
                <Stack gap={6}>
                  <Stack gap={2}>
                    <h2 className="text-lg font-semibold">پیام بفرستید</h2>
                    <p className="text-sm text-foreground-secondary">
                      فرم زیر را تکمیل کنید؛ پاسخ شما از طریق ایمیل ارسال خواهد شد.
                    </p>
                  </Stack>
                  <ContactForm />
                </Stack>
              </div>
            </Grid>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
