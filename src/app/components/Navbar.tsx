"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Phone, Mail, Menu, X } from "lucide-react";

interface NavbarProps {
  alwaysShow?: boolean;
}

export default function Navbar({ alwaysShow = false }: NavbarProps) {
  const [hoverNav, setHoverNav] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activeNavIsSecondary, setActiveNavIsSecondary] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pathname = usePathname() || "/";
  const router = useRouter();

  const isSpecialPage =
    pathname === "/about" || pathname.startsWith("/accommodations/");

  useEffect(() => {
    setMounted(true);
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setShowSecondary(window.scrollY > lastScrollY && window.scrollY > 100);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: {
    label: string;
    dropdown?: {
      label: string;
      href: string;
      image?: string;
      description?: string;
      category?: string;
    }[];
    href?: string;
  }[] = [
    {
      label: "Dining",
      dropdown: [
        {
          category: "Asian Cuisine",
          label: "Shogun Restaurant",
          href: "/dining/Shogun",
          image: "/Restaurants/From-Shogun.jpg",
          description: "Fine Japanese dining with sushi and teppanyaki in an elegant setting.",
        },
      ],
    },
    {
      label: "Accommodations",
      dropdown: [
        {
          label: "Doritis Guesthouse",
          href: "/partnered-hotels",
          image: "/Doritis/Doritis.jpg",
          description: "Exclusive stay with premium comfort and style.",
        },
      ],
    },
    {
      label: "Packages",
      dropdown: [
        { label: "Family", href: "/packages/family" },
        { label: "Couples", href: "/packages/couples" },
        { label: "Solo", href: "/packages/solo" },
        { label: "Business", href: "/packages/business" },
      ],
    },
    {
      label: "Brochure",
      href: "https://issuu.com/acrosstours/docs/acrosstours_travel_africa_brochure_1_",
    },
  ];

  const handleClick = (item: { href?: string }, option?: { href: string }) => {
    setMobileOpen(false);
    setActiveItem(null);
    if (item.href) {
      item.href.startsWith("http")
        ? window.open(item.href, "_blank")
        : router.push(item.href);
      return;
    }
    if (option?.href) router.push(option.href);
  };

  const handleMouseEnterItem = (label: string, isSecondary: boolean) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveItem(label);
    setActiveNavIsSecondary(isSecondary);
  };

  const handleMouseLeaveNav = () => {
    leaveTimer.current = setTimeout(() => {
      setHoverNav(false);
      setActiveItem(null);
    }, 120);
  };

  const renderNavbar = (isSecondary = false) => {
    const revealed = hoverNav || isSecondary || alwaysShow || isSpecialPage;

    return (
      <nav
        className={`relative w-full transition-all duration-500 ease-in-out ${
          revealed
            ? "bg-[#f8f4ef] shadow-[0_2px_30px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
        onMouseEnter={() => {
          if (!isSecondary) {
            if (leaveTimer.current) clearTimeout(leaveTimer.current);
            setHoverNav(true);
          }
        }}
        onMouseLeave={handleMouseLeaveNav}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 sm:h-20 px-6 sm:px-10 relative">

          {/* Brand */}
          <button
            onClick={() => router.push("/")}
            className="flex flex-col items-start leading-none focus:outline-none"
          >
            <span
              className={`text-2xl sm:text-3xl transition-colors duration-500 ${
                revealed ? "text-[#1a1a1a]" : "text-white"
              }`}
              style={{
                fontFamily: `"Cormorant Garamond", "Bodoni 72", serif`,
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: "0.04em",
              }}
            >
              Moyo Estates
            </span>
            <span
              className={`text-[8px] tracking-[0.4em] uppercase mt-0.5 transition-colors duration-500 ${
                revealed ? "text-[#c9a96e]" : "text-[#c9a96e]/80"
              }`}
              style={{ fontFamily: `"Cormorant Garamond", serif` }}
            >
              The Angola Experience
            </span>
          </button>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/244956766885"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors duration-300 hover:text-[#c9a96e] ${
                revealed ? "text-[#1a1a1a]" : "text-white"
              }`}
            >
              <Phone size={16} strokeWidth={1.5} />
            </a>
            <a
              href="mailto:moyoestates@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors duration-300 hover:text-[#c9a96e] ${
                revealed ? "text-[#1a1a1a]" : "text-white"
              }`}
            >
              <Mail size={16} strokeWidth={1.5} />
            </a>
            <button
              className="sm:hidden focus:outline-none"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={1.5} className={revealed ? "text-[#1a1a1a]" : "text-white"} />
              ) : (
                <Menu size={20} strokeWidth={1.5} className={revealed ? "text-[#1a1a1a]" : "text-white"} />
              )}
            </button>
          </div>
        </div>

        {/* Thin gold rule */}
        <div
          className={`w-full h-px transition-opacity duration-500 ${
            revealed ? "opacity-100" : "opacity-30"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent, #c9a96e 20%, #c9a96e 80%, transparent)",
          }}
        />

        {/* Desktop nav links */}
        {mounted && !isSpecialPage && (
          <ul className="hidden sm:flex justify-center gap-8 lg:gap-12 py-3 w-full">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnterItem(item.label, isSecondary)}
              >
                <button
                  className={`group relative text-[10px] tracking-[0.35em] uppercase pb-1 transition-colors duration-300 focus:outline-none ${
                    activeItem === item.label && activeNavIsSecondary === isSecondary
                      ? "text-[#c9a96e]"
                      : revealed
                      ? "text-[#1a1a1a] hover:text-[#c9a96e]"
                      : "text-white/90 hover:text-[#c9a96e]"
                  }`}
                  style={{ fontFamily: `"Cormorant Garamond", serif` }}
                  onClick={() => handleClick(item)}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-[#c9a96e] transition-all duration-300 ${
                      activeItem === item.label && activeNavIsSecondary === isSecondary
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Mobile menu */}
        {mounted && mobileOpen && (
          <div className="sm:hidden bg-[#f8f4ef] border-t border-[#e0d9ce]">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-[#e0d9ce]">
                <div
                  className="px-6 py-4 text-[11px] tracking-[0.35em] uppercase text-[#1a1a1a] cursor-pointer hover:text-[#c9a96e] transition-colors"
                  style={{ fontFamily: `"Cormorant Garamond", serif` }}
                  onClick={() => handleClick(item)}
                >
                  {item.label}
                </div>
                {item.dropdown && (
                  <div className="pl-8 pb-3 flex flex-col gap-1">
                    {item.dropdown.map((opt) => (
                      <div
                        key={opt.label}
                        className="py-2 text-xs text-[#6b6b6b] cursor-pointer hover:text-[#c9a96e] transition-colors italic"
                        style={{
                          fontFamily: `"Cormorant Garamond", serif`,
                          letterSpacing: "0.1em",
                        }}
                        onClick={() => handleClick(item, opt)}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Dropdown panel */}
        {mounted &&
          activeItem &&
          activeNavIsSecondary === isSecondary &&
          (() => {
            const current = navItems.find((i) => i.label === activeItem);
            if (!current?.dropdown) return null;

            const isRich =
              current.label === "Dining" || current.label === "Accommodations";

            return (
              <div
                className="absolute top-full left-0 w-full bg-[#f8f4ef] z-40 shadow-[0_8px_40px_rgba(0,0,0,0.1)]"
                style={{ borderTop: "1px solid #e0d9ce" }}
                onMouseEnter={() => {
                  if (leaveTimer.current) clearTimeout(leaveTimer.current);
                }}
                onMouseLeave={handleMouseLeaveNav}
              >
                <div className="max-w-5xl mx-auto px-10 py-8">
                  {isRich ? (
                    <div className="flex flex-col gap-6">
                      {current.dropdown[0]?.category && (
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-px bg-[#c9a96e]" />
                          <span
                            className="text-[9px] tracking-[0.45em] text-[#c9a96e] uppercase"
                            style={{ fontFamily: `"Cormorant Garamond", serif` }}
                          >
                            {current.dropdown[0].category}
                          </span>
                        </div>
                      )}

                      {current.dropdown.map((d) => (
                        <div
                          key={d.label}
                          className="group flex items-center gap-6 cursor-pointer"
                          onClick={() => handleClick(current, d)}
                        >
                          {d.image && (
                            <div className="w-40 h-24 overflow-hidden shrink-0">
                              <img
                                src={d.image}
                                alt={d.label}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="flex flex-col gap-1">
                            <span
                              className="text-lg text-[#1a1a1a] group-hover:text-[#c9a96e] transition-colors duration-300"
                              style={{
                                fontFamily: `"Cormorant Garamond", serif`,
                                fontStyle: "italic",
                                fontWeight: 300,
                              }}
                            >
                              {d.label}
                              <span className="ml-2 text-[#c9a96e] text-sm">→</span>
                            </span>
                            {d.description && (
                              <p
                                className="text-xs text-[#9a8f82] leading-relaxed max-w-xs"
                                style={{
                                  fontFamily: `"Cormorant Garamond", serif`,
                                  letterSpacing: "0.02em",
                                }}
                              >
                                {d.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-px bg-[#c9a96e]" />
                        <span
                          className="text-[9px] tracking-[0.45em] text-[#c9a96e] uppercase"
                          style={{ fontFamily: `"Cormorant Garamond", serif` }}
                        >
                          {current.label}
                        </span>
                      </div>
                      {current.dropdown.map((option) => (
                        <button
                          key={option.label}
                          className="group text-left w-fit text-[#1a1a1a] hover:text-[#c9a96e] transition-colors duration-300 relative focus:outline-none"
                          style={{
                            fontFamily: `"Cormorant Garamond", serif`,
                            fontStyle: "italic",
                            fontWeight: 300,
                            fontSize: "1.1rem",
                            letterSpacing: "0.02em",
                          }}
                          onClick={() => handleClick(current, option)}
                        >
                          {option.label}
                          <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c9a96e] group-hover:w-full transition-all duration-300" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
      </nav>
    );
  };

  return (
    <header
      className="absolute top-0 left-0 w-full z-50"
      onMouseLeave={handleMouseLeaveNav}
    >
      {renderNavbar(false)}

      {!isSpecialPage && (
        <div
          className={`fixed top-0 left-0 w-full z-40 transition-transform duration-500 ease-in-out ${
            showSecondary ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {renderNavbar(true)}
        </div>
      )}
    </header>
  );
}