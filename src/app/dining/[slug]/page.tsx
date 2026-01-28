"use client";

import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaInstagram, FaFacebook, FaWhatsapp, FaPhone } from "react-icons/fa";

export default function RestaurantPage() {
  const params = useParams();
  const slug = params.slug as string;

  if (slug.toLowerCase() === "shogun") {
    return (
      <div className="w-full relative flex flex-col min-h-screen bg-white">
        {/* Main transparent Navigation */}
        <Navbar />

        {/* Top section with background image */}
        <div
          className="w-full h-[85vh] md:h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/Restaurants/Shogun-Restaurant.jpg')" }}
        >
          <div className="bg-black/50 p-6 md:p-8 text-center max-w-2xl w-full">
            <h1 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.2em] text-white mb-3">
              Shogun Restaurant
            </h1>
            <p className="text-white text-base md:text-lg max-w-2xl mx-auto mb-4">
              Experience fine Japanese dining with sushi, teppanyaki, and traditional dishes in an elegant setting.
            </p>
            <a
              href="https://api.whatsapp.com/send?phone=244929093241"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-white px-5 py-2 text-white text-sm tracking-wider hover:bg-white hover:text-black transition duration-300 mb-4"
            >
              Make a Reservation
            </a>
          </div>
        </div>

        {/* Content wrapper */}
        <div className="flex-grow bg-white">
          <div className="max-w-6xl mx-auto p-6 mt-16">
            <div className="grid md:grid-cols-2 gap-8 items-start relative">
              {/* LEFT SIDE - Text & Lines & Contact */}
              <div className="flex flex-col items-center text-center text-gray-800 relative pb-20 bg-white">
                {/* Top line */}
                <div className="w-3/4 h-[1px] bg-black mb-6"></div>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-serif uppercase tracking-[0.2em] mb-4">
                  Shogun Restaurant
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base leading-relaxed mb-4 w-3/4">
                  Shogun Restaurant offers a refined Japanese dining experience with attention to detail, quality ingredients, and a tranquil ambiance. Whether you’re enjoying fresh sushi or a teppanyaki performance, every visit promises elegance.
                </p>

                {/* Phone */}
                <div className="flex items-center gap-2 text-lg mb-4 text-gray-700">
                  <FaPhone /> +244 929 093 241
                </div>

                {/* Social Icons */}
                <div className="flex gap-6 text-2xl text-gray-700">
                  <a
                    href="https://www.instagram.com/shogunluanda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 transition-colors duration-300 hover:scale-110"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://www.facebook.com/shogunluanda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors duration-300 hover:scale-110"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://api.whatsapp.com/send?phone=244929093241"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors duration-300 hover:scale-110"
                  >
                    <FaWhatsapp />
                  </a>
                </div>

                {/* Bottom line aligned with image height */}
                <div className="w-3/4 h-[1px] bg-black absolute bottom-0"></div>
              </div>

              {/* RIGHT SIDE - Portrait image */}
              <div className="flex justify-center bg-white">
                <img
                  src="/Restaurants/Shogun.jpg"
                  alt="Shogun Restaurant"
                  className="w-[400px] md:w-[440px] h-[580px] md:h-[620px] object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-semibold mb-2">Slug page test</h1>
      <p>Current slug: {slug}</p>
    </div>
  );
}
