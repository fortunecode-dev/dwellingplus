"use client";

import { useState, useRef, useEffect } from "react";
import {useTranslations} from 'next-intl';
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
  const  t  = useTranslations();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Imágenes desde /public
  const serviceImages: Record<string, string[]> = {
    adu: ["/ADU/6.jpg", "/ADU/1.webp", "/ADU/2.webp"],
    remodeling: ["/REMODELATION/1.webp", "/REMODELATION/2.webp"],
    backyard: ["/BACKYARD/1.webp", "/BACKYARD/2.webp"],
    repair: ["/REPAIR/1.webp", "/REPAIR/2.webp"],
    support: ["/FINANCING/1.webp", "/FINANCING/2.webp"],
  };
const servicesList=["0","1","2","3","4"]
  const services: Service[] = servicesList.map((service)=>({
    id:t(`services.servicesList.${service}.id`),
    title:t(`services.servicesList.${service}.title`),
    description:t(`services.servicesList.${service}.description`),
    content:t(`services.servicesList.${service}.content`),
    images:serviceImages[t(`services.servicesList.${service}.id`)]||[]
  }));

  const openModalWithService = (service: Service) => {
    setSelectedService(service);
    setCurrentImageIndex(0);
    setModalVisible(true);
  };

  const handlePrevImage = () => {
    if (!selectedService) return;
    setCurrentImageIndex((prev) =>
      prev === 0 && selectedService?.images?.length? selectedService.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!selectedService) return;
    setCurrentImageIndex((prev) =>
     selectedService?.images?.length&& prev === selectedService.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section
      id="#services"
      className="relative flex flex-col items-center justify-center w-full py-16 bg-white"
    >
      {/* Fondo */}
      <div className="absolute inset-0">
        <Image
          src="/main/services.jpeg"
          alt="Services background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-sm bg-white/50" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl w-full px-4">
          <>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
              {t("services.title")}
            </h2>
            <p className="text-xl md:text-2xl font-medium text-center text-gray-900 mb-8">
              {t("services.subtitle")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map((service) => (
                <button
                  key={service.id}
                  onClick={() => openModalWithService(service)}
                  className="bg-white/60 rounded-lg shadow hover:shadow-lg overflow-hidden transition"
                >
                  <Image
                    src={service?.images?.[0]??""}
                    alt={service.title}
                    width={400}
                    height={200}
                    className="object-cover w-full h-40"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900">{service.title}</h3>
                    <p className="text-gray-700 text-sm opacity-80 line-clamp-3">
                      {service.description}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-right">{t("common.readMore")}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
      </div>

      {/* Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 relative">
            {/* Cerrar */}
            <button
              onClick={() => setModalVisible(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
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
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setModalVisible(false);
                      if (scrollToSection) scrollToSection("contact", true);
                    }}
                    className="bg-[#315072] text-white px-4 py-2 rounded hover:bg-[#253A50] transition"
                  >
                    {t("common.getStarted")}
                  </button>
                </div>
              </div>

              {/* Carrusel */}
              <div className="flex-1 relative">
                <Image
                  src={selectedService?.images?.[currentImageIndex]??""}
                  alt={`${selectedService.title} ${currentImageIndex + 1}`}
                  width={500}
                  height={300}
                  className="rounded-lg object-cover w-full h-64"
                />
                {/* Flechas */}
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/70 px-2 py-1 rounded-full"
                >
                  ‹
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/70 px-2 py-1 rounded-full"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
