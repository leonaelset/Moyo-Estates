"use client";

import Image from "next/image";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <section className="flex flex-col items-center pt-20 md:pt-24 px-6 md:px-16 bg-white space-y-16 pb-20 md:pb-32">
        {/* Main Heading */}
        <h1
          className="text-4xl md:text-5xl font-light text-center"
          style={{
            letterSpacing: "1.5px",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Company Overview
        </h1>

        {/* Side-by-side Image & Paragraphs */}
        <div className="flex flex-col md:flex-row items-start justify-between w-full max-w-6xl space-y-12 md:space-y-0 md:space-x-12">
          {/* Left: Image */}
          <div className="md:w-1/2 w-full">
            <Image
              src="/Luanda/Moyo.jpg"
              alt="Angola Landscape"
              width={900}
              height={600}
              className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] object-cover rounded-lg"
              priority
            />
          </div>

          {/* Right: Paragraphs */}
          <div
            className="md:w-1/2 w-full text-left text-gray-700 space-y-4 flex flex-col justify-start"
            style={{ fontFamily: '"Merriweather", serif' }}
          >
            <p>
              <strong>Moyo Estates</strong> is a premier travel and hospitality
              platform dedicated to bringing people together through unforgettable
              experiences and stunning estates across Angola. Our mission is to
              position Angola as one of Africa’s top travel destinations by
              delivering exciting adventures, exceptional stays, and authentic
              cultural experiences.
            </p>
            <p>
              We provide personalized travel packages, curated itineraries, and
              exclusive estate stays to ensure every visit is seamless, luxurious,
              and memorable. Whether for leisure, business, or cultural exploration,
              Moyo Estates crafts experiences that delight and inspire.
            </p>
            <p>
              Explore Angola your way with romantic escapes, beach retreats, city
              explorations, cultural journeys, thrilling outdoor activities, and
              more. Choose from ready-made packages or create your own adventure
              tailored to your preferences.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// Next.js settings
export const dynamic = "force-dynamic";
export const hideNavbar = true;
