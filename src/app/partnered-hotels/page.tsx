"use client";

import React, { useState, useEffect, useRef } from "react";
import { Facebook, Instagram, Phone, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

export default function PartneredHotels() {
  const router = useRouter();

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | null>(new Date());
  const [checkOut, setCheckOut] = useState<Date | null>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [nights, setNights] = useState(1);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  useEffect(() => {
    if (checkIn && checkOut) {
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCalendar = () => setCalendarOpen(!calendarOpen);

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut || nights <= 0) return;
    const bookingData = {
      hotelId: "doritis",
      adults,
      children,
      checkIn,
      checkOut,
      nights,
    };
    localStorage.setItem("bookingStep0", JSON.stringify(bookingData));
    router.push(`/book/step1?hotelId=doritis`);
  };

  const getMonthDates = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const dates = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const monthDates = getMonthDates(new Date());

  const isDateSelected = (date: Date) => {
    if (!checkIn) return false;
    if (!checkOut) return date.getTime() === checkIn.getTime();
    return date >= checkIn && date <= checkOut;
  };

  const handleDateClick = (date: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (checkIn && !checkOut) {
      if (date < checkIn) {
        setCheckOut(checkIn);
        setCheckIn(date);
      } else {
        setCheckOut(date);
      }
    }
  };

  const isInRange = (date: Date) => {
    if (checkIn && checkOut) return date >= checkIn && date <= checkOut;
    if (checkIn && hoverDate) {
      const start = checkIn < hoverDate ? checkIn : hoverDate;
      const end = checkIn > hoverDate ? checkIn : hoverDate;
      return date >= start && date <= end;
    }
    return false;
  };

  return (
    <div className="w-full relative flex flex-col min-h-screen">
      {/* Hero Section */}
      <div
        className="relative w-full h-[95vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/doritis/Doritis.jpg')" }}
      >
        <div className="bg-black/50 p-6 md:p-8 w-11/12 md:w-2/3 flex flex-col items-center text-center z-10">
          <h2 className="text-3xl md:text-4xl font-didot uppercase tracking-[0.2em] text-orange-600 mb-2">
            Doritis Guesthouse
          </h2>
          <p className="text-gray-200 max-w-2xl mb-4 font-didot">
            A cozy and comfortable boutique guesthouse in Luanda with modern
            amenities, ideal for leisure or business stays.
          </p>
          <p className="text-gray-200 flex items-center gap-2 mb-1 font-didot">
            📍 Rua Luther King 58, Ingombota, Luanda, Angola
          </p>
          <p className="text-gray-200 flex items-center gap-2 mb-2 font-didot">
            <Phone size={16} /> +244 923 571 522
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="https://www.facebook.com/doritisguesthouse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-600 transition-colors duration-300"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/doritisguesthouse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500 transition-colors duration-300"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Booking Box — hidden but preserved */}
        <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 z-20 w-[95%] md:w-[80%] bg-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl border border-gray-300 hidden">
          {/* Dates */}
          <div className="flex-1 relative">
            <label
              className="block font-didot uppercase tracking-[0.2em] text-gray-700 text-sm mb-1 cursor-pointer"
              onClick={toggleCalendar}
            >
              Select Dates
            </label>
            <div
              className="flex justify-between items-center border-b border-gray-500 cursor-pointer py-2 w-[80%]"
              onClick={toggleCalendar}
            >
              <span className="text-gray-700 font-didot">
                {checkIn?.toLocaleDateString()} - {checkOut?.toLocaleDateString()}
              </span>
              <span className="text-gray-700">▾</span>
            </div>

            {calendarOpen && (
              <div
                ref={calendarRef}
                className="absolute top-full z-50 mt-2 bg-white shadow-lg p-4 w-[550px] grid grid-cols-7 gap-2"
              >
                {monthDates.map((date) => {
                  const selected = isDateSelected(date);
                  const inRange = isInRange(date);
                  return (
                    <div
                      key={date.toString()}
                      className={`flex flex-col justify-between items-center w-14 h-14 border border-gray-300 cursor-pointer ${
                        selected || inRange
                          ? "bg-black text-white"
                          : "bg-white text-gray-700"
                      }`}
                      onMouseEnter={() => setHoverDate(date)}
                      onMouseLeave={() => setHoverDate(null)}
                      onClick={() => handleDateClick(date)}
                    >
                      <span className="text-sm font-semibold mt-1">
                        {date.getDate()}
                      </span>
                      <span className="text-xs text-gray-500 mb-1">$0</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Adults */}
          <div className="flex flex-col items-start">
            <label className="font-didot uppercase tracking-[0.2em] text-gray-700 text-sm mb-1">
              Adults
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 border border-gray-600"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{adults}</span>
              <button
                onClick={() => setAdults((prev) => prev + 1)}
                className="w-10 h-10 border border-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex flex-col items-start">
            <label className="font-didot uppercase tracking-[0.2em] text-gray-700 text-sm mb-1">
              Children
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                className="w-10 h-10 border border-gray-600"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{children}</span>
              <button
                onClick={() => setChildren((prev) => prev + 1)}
                className="w-10 h-10 border border-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Check Availability */}
          <div>
            <button onClick={handleCheckAvailability}>
              Check Availability
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="w-full flex flex-col items-center justify-center py-28 px-6 bg-white">
        <img
          src="/Doritis/Doritos-wall.jpg"
          alt="Doritis Guesthouse"
          draggable={false}
          className="w-[80%] max-w-[900px] h-[350px] object-cover shadow-md mb-8 pointer-events-none select-none"
        />

        <h2 className="font-didot uppercase tracking-[0.25em] text-3xl text-gray-800 mb-6 text-center">
          Welcome to Doritis Guesthouse
        </h2>

        {/* Direct Reservation */}
        <a
          href="https://direct-book.com/properties/doritisguesthousemaculusso-1?locale=en&items[0][adults]=2&items[0][children]=0&items[0][infants]=0&currency=USD&checkInDate=2026-01-12&checkOutDate=2026-01-13&trackPage=yes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white font-didot uppercase tracking-[0.2em] py-3 px-6 mb-6 hover:bg-white hover:text-black transition-colors duration-300"
        >
          Direct Reservation
        </a>

        <p className="max-w-4xl text-gray-700 font-didot leading-relaxed text-base md:text-lg text-left">
          Located in Luanda, just 100 meters from Kinaxixi Square and less than
          150 meters from the Natural History Museum, Doritis Guest House
          Maculusso offers accommodations across 3 floors with a total of 18
          rooms. Complimentary WiFi and free private parking are available.
        </p>
      </div>

      <Footer />
    </div>
  );
}
