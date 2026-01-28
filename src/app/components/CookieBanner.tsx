"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  const loadGoogleAnalytics = () => {
    if (typeof window === "undefined") return;

    // Insert GA script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize GA
    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
    `;
    document.head.appendChild(inlineScript);
  };

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) setVisible(true);
    else {
      // Load GA if previously accepted
      if (GA_MEASUREMENT_ID) loadGoogleAnalytics();
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
    if (GA_MEASUREMENT_ID) loadGoogleAnalytics();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col justify-between">
        <p className="mt-4 mb-2 leading-snug text-center text-sm text-gray-700">
          This website uses cookies and similar technologies to collect information you provide and information about your interactions with our sites to improve your experience, analyze performance and traffic on our website, and assist our marketing efforts and customer service. We may share this information with our third-party partners. You can change your{" "}
          <span className="underline cursor-pointer">cookie preferences here</span>. By continuing to browse, you agree to our use of these tools in accordance with our{" "}
          <span className="underline cursor-pointer">Privacy Notice</span> and you agree to the terms of our{" "}
          <span className="underline cursor-pointer">Terms of Service</span>.
        </p>

        <div className="flex justify-end items-center gap-2 mt-2">
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-black text-white border border-black hover:bg-white hover:text-black transition"
          >
            Ok, got it
          </button>

          <button className="px-4 py-2 bg-black text-white border border-black hover:bg-white hover:text-black transition">
            Adjust Preferences
          </button>

          <Link
            href="/cookie-policy"
            className="text-black underline hover:no-underline hover:text-blue-700 transition text-sm"
          >
            Read our Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
