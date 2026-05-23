import type { ReactNode } from "react";
import { Spectral, Manrope } from "next/font/google";
import { SpiralScrollbar } from "@/components/SpiralScrollbar";
import "./globals.css";

const heading = Spectral({
  subsets: ["latin"],
  variable: "--font-heading-raw",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body-raw",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Leapfrog — Know what your competitors are doing first",
  description:
    "Real-time competitor radar for small businesses. Promos, pricing moves and viral posts from the shops on your block — surfaced before your customers notice.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <SpiralScrollbar />
        {children}
      </body>
    </html>
  );
}
