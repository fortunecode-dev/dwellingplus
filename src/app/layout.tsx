// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/layout/Header";
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/layout/Footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  // Refs a las secciones HTML

  const sections = ["home", "services", "faq"];

  return (
    <html lang={locale}>

      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={` antialiased`}
      >
        <NextIntlClientProvider>
          <Header sections={sections} locale={locale}/>
          {children}
          <Footer/>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
