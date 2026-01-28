"use client";

import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// Register countries
countries.registerLocale(enLocale);
const countryList = Object.entries(
  countries.getNames("en", { select: "official" })
).sort(([codeA, nameA], [codeB, nameB]) => nameA.localeCompare(nameB));

interface BookingData {
  adults: number;
  children: number;
  nights: number;
  hotelId: string;
  packageName: string;
  rooms: number;
  checkInDate: string | null;
  checkOutDate: string | null;
}

export default function Step2() {
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [packageRate, setPackageRate] = useState<number>(0);
  const [taxRate] = useState<number>(0.15); // 15% tax
  const router = useRouter();

  const packagesRates: Record<string, number> = {
    "Exclusive Deluxe Stay": 450,
    "Premium Comfort Suite": 380,
    "Classic Elegance Room": 300,
  };

  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<string>("AO"); // Angola default

  // Form state
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  // Fetch booking from Step1
  useEffect(() => {
    const stored = localStorage.getItem("bookingStep1");
    if (stored) {
      const data: BookingData = JSON.parse(stored);
      setBooking(data);
      setPackageRate(packagesRates[data.packageName] || 0);
    } else {
      router.push("/book/step1");
    }
  }, [router]);

  if (!booking) return null;

  const checkIn = booking.checkInDate
    ? new Date(booking.checkInDate).toLocaleDateString()
    : "--";
  const checkOut = booking.checkOutDate
    ? new Date(booking.checkOutDate).toLocaleDateString()
    : "--";

  const totalGuests = booking.adults + booking.children;
  const totalPriceWithoutTax = packageRate * booking.nights;
  const totalTax = totalPriceWithoutTax * taxRate;
  const totalPriceInclTax = totalPriceWithoutTax + totalTax;

  const journeySteps = ["BOOKING", "REVIEW", "CONFIRM"];
  const currentStep = 1; // Step2 active

  const formatDateForAirtable = (dateStr: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const sendBooking = async (data: any) => {
    console.log("Sending booking to API:", data);
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("API response:", result);
    return result;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email !== confirmEmail) {
      alert("Emails do not match!");
      return;
    }

    if (!booking) return;

    const bookingData = {
      Title: title,
      Name: name,
      Surname: surname,
      Email: email,
      Phone: phone || "",
      Country: country,
      Package: booking.packageName,
      Nights: booking.nights,
      Guests: totalGuests,
      "Number of Adults": booking.adults,
      "Number of Children": booking.children,
      Rooms: booking.rooms || 1,
      CheckIn: formatDateForAirtable(booking.checkInDate),
      CheckOut: formatDateForAirtable(booking.checkOutDate),
      "Total Price Excl. Tax": Number(totalPriceWithoutTax.toFixed(2)),
      "Total Price Incl. Tax": Number(totalPriceInclTax.toFixed(2)),
      TaxAmount: Number(totalTax.toFixed(2)),
      State: state,
      City: city,
      Zip: zip,
    };

    try {
      console.log("Booking data ready:", bookingData);

      const result = await sendBooking(bookingData);

      // Save full Step2 booking info
      localStorage.setItem("bookingStep2", JSON.stringify(bookingData));

      // Save Step2 summary for Step3
      localStorage.setItem(
        "bookingStep2Summary",
        JSON.stringify({
          packageName: booking.packageName,
          nights: booking.nights,
          adults: booking.adults,
          children: booking.children,
          rooms: booking.rooms || 1,
          packageRate: packageRate,
          taxRate: taxRate,
        })
      );

      // Save Airtable record ID
      if (result.success && result.recordId) {
        localStorage.setItem("airtableRecordId", result.recordId);
      }

      router.push("/book/step3");
    } catch (err) {
      console.error("Error saving booking:", err);
      alert("Failed to save booking.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-44 pb-28 font-[Doritis] uppercase tracking-[0.05em] select-none">
      {/* Journey Steps */}
      <div className="flex items-center justify-center gap-4 mb-10 tracking-[0.1em]">
        {journeySteps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`aspect-square w-28 flex items-center justify-center text-sm border transition 
              ${index <= currentStep ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-400"}`}
            >
              {step}
            </div>
            {index < journeySteps.length - 1 && (
              <div
                className={`h-[2px] w-8 ${index < currentStep ? "bg-black" : "bg-gray-400"}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <h1 className="text-2xl mb-12">BOOKING SUMMARY</h1>

      {/* Booking Summary */}
      <div className="w-[80%] bg-[#f5e9d3] p-10 border border-[#d8c9b4] flex flex-col gap-4 mb-4">
        <div className="flex justify-between border-b border-gray-400 pb-2">
          <span>CHECK-IN</span>
          <span>{checkIn}</span>
        </div>
        <div className="flex justify-between border-b border-gray-400 pb-2">
          <span>CHECK-OUT</span>
          <span>{checkOut}</span>
        </div>
        <div className="flex justify-between border-b border-gray-400 pb-2">
          <span>NUMBER OF NIGHTS</span>
          <span>{booking.nights}</span>
        </div>
        <div className="flex justify-between border-b border-gray-400 pb-2">
          <span>ADULTS</span>
          <span>{booking.adults}</span>
        </div>
        <div className="flex justify-between border-b border-gray-400 pb-2">
          <span>CHILDREN</span>
          <span>{booking.children}</span>
        </div>
        <div className="flex justify-between border-b border-gray-400 pb-2">
          <span>ROOMS</span>
          <span>{booking.rooms || 1}</span>
        </div>
        <div className="flex justify-between border-b border-gray-400 pb-2">
          <span>PACKAGE</span>
          <span>{booking.packageName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-400 pb-2">
          <span>PACKAGE RATE (USD)</span>
          <span>${packageRate}/night</span>
        </div>
        <div className="flex justify-between border-b border-gray-400 pb-2">
          <span>TAX AMOUNT ({taxRate * 100}%)</span>
          <span>USD ${totalTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-4 text-xl font-bold">
          <span>TOTAL PRICE INCL. TAX</span>
          <span>USD ${totalPriceInclTax.toFixed(2)}</span>
        </div>
      </div>

      {/* Form for personal info */}
      <form id="bookingForm" onSubmit={handleSubmit} className="w-[80%] flex gap-12 mt-12">
        <div className="flex-1 flex flex-col gap-4">
          <input
            type="text"
            placeholder="TITLE"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-400 p-2 h-10 uppercase font-[Doritis]"
          />
          <input
            type="text"
            placeholder="NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-400 p-2 h-10 uppercase font-[Doritis]"
          />
          <input
            type="text"
            placeholder="SURNAME"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="border border-gray-400 p-2 h-10 uppercase font-[Doritis]"
          />

          <div className="flex border border-gray-400 h-10 uppercase font-[Doritis] overflow-hidden rounded relative">
            <PhoneInput
              international
              country={country}
              value={phone}
              onChange={setPhone}
              className="flex-1 border-none p-2 outline-none text-black"
              placeholder="PHONE NUMBER"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="relative border border-gray-400 h-10 uppercase font-[Doritis] overflow-hidden rounded flex items-center">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="flex-1 h-full p-2 pr-8 appearance-none border-none outline-none cursor-pointer"
            >
              {countryList.map(([code, name]) => (
                <option key={code} value={code}>
                  {String.fromCodePoint(
                    ...code
                      .toUpperCase()
                      .split("")
                      .map((c) => 127397 + c.charCodeAt(0))
                  )}{" "}
                  {name}
                </option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black">
              &#9662;
            </span>
          </div>

          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 p-2 h-10 uppercase font-[Doritis]"
          />
          <input
            type="email"
            placeholder="CONFIRM EMAIL"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className="border border-gray-400 p-2 h-10 uppercase font-[Doritis]"
          />
          <input
            type="text"
            placeholder="STATE / COUNTY"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border border-gray-400 p-2 h-10 uppercase font-[Doritis]"
          />
          <input
            type="text"
            placeholder="CITY"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-400 p-2 h-10 uppercase font-[Doritis]"
          />
          <input
            type="text"
            placeholder="ZIP CODE"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="border border-gray-400 p-2 h-10 uppercase font-[Doritis]"
          />
        </div>
      </form>

      {/* Confirm Booking Button */}
      <button
        type="submit"
        form="bookingForm"
        className="mt-8 px-8 py-3 bg-black text-white uppercase font-[Doritis] hover:bg-white hover:text-black border border-black transition"
      >
        Confirm Booking
      </button>

      <div className="mt-32"></div>
      <Footer />
    </div>
  );
}
