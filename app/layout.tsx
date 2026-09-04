import type { Metadata } from "next";
import { SITE, pageTitle } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  verification: {
    google: "SWCb1kVpxPhTAa9earPxsqyR7tKIva1yLTcR3VitWhw",
  },
  title: {
    default: pageTitle(),
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_GB",
    title: pageTitle(),
    description: SITE.description,
    url: "/",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
