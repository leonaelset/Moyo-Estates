// src/app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar";
import CookieBanner from "./components/CookieBanner";
import AnalyticsTracker from "./components/AnalyticsTracker";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // You can manage navbar visibility using route conditions instead (optional)
  const hideNavbar =
    typeof window !== "undefined" &&
    ["/book/step3", "/checkout"].includes(window.location.pathname);

  return (
    <html lang="en">
      <head>
        {/* Google Analytics snippet */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', { page_path: window.location.pathname });
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        {!hideNavbar && <Navbar />}
        {children}
        <CookieBanner />
        <AnalyticsTracker /> {/* Tracks SPA route changes */}
      </body>
    </html>
  );
}
