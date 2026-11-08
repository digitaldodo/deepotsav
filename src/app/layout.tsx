import type { Metadata } from "next";
import "./globals.css";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Deepotsav — Premium Diwali Gifting",
  description:
    "Create beautiful, interactive Diwali greetings for your loved ones. Light diyas, paint rangoli, and share personalized experiences.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Deepotsav — Premium Diwali Gifting",
    description: "Create beautiful, interactive Diwali greetings for your loved ones.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deepotsav — Premium Diwali Gifting",
    description: "Create beautiful, interactive Diwali greetings for your loved ones.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0A0A1A" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  );
}
