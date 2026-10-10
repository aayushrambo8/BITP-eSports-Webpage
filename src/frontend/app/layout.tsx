import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroVideo from "@/components/IntroVideo";
import ScrollCyberpunkBackground from "@/components/ScrollCyberpunkBackground";

export const metadata: Metadata = {
  title: "Xordium 5.0 | BIT Esports Festival",
  description: "A campus gathering for the people who play, cheer, create, and make every match a story worth telling.",
  keywords: ["Xordium 5.0", "BIT", "campus esports", "gaming festival", "college event"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anybody:ital,wght@0,700;0,800;0,900;1,800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ScrollCyberpunkBackground />
        <div className="site-shell">
          <Navbar />
          <div className="site-content">
            {children}
          </div>
          <Footer />
        </div>
        <IntroVideo />
      </body>
    </html>
  );
}
