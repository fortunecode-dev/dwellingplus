"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

type FooterProps = {
  scrollToSection?: (section: string, force?: boolean) => void;
};

// Usa variables en tiempo de build para web
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const BASE_URL  = process.env.NEXT_PUBLIC_BASE_URL || ""; // ej: https://tu-dominio.com
const FACEBOOK_URL  = process.env.NEXT_PUBLIC_FACEBOOK_URL  || "https://facebook.com";
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";

/**
 * Footer web (Next.js) — UI only
 * - Gradiente, grid responsive, modal informativo
 * - i18n con next-intl
 * - Login con Google (redirección simple)
 */
export default function Footer({ scrollToSection }: FooterProps) {
  const t = useTranslations();
  const [modalVisible, setModalVisible] = useState<null | "dwelling" | "fortuneCode">(null);

  // Construye la URL de OAuth2 de Google (OpenID)
  const loginUrl = useMemo(() => {
    const redirectUri = `${BASE_URL}/admin`;
    const scope = encodeURIComponent("openid email profile");
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope,
      prompt: "select_account",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }, []);

  const about: Record<string, { title: string; info: string }> = {
    dwelling: { title: "Dwelling",     info: "Info" },
    fortuneCode: { title: "FortuneCode", info: "Info desarrollo" },
  };

  return (
    <footer
      className="border-t"
      style={{
        backgroundImage:
          "linear-gradient(150deg, rgb(49, 80, 114) 0%, rgb(108, 155, 201) 100%)",
        borderColor: "rgba(255,255,255,0.25)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row">
          {/* Columna izquierda */}
          <div className="flex flex-col items-center md:items-start">
            {/* Si quieres mostrar un logo, descomenta el bloque abajo */}
            {/* <div className="mb-2">
              <Image
                src="/logo-navy.png"
                alt="Logo"
                width={180}
                height={48}
                className="rounded-lg"
                priority
              />
            </div> */}

            <p className="mt-2 text-[14px] text-white/90">
              DwellingPlus © {new Date().getFullYear()} All rights reserved.
            </p>
            <p className="mt-1 text-[12px] text-white/80">
              Map data © OpenStreetMap contributors
            </p>
          </div>

          {/* Centro (2 columnas) */}
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <p className="text-[14px] font-bold text-white/95">
                {t("footer.content.title")}
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => scrollToSection?.("services", true)}
                  className="block text-left text-[14px] text-white/90 hover:text-white"
                >
                  {t("footer.content.services")}
                </button>
                <button
                  onClick={() => scrollToSection?.("faq", true)}
                  className="block text-left text-[14px] text-white/90 hover:text-white"
                >
                  {t("footer.content.faqs")}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[14px] font-bold text-white/95">
                {t("footer.company.title")}
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setModalVisible("dwelling")}
                  className="block text-left text-[14px] text-white/90 hover:text-white"
                >
                  {t("footer.company.about")}
                </button>
                <button
                  onClick={() => setModalVisible("fortuneCode")}
                  className="block text-left text-[14px] text-white/90 hover:text-white"
                >
                  {t("footer.company.development")}
                </button>
              </div>
            </div>
          </div>

          {/* Derecha: Redes + Login */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
                aria-label="Facebook"
                title="Facebook"
              >
                <FaFacebookF size={28} color="#fff" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
                aria-label="Instagram"
                title="Instagram"
              >
                <FaInstagram size={28} color="#fff" />
              </a>
            </div>

          
          </div>
        </div>
      </div>

      {/* MODAL */}
      <div
        className={[
          modalVisible ? "fixed" : "hidden",
          "inset-0 z-50 flex items-center justify-center bg-black/50 px-4",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-hidden={!modalVisible}
      >
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
          <button
            onClick={() => setModalVisible(null)}
            aria-label={t("common.close")}
            className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>

          <h3 className="mb-2 text-center text-xl font-semibold text-[#315072]">
            {about[modalVisible || "dwelling"]?.title}
          </h3>
          <p className="mb-6 text-center text-base text-[#315072]">
            {about[modalVisible || "dwelling"]?.info}
          </p>

          <div className="flex justify-end">
            <button
              onClick={() => setModalVisible(null)}
              className="rounded-lg bg-[#6C9BC9] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
