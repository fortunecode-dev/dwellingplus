"use client";

import { useMemo, useRef, useState,useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import AskQuestion from "@/components/AskQuestion"; // ⬅️ Importa el nuevo componente
import { InlineToast, ToastKind, ToastState } from "./Toast";

type FAQ = { id: number; question: string; answer: string };

export default function FAQSection() {
  const t = useTranslations();
 // Estado del toast
  const [toast, setToast] = useState<ToastState | null>(null);

  // Helper para mostrar toasts
  const showToast = useCallback((kind: ToastKind, message: string) => {
    setToast({ kind, message });
  }, []);
  const keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
  const faqs: FAQ[] = useMemo(
    () =>
      keys.map((k, i) => ({
        id: i,
        question: t(`faq.questions.${k}.question`),
        answer: t(`faq.questions.${k}.answer`),
      })),
    [t]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const  postQuestion = useCallback(async (payload:{email?:string,phone?:string,message?:string}) => {
    try {
     
      const res = await fetch(`/api/prospect/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      // reset
     
      // Antes: alert(t("common.success"))
      showToast("success", t("dataSendSuccess"));
    } catch (err) {
      // Antes: alert(t("common.error"))
      showToast("error", t("dataSendFailure"));
    } 
  }, [showToast, t]);

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen" id="faq">
      {/* Fondo fullscreen */}
            <InlineToast toast={toast} onClose={() => setToast(null)} />

      <div className="absolute inset-0 -z-10">
        <Image src="/main/faqs copia.jpg" alt="FAQs" fill className="object-cover" priority />
        <div className="absolute inset-0 backdrop-blur-[3px]" />
      </div>
      <div className="absolute bottom-0 h-[-0.1px] left-0 w-full inset-0 bg-gradient-to-b from-white  via-20% via-white/20 to-transparent" />
      <div className="absolute bottom-0 h-[-0.1px] left-0 w-full inset-0 bg-gradient-to-t from-white  via-20% via-white/20 to-transparent" />

      {/* Wrapper */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-2 sm:px-4">
        {/* Panel translúcido */}
        <div
          className="w-full max-w-7xl rounded-[15px] shadow-sm"
          style={{ backgroundColor: "rgba(255,255,255,0.70)" }}
        >
          {/* Título */}
          <h2 className="py-4 text-center text-2xl font-bold text-gray-800 lg:text-3xl">
            {t("faq.title")}
          </h2>

          {/* Layout principal */}
          <div className="mb-10 grid w-full place-items-stretch gap-6 px-4 md:grid-cols-[1fr_minmax(320px,520px)] lg:gap-8">
            {/* Lista preguntas */}
            <div className="flex-1 m-auto">
              <div className="grid grid-cols-1 gap-3 p-2">
                {faqs.map((faq, i) => {
                  const isSelected = i === selectedIndex;
                  return (
                    <button
                      key={faq.id}
                      onClick={() => {
                        setSelectedIndex(i);
                        setShowAnswerModal(true); // en móvil abre modal; en md+ verás el panel derecho
                      }}
                      className={[
                        "w-full rounded-xl border px-3 py-3 text-left shadow-sm transition-all",
                        isSelected
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-800 hover:bg-gray-50",
                        "focus:outline-none focus:ring-2 focus:ring-gray-300",
                      ].join(" ")}
                      aria-expanded={isSelected}
                    >
                      <span
                        className="font-bold"
                        style={{ fontSize: 17 }}
                      >
                        {faq.question}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Form en móvil */}
              <div className="mt-3 rounded-xl p-2 md:hidden">
                <h4 className="py-2 text-center text-2xl font-bold text-gray-800">
                  {t("questionForm.title")}
                </h4>
                <AskQuestion
                 onConfirm={(payload) => postQuestion(payload)} // <- cuando quieras integrar servicio
                />
              </div>
            </div>

            {/* Panel respuesta (md+) */}
            <aside
              className="hidden max-w-[520px] justify-self-center rounded-xl p-2 lg:p-3 md:block m-auto"
            >

              <h3 className="mb-2 text-xl font-bold text-gray-800">
                {faqs[selectedIndex]?.question}
              </h3>
              <p className="whitespace-pre-line text-lg text-gray-700">
                {faqs[selectedIndex]?.answer}
              </p>

              <div className="mt-3 w-full rounded-xl pb-2">
                <h4 className="py-2 text-center text-2xl font-bold text-gray-800">
                  {t("questionForm.title")}
                </h4>
                <AskQuestion
                  compact
                 onConfirm={(payload) => postQuestion(payload)} // <- cuando quieras integrar servicio
                />
              </div>
            </aside>

          </div>
          <div className="flex justify-center items-center w-full mb-6 animate-fadeIn">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={200}
              height={50}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Modal respuesta (solo móvil) */}
      <div
        className={[
          showAnswerModal ? "fixed" : "hidden",
          "md:hidden inset-0 z-50 flex items-center justify-center bg-black/50 px-4",
        ].join(" ")}
        aria-hidden={!showAnswerModal}
      >
        <div className="relative w-full max-w-md rounded-xl bg-white p-6">
          <button
            onClick={() => setShowAnswerModal(false)}
            className="absolute right-3 top-3 text-blue-900"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <h4 className="mb-4 text-lg font-bold text-blue-900">
            {faqs[selectedIndex]?.question}
          </h4>
          <p className="whitespace-pre-line text-base text-blue-900">
            {faqs[selectedIndex]?.answer}
          </p>
        </div>
      </div>

    </div>
  );
}

