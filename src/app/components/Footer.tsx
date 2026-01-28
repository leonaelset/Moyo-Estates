"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaFacebookF, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const [year, setYear] = useState<number>(2025); // fallback

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Added inline-block to fix hover scale on spans
  const linkClasses =
    "text-sm transition-all duration-300 hover:text-white hover:underline hover:scale-105 cursor-pointer inline-block";

  return (
    <footer className="bg-black text-white w-full py-12 flex flex-col items-center space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:w-5/6 w-full px-4 space-y-6 md:space-y-0">

        {/* Our Company */}
        <div className="flex flex-col space-y-2">
          <span className="font-semibold text-lg">Our Company</span>
          <Link href="/about">
            <span className={linkClasses}>About Moyo Estates</span>
          </Link>

          <a
            href="https://www.linkedin.com/in/biquelmo-pires-ferreira-854826310/"
            target="_blank"
            className={linkClasses}
          >
            Founder: Biguelmo Ferreira
          </a>

          <a
            href="https://www.linkedin.com/in/leonardo-seteko-144ba7320/"
            target="_blank"
            className={linkClasses}
          >
            Co-Founder: Leonardo Seteko
          </a>

          <span className={linkClasses}>Our Story</span>
        </div>

        {/* Work With Us */}
        <div className="flex flex-col space-y-2">
          <span className="font-semibold text-lg">Work With Us</span>
          <span className={linkClasses}>Travel Professionals</span>
          <span className={linkClasses}>Hotel Development</span>
          <span className={linkClasses}>Affiliates</span>
          <span className={linkClasses}>Hospitality Businesses</span>
        </div>

        {/* Stay Updated */}
        <div className="flex flex-col space-y-2">
          <span className="font-semibold text-lg">Stay Updated with Us</span>
          <div className="flex space-x-4 text-xl">
            <a
              href="https://www.instagram.com/moyoestates"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-pink-500 hover:scale-105"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@moyoestates"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:scale-105 text-white"
            >
              <FaTiktok />
            </a>
            <a
              href="https://www.facebook.com/share/1CV6kwengz/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-[#1877F2] hover:scale-105"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://wa.me/244956766885"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-[#25D366] hover:scale-105"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.linkedin.com/company/moyo-estates/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-[#0A66C2] hover:scale-105"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400">&copy; {year} Moyo Estates. All rights reserved.</p>
    </footer>
  );
}
