// import localFont from "next/font/local";
import {Poppins} from 'next/font/google'
import "./globals.css";

const poppins = Poppins({ subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], })

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata = {
  title: "Bad Google Review",
  description: "Bad Google Review",
};

// ${geistSans.variable} ${geistMono.variable} 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` ${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
