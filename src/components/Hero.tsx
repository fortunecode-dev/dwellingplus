"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";


export default function Hero() {
    const  t = useTranslations();
    return (
        <section className="relative flex flex-1 w-full h-screen overflow-hidden">
            {/* Fondo claro */}
            <div className="absolute inset-0 bg-gray-100 z-0" />

            {/* Imagen de fondo con blur */}
            <div className="absolute inset-0">
                <Image
                    src="/main/landing.jpg"
                    alt="Landing background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 backdrop-blur-[3px] bg-white/10" />
            </div>

            {/* Contenido */}
            <div className="relative z-20 flex flex-col lg:flex-row justify-center lg:items-center px-6 md:px-16 lg:px-32 w-full h-full">
                <div
                    className={`flex flex-col justify-center items-center w-full`}
                >
                    {/* Logo */}
                    <div className="flex justify-center items-center w-full mb-6 animate-fadeIn">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={ 700 }
                            height={  100 }
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Texto principal */}
                    <p
                        className={`text-center text-gray-800 font-normal mb-6 text-xl `}
                    >
                        {t("landing.title")}
                    </p>

                    {/* Botones */}
                    <div className="flex justify-center items-center gap-4">
                        <Link
                            href={"#services"}
                            className="px-4 py-2 rounded-md font-semibold text-gray-800 hover:bg-gray-200 transition"
                        >
                            {t("common.moreInfo")}
                        </Link>
                        <Link
                            href={"#contact"}
                            className="px-4 py-2 rounded-md font-semibold text-white bg-[#315072] hover:bg-[#253A50] transition"
                        >
                            {t("common.getStarted")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
