"use client";

import React, { useRef } from "react";
import { Facebook, Instagram } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function LuandaPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full relative flex flex-col min-h-screen bg-white">
      {/* Main transparent Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative w-full h-[95vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/luanda/luanda-skyscraper.jpg')" }}
      >
        {/* Overlay Box */}
        <div className="bg-black/50 p-6 md:p-8 w-11/12 md:w-2/3 flex flex-col items-center text-center z-10 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-didot uppercase tracking-[0.2em] text-white-600 mb-4">
            Top Things to Do in Luanda
          </h2>

          <p className="text-gray-200 max-w-2xl mb-6 font-didot">
            Discover Luanda’s top experiences — from cultural landmarks and nightlife to hidden local gems.
          </p>

          <p className="text-gray-200 flex items-center gap-2 mb-6 font-didot">
            📍 Luanda, Angola
          </p>

          <div className="flex gap-4 mb-6">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-600 transition-colors duration-300"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/intercontinentalluanda?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500 transition-colors duration-300"
            >
              <Instagram size={20} />
            </a>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToContent}
            className="border border-white text-white font-didot uppercase tracking-[0.2em] py-3 px-8 hover:bg-white hover:text-black transition-colors duration-300"
          >
            Explore
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div ref={contentRef} className="flex-grow bg-white">
        <div className="max-w-6xl mx-auto px-6 py-32 space-y-36">
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-didot font-semibold text-gray-900 mb-3">
              The Capital City
            </h2>
            <p className="text-gray-600 font-didot leading-relaxed max-w-3xl">
              Luanda is the capital and largest city of Angola, located along the Atlantic coast. It serves as the country’s economic, political, and cultural center.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-didot font-semibold text-gray-900 mb-3">
              Rich History
            </h2>
            <p className="text-gray-600 font-didot leading-relaxed max-w-3xl">
              Founded in 1576, Luanda has a layered history shaped by colonial influence, trade, and post-independence growth, reflected in its architecture and neighborhoods.
            </p>
          </div>

          {/* Placeholder Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            <div className="h-64 bg-gray-200 shadow-md flex items-center justify-center text-gray-500 font-didot">
              Placeholder 1
            </div>
            <div className="h-64 bg-gray-200 shadow-md flex items-center justify-center text-gray-500 font-didot">
              Placeholder 2
            </div>
            <div className="h-64 bg-gray-200 shadow-md flex items-center justify-center text-gray-500 font-didot">
              Placeholder 3
            </div>
            <div className="h-64 bg-gray-200 shadow-md flex items-center justify-center text-gray-500 font-didot">
              Placeholder 4
            </div>
            <div className="h-64 bg-gray-200 shadow-md flex items-center justify-center text-gray-500 font-didot">
              Placeholder 5
            </div>
            <div className="h-64 bg-gray-200 shadow-md flex items-center justify-center text-gray-500 font-didot">
              Placeholder 6
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
