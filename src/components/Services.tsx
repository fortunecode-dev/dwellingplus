"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Service {
  id: string;
  title: string;
  description: string;
  content: string;
  images?: string[];
}

interface Props {
  scrollToSection?: (section: string, force?: boolean) => void;
}

export default function ServicesSection({ scrollToSection }: Props) {
  const t = useTranslations();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Imágenes desde /public
  const serviceImages: Record<string, string[]> = {
    adu: ["/ADU/6.jpg", "/ADU/1.webp", "/ADU/2.webp"],
    remodeling: ["/REMODELATION/1.webp", "/REMODELATION/2.webp"],
    backyard: ["/BACKYARD/1.webp", "/BACKYARD/2.webp"],
    repair: ["/REPAIR/1.webp", "/REPAIR/2.webp"],
    support: ["/FINANCING/1.webp", "/FINANCING/2.webp"],
  };

  const servicesList = ["0", "1", "2", "3", "4"];
  const services: Service[] = servicesList.map((service) => ({
    id: t(`services.servicesList.${service}.id`),
    title: t(`services.servicesList.${service}.title`),
    description: t(`services.servicesList.${service}.description`),
    content: t(`services.servicesList.${service}.content`),
    images: serviceImages[t(`services.servicesList.${service}.id`)] || [],
  }));

  const openModalWithService = (service: Service) => {
    setSelectedService(service);
    setCurrentImageIndex(0);
    setLightboxOpen(false);
  };

  const closeModal = () => {
    setSelectedService(null);
    setLightboxOpen(false);
  };

  const handlePrevImage = () => {
    if (!selectedService?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedService.images!.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!selectedService?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === selectedService.images!.length - 1 ? 0 : prev + 1
    );
  };

  const currentImageSrc =
    selectedService?.images?.[currentImageIndex] ?? "/placeholder.webp";

  return (
    <section
      id="services"
      className="relative flex flex-col items-center justify-center w-full py-16 bg-white"
    >
      {/* Fondo */}
      <div className="absolute inset-0">
        <Image
          src="/main/services copia.jpg"
          alt="Services background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 backdrop-blur-[3px] bg-white/10" />
      </div>
      <div className="absolute bottom-0 h-[-0.1px] left-0 w-full inset-0 bg-gradient-to-b from-white  via-20% via-white/20 to-transparent" />
      <div className="absolute bottom-0 h-[-0.1px] left-0 w-full inset-0 bg-gradient-to-t from-white  via-20% via-white/20 to-transparent" />


      {/* Contenido */}
      <div className="relative z-10 m-2 p-2 bg-white/60 rounded-xl max-w-6xl w-full px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
          {t("services.title")}
        </h2>
        <p className="text-xl md:text-2xl font-medium text-center text-gray-900 mb-1">
          {t("services.subtitle")}
        </p>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 p-2 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => openModalWithService(service)}
              className="group bg-white/70 rounded-lg shadow hover:shadow-lg overflow-hidden transition border border-gray-100 text-left"
            >
              {/* Imagen con altura menor en móvil */}
              <div className="relative w-full h-32 sm:h-40 md:h-48">
                <Image
                  src={service.images?.[0] ?? "/placeholder.webp"}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Texto con padding reducido en móvil */}
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-base sm:text-lg text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm opacity-90 line-clamp-3">
                  {service.description}
                </p>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-right">
                  {t("common.readMore")}
                </p>
              </div>
            </button>
          ))}
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

      {/* Modal detalle */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-5xl w-full p-6 relative mx-2">
            {/* Cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl leading-none"
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>

            {/* Contenido modal */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Texto */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedService.title}
                </h3>
                <p className="text-gray-700 mb-6">{selectedService.content}</p>
                <div className="flex gap-3" onClick={closeModal}>
                  <a
                    href="#contact"
                    className="bg-[#315072] text-white px-4 py-2 rounded hover:bg-[#253A50] transition"
                  >
                    {t("common.getStarted")}
                  </a>
                </div>
              </div>

              {/* Carrusel */}
              <div className="flex-1 relative">
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="block w-full"
                  aria-label="Open image fullscreen"
                  title="Open image fullscreen"
                >
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={currentImageSrc}
                      alt={`${selectedService.title} ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>
                </button>

                {/* Flechas */}
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 px-3 py-1.5 rounded-full shadow hover:bg-white"
                  aria-label="Previous image"
                  title="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 px-3 py-1.5 rounded-full shadow hover:bg-white"
                  aria-label="Next image"
                  title="Next"
                >
                  ›
                </button>

                {/* Indicadores */}
                {selectedService.images?.length ? (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedService.images.map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-2 rounded-full ${i === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/80"
                          }`}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* LIGHTBOX: pantalla completa con object-contain */}
          {lightboxOpen && (
            <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
              {/* Cerrar lightbox */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl"
                aria-label="Close fullscreen"
                title="Close"
              >
                ✕
              </button>

              {/* Navegación */}
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-5xl"
                aria-label="Previous image"
                title="Previous"
              >
                ‹
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-5xl"
                aria-label="Next image"
                title="Next"
              >
                ›
              </button>

              {/* Imagen central contenida */}
              <div className="relative w-[92vw] h-[88vh]">
                <Image
                  src={currentImageSrc}
                  alt={`${selectedService.title} fullscreen`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
