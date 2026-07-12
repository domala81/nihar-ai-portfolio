import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import { personal } from "@/data";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = "https://nihar-ai-portfolio.vercel.app";
const TITLE = "Nihar Domala — Data Engineer → AI Systems";
const DESCRIPTION =
  "Data Engineer moving into AI Systems Engineering. Building the infrastructure that scales intelligent models.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: personal.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#05070c",
  colorScheme: "dark",
};

// Person schema for rich results (recruiter-facing SEO).
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  url: SITE_URL,
  email: `mailto:${personal.email}`,
  jobTitle: "Data Engineer / AI Systems Engineer",
  address: { "@type": "PostalAddress", addressLocality: personal.location },
  sameAs: [personal.socials.github.href, personal.socials.linkedin.href],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "The George Washington University" },
    { "@type": "CollegeOrUniversity", name: "Indian Institute of Technology, Kharagpur" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
