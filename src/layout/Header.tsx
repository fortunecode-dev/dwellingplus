"use client";

import { useState } from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useScrolled } from "@/hooks/useScrolled";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { setUserLocale } from "@/services/locale";

export default function Header(props: { sections: string[]; locale: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isScrolled = useScrolled();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();
const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  const toggleLanguage = () => {
    const newLang = props.locale === "en" ? "es" : "en";
    startTransition(() => {
      setUserLocale(newLang);
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur bg-white/80 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center px-4 py-2 h-14 animate-fade-in">
        {/* Logo */}
        <div className="flex-1">
          <Link href={"/"} className="text-2xl font-bold text-[#315072]">
            dW+
          </Link>
        </div>

        {/* Desktop nav centrado */}
        <nav className="hidden lg:flex gap-6 justify-center flex-1">
          {props.sections.map((section: string) => (
            <Link
              key={section}
              href={`#${section}`}
              className="relative group font-bold text-sm uppercase text-[#315072]"
            >
              {t(`header.sections.${section}`)}
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 ${
                  isScrolled ? "bg-[#253A50]" : "bg-[#315072]"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden lg:flex flex-1 items-center justify-end gap-3">
          <button
            onClick={toggleLanguage}
            className="font-bold text-sm text-[#315072]"
          >
            {props.locale === "en" ? "EN" : "ES"}
          </button>
          <Link
            href={FACEBOOK_URL}
            target="_blank"
            className="hover:scale-105 transition-transform"
          >
            <FaFacebook size={28} color="#315072" />
          </Link>
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            className="hover:scale-105 transition-transform"
          >
            <FaInstagram size={28} color="#315072" />
          </Link>
          <Link
            href={`#contact`}
            className="px-3 py-1.5 rounded-md bg-[#315072] text-white font-bold text-sm"
          >
            {t("common.contact")}
          </Link>
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={toggleLanguage}
            className="font-bold text-sm text-[#315072]"
          >
            {props.locale === "en" ? "EN" : "ES"}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col justify-between w-6 h-5"
          >
            <span
              className={`h-0.5 bg-[#315072] rounded transition-transform ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`h-0.5 bg-[#315072] rounded transition-opacity ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 bg-[#315072] rounded transition-transform ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col items-center gap-6 py-6 border-t border-[#315072]/30 bg-white/90 backdrop-blur lg:hidden">
          {props.sections.map((section: string) => (
            <Link
              key={section}
              href={`#${section}`}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-medium uppercase text-[#315072]"
            >
              {t(`header.sections.${section}`)}
            </Link>
          ))}
          <Link
            href={`#contact`}
            onClick={() => setMenuOpen(false)}
            className="w-full max-w-xs px-4 py-2 rounded-md bg-[#315072] text-white font-bold text-lg"
          >
            {t("common.contact")}
          </Link>
          <div className="flex gap-4 mt-4">
            <Link
              href="https://facebook.com/dwellingplus.studio"
              target="_blank"
              className="hover:scale-105 transition-transform"
            >
              <FaFacebook size={36} color="#315072" />
            </Link>
            <Link
              href="https://instagram.com/dwellingplus.studio"
              target="_blank"
              className="hover:scale-105 transition-transform"
            >
              <FaInstagram size={36} color="#315072" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
