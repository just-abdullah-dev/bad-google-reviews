import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/store/StoreProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Bad Google Review",
  description: "Bad Google Review",
};

export default async function RootLayout({ children, params: { locale } }) {
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning={true} lang={locale}>
      <body className={` ${poppins.className} antialiased`}>
        <StoreProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
