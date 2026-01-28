"use client";

import { useState, useEffect } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false); // mobile menu state

  const pathname = usePathname() || "/";
  const router = useRouter();

  const isSpecialPage =
    pathname === "/about" ||
    pathname.startsWith("/accommodations/");

  const [showSecondary, setShowSecondary] = useState(false);

  useEffect(() => {
    setMounted(true);
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowSecondary(true);
      } else {
        setShowSecondary(false);
      }
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
          category: "ASIAN FOOD",
          label: "Shogun Restaurant",
          href: "/dining/Shogun",
          image: "/Restaurants/From-Shogun.jpg",
          description:
            "Fine Japanese dining with sushi and teppanyaki in an elegant setting.",
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
    if (mobileOpen) setMobileOpen(false); // close mobile menu on click

    if (item.href) {
      if (item.href.startsWith("http")) {
        window.open(item.href, "_blank");
      } else {
        router.push(item.href);
      }
      return;
    }
    if (option?.href) {
      router.push(option.href);
    }
  };

  const handleBrandClick = () => router.push("/");

  const renderNavbar = (isSecondary = false) => {
    const visualNavActive = hoverNav || isSecondary || alwaysShow || isSpecialPage;

    return (
      <nav
        className={`relative w-full flex flex-col transition-colors duration-300 ease-in-out ${
          visualNavActive ? "bg-white shadow-lg" : "bg-black/20"
        }`}
        style={{ backdropFilter: visualNavActive ? "blur(5px)" : "none" }}
        onMouseEnter={() => !isSecondary && setHoverNav(true)}
        onMouseLeave={() => !isSecondary && setHoverNav(false)}
      >
        <div
          className={`flex items-center justify-between w-full ${
            isSpecialPage ? "h-14 px-6" : "h-16 px-4"
          } relative`}
        >
          <h1
            className="text-3xl font-bold cursor-pointer"
            style={{
              fontFamily: `"Miller Display", Didone, serif`,
              color: visualNavActive ? "black" : "white",
            }}
            onClick={handleBrandClick}
          >
            Moyo Estates
          </h1>

          {/* The Angola Experience - desktop only */}
          <div className="hidden md:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 pointer-events-none">
            <span
              className="text-lg font-semibold"
              style={{
                fontFamily: `"Playfair Display", serif`,
                color: visualNavActive ? "black" : "white",
              }}
            >
              The Angola Experience
            </span>
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center space-x-3">
            <a
              href="https://wa.me/244956766885"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors duration-300 ${
                visualNavActive ? "text-black" : "text-white"
              }`}
            >
              <Phone size={20} />
            </a>
            <a
              href="mailto:moyoestates@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors duration-300 ${
                visualNavActive ? "text-black" : "text-white"
              }`}
            >
              <Mail size={20} />
            </a>

            {/* Hamburger only on small screens */}
            <button
              className="sm:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X size={22} className={visualNavActive ? "text-black" : "text-white"} />
              ) : (
                <Menu size={22} className={visualNavActive ? "text-black" : "text-white"} />
              )}
            </button>
          </div>
        </div>

        {/* Desktop nav (unchanged) */}
        {mounted && !isSpecialPage && (
          <ul className="hidden sm:flex justify-center space-x-4 py-2 w-full pointer-events-auto">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  setActiveItem(item.label);
                  setActiveNavIsSecondary(isSecondary);
                }}
              >
                <span
                  className={`cursor-pointer text-sm transition-colors duration-300 whitespace-nowrap ${
                    visualNavActive ? "text-black" : "text-white"
                  }`}
                  style={{ fontFamily: "Times New Roman, serif" }}
                  onClick={() => handleClick(item)}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Mobile Menu */}
        {mounted && mobileOpen && (
          <div className="sm:hidden bg-white border-t">
            {navItems.map((item) => (
              <div key={item.label} className="border-b">
                <div
                  className="px-6 py-4 font-serif text-black cursor-pointer"
                  onClick={() => handleClick(item)}
                >
                  {item.label}
                </div>
                {item.dropdown && (
                  <div className="pl-6 pb-3">
                    {item.dropdown.map((opt) => (
                      <div
                        key={opt.label}
                        className="py-2 text-sm text-gray-700 cursor-pointer"
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

        {/* Dropdowns for desktop still unchanged */}
        {mounted &&
          activeItem &&
          activeNavIsSecondary === isSecondary &&
          (() => {
            const currentItem = navItems.find((i) => i.label === activeItem);
            if (!currentItem || !currentItem.dropdown) return null;

            return (
              <div
                className="absolute top-full left-0 bg-white z-40 shadow-lg p-4 overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  width: "calc(100% - 10%)",
                  marginLeft: "5%",
                  maxHeight: "500px",
                  borderTop: "1px solid black",
                }}
              >
                {currentItem.label === "Dining" ||
                currentItem.label === "Accommodations" ? (
                  <>
                    {currentItem.label === "Dining" && (
                      <div
                        className="mb-2 text-gray-700 uppercase tracking-widest"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {currentItem.dropdown[0].category}
                      </div>
                    )}

                    {currentItem.dropdown.map((d) => (
                      <div
                        key={d.label}
                        className="flex items-center space-x-4 p-2 cursor-pointer group transition-all duration-300 ease-in-out"
                        onClick={() => handleClick(currentItem, d)}
                      >
                        {d.image && (
                          <img
                            src={d.image}
                            alt={d.label}
                            className="w-36 h-24 object-cover shadow"
                          />
                        )}
                        <div className="flex-1 flex flex-col justify-center ml-4 relative">
                          <span
                            className="text-gray-800 font-serif relative"
                            style={{
                              fontFamily:
                                currentItem.label === "Accommodations"
                                  ? `"Didot", Didone, serif`
                                  : "Georgia, serif",
                            }}
                          >
                            {d.label} <span className="ml-2">→</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gray-800 group-hover:w-full transition-all duration-300"></span>
                          </span>
                          {d.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {d.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col p-2">
                    {currentItem.dropdown.map((option) => (
                      <span
                        key={option.label}
                        className="block text-black py-2 cursor-pointer relative group transition-all duration-300 ease-in-out"
                        onClick={() => handleClick(currentItem, option)}
                      >
                        {option.label}
                        <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-200" />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
      </nav>
    );
  };

  return (
    <header
      className="absolute top-0 left-0 w-full z-50"
      onMouseLeave={() => {
        setHoverNav(false);
        setActiveItem(null);
      }}
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
