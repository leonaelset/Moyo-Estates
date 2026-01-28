"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Footer from "./components/Footer";

const attractions = [
  { image: "/Angola/Beach-1.jpg", name: "Beach", position: "80% 50%" },
  { image: "/Angola/Serra-de-Leba-1.jpg", name: "Serra de Leba", position: "center" },
  { image: "/Angola/Christ-1.jpg", name: "Christ", position: "50% 45%" },
  { image: "/Angola/Fields.jpg", name: "Lobito", position: "center" },
  { image: "/Angola/Resort-1.jpg", name: "Resort", position: "center" },
];

const tripOptions = ["Family"];

const familyLocationsOrdered = [
  { name: "Luanda Beach", image: "/Luanda/Random-beach.jpg" },
  { name: "Banco Nacional de Angola", image: "/Luanda/BNA.jpg" },
  { name: "Pululukwa", image: "/Luanda/Pululukwa.jpg" },
  { name: "Quad Biking Activities", image: "/Luanda/Quad-Biking.jpg" },
  { name: "Beleza Beach", image: "/Luanda/Beach-pic-again.jpg" },
  { name: "Pool", image: "/Luanda/Pool.jpg" },
  { name: "Fields", image: "/Angola/Fields.jpg" },
];

export default function Page() {
  const [hoveredCaption, setHoveredCaption] = useState<number | null>(null);
  const [hoverGetInTouch, setHoverGetInTouch] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("Family");
  const tripSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTripOption = (event: CustomEvent) => {
      const option = event.detail;
      if (tripOptions.includes(option)) {
        setSelectedOption(option);
        tripSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("setTripOption", handleTripOption as EventListener);
    return () => {
      window.removeEventListener("setTripOption", handleTripOption as EventListener);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Swiper Section */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        className="w-full h-screen relative"
      >
        {attractions.map((attraction, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-screen">
              <img
                src={attraction.image}
                alt={attraction.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: attraction.position }}
              />
              <div
                onMouseEnter={() => setHoveredCaption(idx)}
                onMouseLeave={() => setHoveredCaption(null)}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 select-none flex items-center justify-center w-full max-w-[90%]"
              >
                <div className="flex-1 h-[1px] bg-white opacity-50 mr-2" />
                <div
                  className={`px-3 py-1 text-center text-lg sm:text-xl font-serif italic transition-all duration-300 ${
                    hoveredCaption === idx ? "bg-white text-black" : "bg-black/60 text-white"
                  }`}
                  style={{ fontFamily: `"Bodoni 72", serif` }}
                >
                  {attraction.name}
                </div>
                <div className="flex-1 h-[1px] bg-white opacity-50 ml-2" />
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Overlay container */}
        <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg max-w-xl w-full mx-4 p-6 sm:p-8 text-center pointer-events-auto">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-black"
              style={{ fontFamily: `"Bodoni 72", serif`, fontStyle: "italic" }}
            >
              Start planning your next trip
            </h2>
            <p className="text-black mb-4 sm:mb-6 text-sm sm:text-base">
              Discover Angola’s beauty, from serene beaches to breathtaking landscapes.
              Let us help you craft your perfect getaway.
            </p>
            <button
              onMouseEnter={() => setHoverGetInTouch(true)}
              onMouseLeave={() => setHoverGetInTouch(false)}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-300 ${
                hoverGetInTouch ? "bg-black text-white" : "bg-yellow-500 text-black"
              }`}
            >
              Get in touch
            </button>
          </div>
        </div>
      </Swiper>

      {/* Trip Section */}
      <section
        ref={tripSectionRef}
        id="trip-section"
        className="bg-white w-full py-12 sm:py-16 flex flex-col items-center space-y-10 sm:space-y-12 px-2"
      >
        <h2
          className="text-3xl sm:text-4xl text-center"
          style={{ fontFamily: `"Bodoni 72", serif`, fontWeight: 700, fontStyle: "italic" }}
        >
          Your next trip starts here
        </h2>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {tripOptions.map((option) => (
            <span
              key={option}
              className="text-base sm:text-lg text-gray-800 cursor-pointer relative group transition-all duration-300 select-none"
              onClick={() => setSelectedOption(option)}
            >
              {option}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-800 transition-all duration-300 group-hover:w-full" />
            </span>
          ))}
        </div>

        {selectedOption === "Family" && (
          <div className="w-full max-w-6xl flex flex-col space-y-6 sm:space-y-8 px-2 sm:px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {familyLocationsOrdered.slice(0, 2).map((location, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-xl">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-64 sm:h-80 object-cover rounded-xl"
                  />
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                    <span className="font-semibold text-white text-sm sm:text-base">{location.name}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {familyLocationsOrdered.slice(2, 5).map((location, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-xl">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl"
                  />
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                    <span className="font-semibold text-white text-sm sm:text-base">{location.name}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {familyLocationsOrdered.slice(5).map((location, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-xl">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-64 sm:h-80 object-cover rounded-xl"
                  />
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                    <span className="font-semibold text-white text-sm sm:text-base">{location.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />

      <style jsx>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.45) !important;
          border-radius: 50%;
          width: 40px !important;
          height: 40px !important;
          z-index: 60 !important;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          color: white !important;
          font-size: 18px !important;
          font-weight: 700;
        }
        .swiper-pagination-bullet {
          background: white !important;
        }
      `}</style>
    </div>
  );
}
