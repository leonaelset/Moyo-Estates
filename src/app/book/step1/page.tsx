"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, Users, BedDouble, Plus, Minus } from "lucide-react";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";

interface Room {
  adults: number;
  children: number;
}

export default function Step1() {
  const [editing, setEditing] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(new Date());
  const [checkOut, setCheckOut] = useState<Date | null>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [rooms, setRooms] = useState<Room[]>([{ adults: 2, children: 0 }]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [monthYearSelectorOpen, setMonthYearSelectorOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const calendarRef = useRef<HTMLDivElement>(null);
  const checkBarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const years = [2025, 2026, 2027];
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const packages = [
    { name: "Exclusive Deluxe Stay", image: "/Luanda/The-Halls.jpg", description: "Breakfast included", price: "$450/night" },
    { name: "Premium Comfort Suite", image: "/Luanda/The-Halls.jpg", description: "Breakfast included", price: "$380/night" },
    { name: "Classic Elegance Room", image: "/Luanda/The-Halls.jpg", description: "Breakfast included", price: "$300/night" },
  ];

  const journeySteps = ["BOOKING", "REVIEW", "CONFIRM"];
  const currentStep = 0;

  const toggleEdit = () => setEditing((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        checkBarRef.current &&
        !checkBarRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
        setMonthYearSelectorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addRoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRooms((prev) => (prev.length >= 3 ? prev : [...prev, { adults: 1, children: 0 }]));
  };

  const updateRoom = (index: number, field: "adults" | "children", action: "increase" | "decrease", e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRooms((prev) => {
      const updated = prev.map((r) => ({ ...r }));
      const current = updated[index][field];
      updated[index][field] = action === "increase" ? current + 1 : Math.max(0, current - 1);
      return updated;
    });
  };

  const removeLastRoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRooms((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)));
  };

  const getMonthDates = (year: number, month: number) => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const dates: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) dates.push(new Date(d));
    return dates;
  };

  const monthDates = getMonthDates(currentYear, currentMonth);

  const handleDateClick = (date: Date, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!checkIn || (checkIn && checkOut)) { setCheckIn(date); setCheckOut(null); }
    else if (checkIn && !checkOut) {
      if (date < checkIn) { setCheckOut(checkIn); setCheckIn(date); } 
      else { setCheckOut(date); }
      setCalendarOpen(false);
    }
  };

  const isSelected = (date: Date) => {
    if (!checkIn) return false;
    if (!checkOut) return date.getTime() === checkIn.getTime();
    return date.getTime() === checkIn.getTime() || date.getTime() === checkOut.getTime();
  };

  const isInRange = (date: Date) =>
    checkIn && checkOut
      ? date >= checkIn && date <= checkOut
      : checkIn && hoverDate
      ? date.getTime() >= Math.min(checkIn.getTime(), hoverDate.getTime()) &&
        date.getTime() <= Math.max(checkIn.getTime(), hoverDate.getTime())
      : false;

  const calculateNights = (checkIn: Date | null, checkOut: Date | null) => {
    if (!checkIn || !checkOut) return 1;
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleSelectPackage = (pkgName: string) => {
    localStorage.setItem(
      "bookingStep1",
      JSON.stringify({
        adults: rooms.reduce((a, r) => a + r.adults, 0),
        children: rooms.reduce((a, r) => a + r.children, 0),
        nights: calculateNights(checkIn, checkOut),
        hotelId: "luanda",
        packageName: pkgName,
        checkInDate: checkIn ? checkIn.toISOString() : null,
        checkOutDate: checkOut ? checkOut.toISOString() : null,
      })
    );
    router.push("/book/step2");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-44 pb-28 font-[Didot] uppercase select-none">

      {/* Customer Journey */}
      <div className="flex items-center justify-center gap-4 mb-10 tracking-[0.1em]">
        {journeySteps.map((step, index) => (
          <React.Fragment key={step}>
            <div className={`aspect-square w-28 flex items-center justify-center text-sm border transition ${index <= currentStep ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-400"}`}>
              {step}
            </div>
            {index < journeySteps.length - 1 && <div className={`h-[2px] w-8 ${index < currentStep ? "bg-black" : "bg-gray-400"}`}></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Edit Details Bar */}
      <div className="bg-[#f5e9d3] px-14 py-8 w-[80%] flex items-center justify-between shadow-md border border-[#d8c9b4] cursor-pointer tracking-[0.05em]" onClick={toggleEdit}>
        <div className="flex items-center gap-8 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Calendar size={18} /> {checkIn ? checkIn.toLocaleDateString() : "--"} - {checkOut ? checkOut.toLocaleDateString() : "--"}
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} /> ADULTS {rooms.reduce((a, r) => a + r.adults, 0)} & KIDS {rooms.reduce((a, r) => a + r.children, 0)}
          </div>
          <div className="flex items-center gap-2">
            <BedDouble size={18} /> {rooms.length} ROOM{rooms.length > 1 ? "S" : ""}
          </div>
        </div>
        <button className="text-sm text-gray-800" onClick={(e) => { e.stopPropagation(); toggleEdit(); }}>
          EDIT DETAILS {editing ? "–" : "+"}
        </button>
      </div>

      {/* Expanded Details */}
      <div className={`mt-2 w-[80%] bg-[#f5e9d3] border border-[#d8c9b4] transition-all duration-700 ease-in-out overflow-hidden ${editing ? "max-h-[4000px] opacity-100 p-10 translate-y-0" : "max-h-0 opacity-0 p-0 -translate-y-10"}`}>
        <div ref={checkBarRef} className="flex justify-center items-center bg-white p-4 cursor-pointer mb-6" onClick={(e) => { e.stopPropagation(); setCalendarOpen(!calendarOpen); }}>
          <span className="text-gray-700 tracking-[0.05em]">CHECK-IN / CHECK-OUT: {checkIn ? checkIn.toLocaleDateString() : "--"} - {checkOut ? checkOut.toLocaleDateString() : "--"}</span>
        </div>

        {/* Calendar */}
        <div ref={calendarRef} className={`bg-white p-2 grid grid-cols-7 gap-1 w-full max-w-[550px] mx-auto shadow-md transition-all duration-500 ease-in-out overflow-hidden ${calendarOpen ? "max-h-[1000px] opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"}`}>
          <div className="col-span-7 flex justify-between items-center mb-2">
            <button onClick={(e) => { e.stopPropagation(); setCurrentMonth((m) => (m === 0 ? 11 : m - 1)); }}>◀</button>
            <span className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setMonthYearSelectorOpen((prev) => !prev); }}>{months[currentMonth]} {currentYear}</span>
            <button onClick={(e) => { e.stopPropagation(); setCurrentMonth((m) => (m === 11 ? 0 : m + 1)); }}>▶</button>
          </div>

          {monthYearSelectorOpen && (
            <div className="col-span-7 grid grid-cols-4 gap-1 mb-2">
              {months.map((m, idx) => (
                <button key={m} className="border border-gray-300 w-full h-8" onClick={(e) => { e.stopPropagation(); setCurrentMonth(idx); setMonthYearSelectorOpen(false); }}>{m}</button>
              ))}
              {years.map((y) => (
                <button key={y} className="border border-gray-300 w-full h-8" onClick={(e) => { e.stopPropagation(); setCurrentYear(y); setMonthYearSelectorOpen(false); }}>{y}</button>
              ))}
            </div>
          )}

          {dayHeaders.map((day) => <div key={day} className="text-center text-sm">{day}</div>)}

          {monthDates.map((date) => (
            <button key={date.toString()} onClick={(e) => handleDateClick(date, e)} onMouseEnter={() => setHoverDate(date)} onMouseLeave={() => setHoverDate(null)} className={`flex flex-col justify-between items-center w-12 h-12 border border-gray-300 text-xs cursor-pointer transition-colors duration-200 ${isSelected(date) || isInRange(date) ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"}`}>
              <span className="mt-1">{date.getDate()}</span>
              <span className="text-gray-400 text-[10px] mb-1">$0</span>
            </button>
          ))}
        </div>

        {/* Rooms */}
        <div className="flex flex-col gap-6 mt-6">
          {rooms.map((room, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-6 border border-gray-300">
              <div>
                <span>ROOM {index + 1}</span>
                <div className="flex gap-8 mt-4">
                  <div className="flex items-center gap-2">
                    ADULTS:
                    <button onClick={(e) => updateRoom(index, "adults", "decrease", e)} className="border w-12 h-12 flex justify-center items-center hover:bg-black hover:text-white transition duration-300"><Minus size={16} /></button>
                    <span className="w-8 text-center">{room.adults}</span>
                    <button onClick={(e) => updateRoom(index, "adults", "increase", e)} className="border w-12 h-12 flex justify-center items-center hover:bg-black hover:text-white transition duration-300"><Plus size={16} /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    KIDS:
                    <button onClick={(e) => updateRoom(index, "children", "decrease", e)} className="border w-12 h-12 flex justify-center items-center hover:bg-black hover:text-white transition duration-300"><Minus size={16} /></button>
                    <span className="w-8 text-center">{room.children}</span>
                    <button onClick={(e) => updateRoom(index, "children", "increase", e)} className="border w-12 h-12 flex justify-center items-center hover:bg-black hover:text-white transition duration-300"><Plus size={16} /></button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {index === rooms.length - 1 && rooms.length < 3 && <button onClick={(e) => addRoom(e)} className="text-gray-700 hover:text-black transition duration-300 text-sm flex items-center gap-1">ADD ROOM <Plus size={14} /></button>}
                {index === rooms.length - 1 && rooms.length > 1 && <button onClick={(e) => removeLastRoom(e)} className="text-red-600 hover:text-red-800 transition duration-300 text-sm">REMOVE ROOM</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PACKAGES */}
      <div className="flex w-[80%] gap-12 mt-8">
        <div className="flex-1">
          <img src="/Doritis/Doritis-Hall.jpg" alt="Hotel" className="w-full h-[500px] object-cover" />
        </div>

        <div className="flex-1 flex flex-col gap-6 font-[Didot] uppercase tracking-[0.1em]">
          <h2 className="text-xl mb-6">CHOOSE A PACKAGE</h2>
          {packages.map((pkg, index) => (
            <div key={index} className="flex justify-between items-center border border-black bg-white p-6 cursor-pointer transition hover:shadow-md">
              <div className="flex flex-col gap-1 text-left">
                <span>{pkg.name}</span>
                <span>{pkg.description}</span>
                <span className="font-bold">PRICE BEFORE TAX</span>
                <span>{pkg.price}</span>
              </div>
              <button
                className="ml-6 px-6 py-2 text-base font-[Didot] border border-black bg-black text-white transition duration-300 hover:bg-white hover:text-black uppercase"
                onClick={() => handleSelectPackage(pkg.name)}
              >
                BOOK
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-32"></div>
      <Footer />
    </div>
  );
}
