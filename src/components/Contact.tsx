"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaFacebookMessenger,
  FaCommentDots,
} from "react-icons/fa";
import { ToastState, ToastKind, InlineToast } from "./Toast";

const PHONE_CONTACT = process.env.NEXT_PUBLIC_PHONE_CONTACT || "+1 555-555-5555";
const MAIL_CONTACT = process.env.NEXT_PUBLIC_MAIL_CONTACT || "info@example.com";
const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/15555555555";
const MESSENGER_URL = process.env.NEXT_PUBLIC_MESSENGER_URL || "#";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""; // ej. https://api.tu-dominio.com

type Suggestion = {
  display: string;
  address: { city: string; state: string; postal: string };
};

export default function ContactSection() {
  const t = useTranslations();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    state: "",
    city: "",
    postal: "",
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    lastName: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address autocomplete
  const [addressSuggestions, setAddressSuggestions] = useState<Suggestion[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // Estado del toast
  const [toast, setToast] = useState<ToastState | null>(null);

  // Helper para mostrar toasts
  const showToast = useCallback((kind: ToastKind, message: string) => {
    setToast({ kind, message });
  }, []);

  // Modal móvil (tel/sms/whatsapp)
  const [showContactModal, setShowContactModal] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleAddressChange = (text: string) => {
    handleChange("address", text);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if (text.trim().length > 2) fetchAddressSuggestions(text.trim());
      else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    }, 450);
  };

  async function fetchAddressSuggestions(query: string) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=5&countrycodes=us`;
      const res = await fetch(url, {
        headers: { "User-Agent": "ContactSection/1.0 (mail@example.com)" },
      });
      const data = await res.json();
      const mapped: Suggestion[] = (data || []).map(
        (item: {
          display_name: string;
          address: {
            city: string;
            town: string;
            village: string;
            state: string;
            postcode: string;
          };
        }) => ({
          display: item.display_name,
          address: {
            city:
              item.address.city ||
              item.address.town ||
              item.address.village ||
              "",
            state: item.address.state || "",
            postal: item.address.postcode || "",
          },
        })
      );
      setAddressSuggestions(mapped);
      setShowSuggestions(true);
    } catch {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  }

  const handleAddressSelect = (s: Suggestion) => {
    setFormData((p) => ({
      ...p,
      address: s.display.split(",")[0],
      city: s.address.city,
      state: s.address.state,
      postal: s.address.postal,
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent)=> {
    e.preventDefault();
    const newErrors = {
      name: !formData.name.trim(),
      lastName: !formData.lastName.trim(),
      email: !formData.email.trim(),
    };
    setErrors(newErrors);
     if (newErrors.name || newErrors.lastName || newErrors.email) {
      // Antes: alert(t("common.requiredField"))
      showToast("error", t("common.requiredField"));
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        lastName: formData.lastName || "",
        email: formData.email,
        phone: formData.phone || "",
        address: formData.address || "",
        state: formData.state || "",
        city: formData.city || "",
        postal: formData.postal || "",
        metadata: {
          message: formData.message,
          contactDate: new Date().toISOString(),
          pagePath:
            typeof window !== "undefined"
              ? window.location.pathname
              : undefined,
        },
      };
      const res = await fetch(`/api/prospect/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      // reset
      setFormData({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        message: "",
        state: "",
        city: "",
        postal: "",
      });
      // Antes: alert(t("common.success"))
      showToast("success", t("dataSendSuccess"));
    } catch (err) {
      // Antes: alert(t("common.error"))
      showToast("error", t("dataSendFailure"));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, showToast, t]);

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen scroll-mt-16"
      id="contact"
    >
         {/* Toast global del formulario */}
      <InlineToast toast={toast} onClose={() => setToast(null)} />
      {/* Fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/main/contact copia.jpg"
          alt="Contact"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-[5px]" />
      </div>
      <div className="absolute bottom-0 h-[-0.1px] left-0 w-full inset-0 bg-gradient-to-b from-white  via-20% via-white/20 to-transparent -z-10" />

      {/* Contenedor general */}
      <div className=" flex min-h-screen items-center justify-center px-2 sm:px-4">
        <div
          className="w-full max-w-6xl mx-auto my-8 sm:my-12 rounded-2xl shadow-sm lg:drop-shadow-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.70)" }}
        >  <div className="flex justify-center items-center w-full my-4 animate-fadeIn z-50 ">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={200}
              height={50}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 p-3 sm:p-5">
            {/* IZQUIERDA: título arriba, tel/correo centrados, redes abajo */}
            <aside
              className="rounded-2xl w-full lg:w-1/2 text-white px-3 sm:px-6 py-4 sm:py-6 flex flex-col min-h-[520px]"
              style={{
                backgroundImage:
                  "linear-gradient(131deg, rgb(14, 37, 63) 0%, rgb(50, 99, 147) 100%)",
                opacity: 0.95,
              }}
            >
              {/* Arriba: título/subtítulo anclados */}
              <div>
                <h2 className="font-bold text-xl sm:text-2xl lg:text-[32px] text-center lg:text-left mb-1 sm:mb-2">
                  {t("contact.title")}
                </h2>
                <p className="font-medium text-sm sm:text-base lg:text-[20px] text-center lg:text-left text-white">
                  {t("contact.subtitle")}
                </p>
              </div>

              {/* Centro: tarjetas Tel/Email (icono izq.), compacto en móvil */}
              <div className="flex-1 flex flex-col items-stretch justify-center gap-3 sm:gap-4 mt-4">
                {/* Teléfono */}
                <a
                  href={`tel:${PHONE_CONTACT}`}
                  className="group flex items-center gap-3 sm:gap-4 bg-white/15 hover:bg-white/20 backdrop-blur-sm border border-white/25 hover:border-white/40 rounded-xl px-3 py-3 sm:px-4 sm:py-4 transition shadow-sm"
                  aria-label="Phone contact"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-white/20 group-hover:bg-white/30 transition shrink-0">
                    <FaPhoneAlt className="text-white text-lg sm:text-xl" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-white text-base sm:text-lg font-semibold truncate">
                      {PHONE_CONTACT}
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm">
                      {t("contact.callToAction")}
                    </div>
                  </div>
                </a>

                {/* Correo */}
                <a
                  href={`mailto:${MAIL_CONTACT}`}
                  className="group flex items-center gap-3 sm:gap-4 bg-white/15 hover:bg-white/20 backdrop-blur-sm border border-white/25 hover:border-white/40 rounded-xl px-3 py-3 sm:px-4 sm:py-4 transition shadow-sm"
                  aria-label="Email contact"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-white/20 group-hover:bg-white/30 transition shrink-0">
                    <FaEnvelope className="text-white text-lg sm:text-xl" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-white text-base sm:text-lg font-semibold break-words leading-tight">
                      {MAIL_CONTACT}
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm">
                      {t("contact.emailPrompt")}
                    </div>
                  </div>
                </a>
              </div>

              {/* Abajo: redes sociales centradas y ancladas */}
              <div className="mt-auto flex justify-center gap-5 sm:gap-6 pt-6">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  className="hover:scale-110 transition-transform"
                  aria-label="Facebook"
                >
                  <FaFacebook size={26} className="text-white" />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  className="hover:scale-110 transition-transform"
                  aria-label="Instagram"
                >
                  <FaInstagram size={26} className="text-white" />
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  className="hover:scale-110 transition-transform"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={26} className="text-white" />
                </a>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  className="hover:scale-110 transition-transform"
                  aria-label="Messenger"
                >
                  <FaFacebookMessenger size={26} className="text-white" />
                </a>
              </div>
            </aside>

            {/* DERECHA: formulario — compacto en móvil */}
            <section className="flex-1 w-full px-3 sm:px-5 pb-2">
              {/* Título/subtítulo del panel derecho */}
              <div className="mb-2 sm:mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {t("contact.title")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  {t("contact.subtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
                {/* Nombre / Apellido */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <InputField
                    label={t("contact.form.firstName")}
                    value={formData.name}
                    onChange={(v) => handleChange("name", v)}
                    required
                    error={errors.name}
                    compact
                  />
                  <InputField
                    label={t("contact.form.lastName")}
                    value={formData.lastName}
                    onChange={(v) => handleChange("lastName", v)}
                    required
                    error={errors.lastName}
                    compact
                  />
                </div>

                {/* Email / Teléfono */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <InputField
                    label={t("contact.form.email")}
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(v) => handleChange("email", v)}
                    required
                    error={errors.email}
                    compact
                  />
                  <InputField
                    label={t("contact.form.phone")}
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(v) => handleChange("phone", v)}
                    compact
                  />
                </div>

                {/* Dirección + sugerencias */}
                <div className="relative z-10">
                  <InputField
                    label={t("contact.form.address")}
                    value={formData.address}
                    onChange={handleAddressChange}
                    onFocus={() =>
                      formData.address.length >= 3 && setShowSuggestions(true)
                    }
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    autoComplete="street-address"
                    compact
                  />
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow z-20 overflow-hidden">
                      {addressSuggestions.map((item, i) => (
                        <button
                          key={`${item.display}-${i}`}
                          type="button"
                          onClick={() => handleAddressSelect(item)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm"
                        >
                          {item.display}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ciudad / Estado / Zip */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                  <InputField
                    label={t("contact.form.city")}
                    value={formData.city}
                    onChange={(v) => handleChange("city", v)}
                    compact
                  />
                  <InputField
                    label={t("contact.form.state")}
                    value={formData.state}
                    onChange={(v) => handleChange("state", v)}
                    compact
                  />
                  <InputField
                    label={t("contact.form.zip")}
                    value={formData.postal}
                    onChange={(v) => handleChange("postal", v)}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    compact
                  />
                </div>

                {/* Mensaje */}
                <TextAreaField
                  label={t("contact.form.message")}
                  value={formData.message}
                  onChange={(v) => handleChange("message", v)}
                  compact
                />

                {/* Submit */}
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-gray-800 text-white px-4 sm:px-5 py-2 disabled:opacity-60 text-sm sm:text-base"
                  >
                    {isSubmitting
                      ? t("contact.form.submitting")
                      : t("contact.form.submit")}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>

      {/* Modal móvil: Tel/SMS/WhatsApp */}
      <div
        className={[
          showContactModal ? "fixed" : "hidden",
          "inset-0 z-50 lg:hidden flex items-center justify-center bg-black/50 px-4",
        ].join(" ")}
        aria-hidden={!showContactModal}
      >
        <div className="relative w-full max-w-md rounded-2xl bg-white p-5">
          <button
            onClick={() => setShowContactModal(false)}
            className="absolute top-3 right-3 text-gray-700"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <h3 className="mb-3 font-bold text-lg text-center text-slate-800">
            {t("contact.title")}
          </h3>
          <div className="space-y-3">
            <a href={`tel:${PHONE_CONTACT}`} className="flex items-center gap-3 py-2">
              <FaPhoneAlt className="text-gray-700 text-lg" />
              <span className="text-slate-800">{t("contact.methods.phone")}</span>
            </a>
            <a href={`sms:${PHONE_CONTACT}`} className="flex items-center gap-3 py-2">
              <FaCommentDots className="text-gray-700 text-lg" />
              <span className="text-slate-800">{t("contact.methods.message")}</span>
            </a>
            <a href={WHATSAPP_URL} target="_blank" className="flex items-center gap-3 py-2">
              <FaWhatsapp className="text-green-600 text-lg" />
              <span className="text-slate-800">{t("contact.methods.whatsapp")}</span>
            </a>
          </div>
          <div className="mt-5 text-center">
            <button
              onClick={() => setShowContactModal(false)}
              className="px-4 py-2 rounded-lg border"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */
function InputField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "numeric" | "tel" | "search" | "url";
  required?: boolean;
  error?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  compact?: boolean;
}) {
  const {
    label,
    value,
    onChange,
    type = "text",
    autoComplete,
    inputMode,
    required,
    error,
    onFocus,
    onBlur,
    compact,
  } = props;

  return (
    <label className="block">
      <span className="block text-xs sm:text-sm font-medium text-gray-700">
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onFocus={onFocus}
        onBlur={onBlur}
        className={[
          "mt-1 w-full rounded-md border outline-none",
          error ? "border-red-300" : "border-white/80",
          "placeholder:text-gray-600",
          compact ? "px-3 py-2 text-sm" : "px-3 py-2.5 sm:py-3 text-sm sm:text-base",
          "focus:ring-2 focus:ring-gray-300",
        ].join(" ")}
      />
    </label>
  );
}

function TextAreaField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  const { label, value, onChange, compact } = props;
  return (
    <label className="block">
      <span className="block text-xs sm:text-sm font-medium text-gray-700">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "mt-1 w-full rounded-md border outline-none min-h-[96px] sm:min-h-[120px]",
          "border-white/80",
          "placeholder:text-gray-600",
          compact ? "px-3 py-2 text-sm" : "px-3 py-2.5 sm:py-3 text-sm sm:text-base",
          "focus:ring-2 focus:ring-gray-300",
        ].join(" ")}
      />
    </label>
  );
}
