"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const PHONE_CONTACT = process.env.NEXT_PUBLIC_PHONE_CONTACT || "+1 555-555-5555";
const MAIL_CONTACT = process.env.NEXT_PUBLIC_MAIL_CONTACT || "info@example.com";
const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/15555555555";
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
  const [errors, setErrors] = useState({ name: false, email: false, lastName: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address autocomplete
  const [addressSuggestions, setAddressSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // Mobile contact modal
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
      const mapped: Suggestion[] = (data || []).map((item: { display_name: string; address: { city: string; town: string; village: string; state: string; postcode: string; }; }) => ({
        display: item.display_name,
        address: {
          city: item.address.city || item.address.town || item.address.village || "",
          state: item.address.state || "",
          postal: item.address.postcode || "",
        },
      }));
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = {
      name: !formData.name.trim(),
      lastName: !formData.lastName.trim(),
      email: !formData.email.trim(),
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.lastName || newErrors.email) {
      alert(t("requiredField"));
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
          pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
        },
      };
      const res = await fetch(`${API_BASE}/api/prospects/contact`, {
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
      alert(t("common.success"));
    } catch {
      alert(t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen">
      {/* Fondo fullscreen con blur (como tu RN: ImageBackground + BlurView) */}
      <div className="absolute inset-0 -z-10">
        <Image src="/main/contact.jpg" alt="Contact" fill priority className="object-cover" />
        <div className="absolute inset-0 backdrop-blur-md" />
      </div>

      {/* Contenedor centrado y translúcido */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-2 sm:px-4">
        <div
          className="w-full max-w-6xl mx-auto my-10 lg:my-16 rounded-2xl shadow-sm lg:drop-shadow-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.70)" }}
        >
          <div className="flex flex-col lg:flex-row gap-5 p-3 lg:p-5">
            {/* IZQUIERDA: bloque de contacto con gradiente, misma jerarquía y estilos que tu RN */}
            <aside
              className="rounded-2xl w-full lg:w-1/2 text-white px-4 py-6 lg:px-10 lg:py-7"
              style={{
                backgroundImage:
                  "linear-gradient(131deg, rgb(14, 37, 63) 0%, rgb(50, 99, 147) 100%)",
                opacity: 0.95,
              }}
            >
              <h2 className="font-bold text-2xl lg:text-[32px] text-center lg:text-left mb-2">
                {t("contact.title")}
              </h2>
              <p className="font-semibold text-base lg:text-[20px] text-center lg:text-left text-white mb-3">
                {t("contact.subtitle")}
              </p>

              {/* SOLO móvil: mensaje + enlaces + botón modal, reflejando tu layout */}
              <div className="lg:hidden mt-2 mb-4 text-center">
                <p className="text-slate-100 font-semibold">
                  Email us at{" "}
                  <a href={`mailto:${MAIL_CONTACT}`} className="underline font-bold">
                    {MAIL_CONTACT}
                  </a>
                </p>
                <p className="text-slate-100 font-semibold">
                  Or use this number{" "}
                  <button className="underline font-bold" onClick={() => setShowContactModal(true)} type="button">
                    {PHONE_CONTACT}
                  </button>
                </p>
                <div className="flex items-center justify-center gap-6 mt-6">
                  <a href={FACEBOOK_URL} target="_blank" className="hover:scale-105 transition">Facebook</a>
                  <a href={INSTAGRAM_URL} target="_blank" className="hover:scale-105 transition">Instagram</a>
                  <a href={WHATSAPP_URL} target="_blank" className="hover:scale-105 transition">WhatsApp</a>
                  <a href={MESSENGER_URL} target="_blank" className="hover:scale-105 transition">Messenger</a>
                </div>
              </div>

              {/* Escritorio: dos filas con línea inferior en teléfono, y bloque email, como tu RN */}
              <div className="hidden lg:flex flex-col justify-between mt-[60px] mb-2">
                <div>
                  <a
                    href={`tel:${PHONE_CONTACT}`}
                    className="flex items-center border-b-2 border-white/40 pb-6"
                  >
                    <div className="ml-3">
                      <div className="text-xl font-bold">{PHONE_CONTACT}</div>
                      <div className="text-white/95 text-lg">{t("contact.callToAction")}</div>
                    </div>
                  </a>
                  <a href={`mailto:${MAIL_CONTACT}`} className="flex items-center pt-6">
                    <div className="ml-3">
                      <div className="text-xl font-bold">{MAIL_CONTACT}</div>
                      <div className="text-white/95 text-lg">{t("contact.emailPrompt")}</div>
                    </div>
                  </a>
                </div>

                <div className="flex gap-5 mt-10">
                  <a href={FACEBOOK_URL} target="_blank" className="hover:scale-105 transition">Facebook</a>
                  <a href={INSTAGRAM_URL} target="_blank" className="hover:scale-105 transition">Instagram</a>
                  <a href={WHATSAPP_URL} target="_blank" className="hover:scale-105 transition">WhatsApp</a>
                  <a href={MESSENGER_URL} target="_blank" className="hover:scale-105 transition">Messenger</a>
                </div>
              </div>
            </aside>

            {/* DERECHA: formulario con misma estructura y espaciados que tu RN */}
            <section className="flex-1 w-full px-4 lg:px-5 pb-3">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Fila nombre/apellido */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:pt-2">
                  <InputField
                    label={t("contact.form.firstName")}
                    value={formData.name}
                    onChange={(v) => handleChange("name", v)}
                    required
                    error={errors.name}
                  />
                  <InputField
                    label={t("contact.form.lastName")}
                    value={formData.lastName}
                    onChange={(v) => handleChange("lastName", v)}
                    required
                    error={errors.lastName}
                  />
                </div>

                {/* Fila email/phone */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <InputField
                    label={t("contact.form.email")}
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(v) => handleChange("email", v)}
                    required
                    error={errors.email}
                  />
                  <InputField
                    label={t("contact.form.phone")}
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(v) => handleChange("phone", v)}
                  />
                </div>

                {/* Address + dropdown */}
                <div className="relative z-10">
                  <InputField
                    label={t("contact.form.address")}
                    value={formData.address}
                    onChange={handleAddressChange}
                    onFocus={() => formData.address.length >= 3 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    autoComplete="street-address"
                  />
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow z-20 overflow-hidden">
                      {addressSuggestions.map((item, i) => (
                        <button
                          key={`${item.display}-${i}`}
                          type="button"
                          onClick={() => handleAddressSelect(item)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50"
                        >
                          {item.display}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* City/State/Zip — 3 columnas en desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                  <InputField
                    label={t("contact.form.city")}
                    value={formData.city}
                    onChange={(v) => handleChange("city", v)}
                  />
                  <InputField
                    label={t("contact.form.state")}
                    value={formData.state}
                    onChange={(v) => handleChange("state", v)}
                  />
                  <InputField
                    label={t("contact.form.zip")}
                    value={formData.postal}
                    onChange={(v) => handleChange("postal", v)}
                    autoComplete="postal-code"
                    inputMode="numeric"
                  />
                </div>

                {/* Mensaje */}
                <TextAreaField
                  label={t("contact.form.message")}
                  value={formData.message}
                  onChange={(v) => handleChange("message", v)}
                />

                {/* Submit */}
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-gray-800 text-white px-5 py-2 disabled:opacity-60"
                  >
                    {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>

      {/* Modal móvil de contacto (tel / sms / whatsapp) */}
      <div
        className={[
          showContactModal ? "fixed" : "hidden",
          "inset-0 z-50 lg:hidden flex items-center justify-center bg-black/50 px-4",
        ].join(" ")}
        aria-hidden={!showContactModal}
      >
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
          <button
            onClick={() => setShowContactModal(false)}
            className="absolute top-3 right-3 text-gray-700"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <h3 className="mb-4 font-bold text-xl text-center text-slate-800">
            {t("contact.title")}
          </h3>
          <div className="space-y-4">
            <a href={`tel:${PHONE_CONTACT}`} className="flex items-center gap-3 py-2">
              <span className="text-slate-800 text-lg">{t("contact.methods.phone")}</span>
            </a>
            <a href={`sms:${PHONE_CONTACT}`} className="flex items-center gap-3 py-2">
              <span className="text-slate-800 text-lg">SMS</span>
            </a>
            <a href={WHATSAPP_URL} target="_blank" className="flex items-center gap-3 py-2">
              <span className="text-slate-800 text-lg">WhatsApp</span>
            </a>
          </div>
          <div className="mt-6 text-center">
            <button onClick={() => setShowContactModal(false)} className="px-4 py-2 rounded-lg border">
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
}) {
  const { label, value, onChange, type = "text", autoComplete, inputMode, required, error, onFocus, onBlur } = props;
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700">
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
          "mt-1 w-full rounded-md border px-3 py-2 bg-white outline-none",
          "focus:ring-2 focus:ring-gray-300",
          error ? "border-red-400" : "border-slate-300",
        ].join(" ")}
      />
    </label>
  );
}

function TextAreaField(props: { label: string; value: string; onChange: (v: string) => void }) {
  const { label, value, onChange } = props;
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-gray-300 border-slate-300 min-h-[120px]"
      />
    </label>
  );
}
