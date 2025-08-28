"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { InlineToast } from "./Toast";

type Props = {
  compact?: boolean;
  onConfirm?: (data: { question: string; email?: string; phone?: string }) => Promise<void>;
};

const emailRegex = /\S+@\S+\.\S+/;
const phoneRegex = /^[0-9+\-\s()]{7,}$/;

export default function AskQuestion({ compact, onConfirm }: Props) {
  const t = useTranslations();
  const [question, setQuestion] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const emailValid = !email || emailRegex.test(email.trim());
  const phoneValid = !phone || phoneRegex.test(phone.trim());
  const hasContact = (email && emailValid) || (phone && phoneValid);

  const canOpenModal = useMemo(() => question.trim().length >= 5, [question]);

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canOpenModal) return;
    setShowContactModal(true);
  };

  const handleConfirm = () => {
    if (!hasContact) return;
    onConfirm?.({ question, email: email || undefined, phone: phone || undefined });
    setShowContactModal(false);
    setQuestion("");
    setEmail("");
    setPhone("");
  };

  const baseField =
    "w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 transition";

  return (
    <form
      onSubmit={handleOpenModal}
      className={`w-full ${compact ? "space-y-2" : "space-y-3"}`}
      aria-label={t("questionForm.ariaLabel")}
    >
      
      <div className="flex flex-col gap-1">
        {/* <label className="text-sm sm:text-sm font-medium text-gray-700">
          {t("questionForm.question")}
        </label> */}
        <textarea
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t("questionForm.questionPlaceholder")}
          className={`${baseField} min-h-[64px] border-gray-300 bg-white focus:ring-blue-300`}
        />
      </div>

      <div className="flex items-center gap-2 flex-row-reverse">
        <button
          type="submit"
          disabled={!canOpenModal}
          className={`rounded-lg px-4 py-2 font-semibold text-gray-900 transition
            ${canOpenModal ? "bg-blue-300 hover:bg-blue-400" : "bg-gray-200 cursor-not-allowed"}`}
        >
          {t("questionForm.sendButton")}
        </button>

        <button
          type="button"
          onClick={() => setQuestion("")}
          className="rounded-lg px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800"
        >
          {t("common.clear")}
        </button>
      </div>

      {/* Modal contacto */}
      <div
        className={[
          showContactModal ? "fixed" : "hidden",
          "inset-0 z-50 flex items-center justify-center bg-black/50 px-4",
        ].join(" ")}
        aria-hidden={!showContactModal}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
          <button
            type="button"
            onClick={() => setShowContactModal(false)}
            className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
            aria-label={t("common.close") || "Cerrar"}
          >
            ✕
          </button>

          <h3 className="mb-4 text-center text-lg font-bold text-gray-800">
            {t("questionForm.title2")}
          </h3>

          <div className="mb-3">
            <label className="mb-1 block text-sm sm:text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("questionForm.emailPlaceholder")}
              className={`${baseField} ${emailValid ? "border-gray-300 focus:ring-blue-300" : "border-red-400 focus:ring-red-300"}`}
              autoComplete="email"
            />
            {!emailValid && (
              <p className="mt-1 text-xs text-red-600">{t("questionForm.errorEmail")}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-sm sm:text-sm font-medium text-gray-700">
              {t("questionForm.phone")}
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("questionForm.phonePlaceholder")}
              className={`${baseField} ${phoneValid ? "border-gray-300 focus:ring-blue-300" : "border-red-400 focus:ring-red-300"}`}
              inputMode="tel"
              autoComplete="tel"
            />
            {!phoneValid && (
              <p className="mt-1 text-xs text-red-600">{t("questionForm.errorPhone")}</p>
            )}
          </div>

          {!hasContact && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {t("questionForm.atLeastOneField")}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setShowContactModal(false)}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              {t("common.cancel") || "Cancelar"}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!hasContact}
              className={`flex-1 rounded-lg px-4 py-2 font-semibold text-gray-900 transition
                ${hasContact ? "bg-blue-300 hover:bg-blue-400" : "bg-gray-200 cursor-not-allowed"}`}
            >
              {t("questionForm.sendButton2")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
