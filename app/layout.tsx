import type { ReactNode } from "react";
import { Newsreader, Work_Sans } from "next/font/google";
import { SpiralScrollbar } from "@/components/SpiralScrollbar";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
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
    <html lang="en" className={`${newsreader.variable} ${workSans.variable}`}>
      <body>
        <SpiralScrollbar />
        {children}
      </body>
    </html>
  );
}
