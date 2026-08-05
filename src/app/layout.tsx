import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Seekhe By Chaturvedi Sir | Coaching Center Gwalior",
  description: "English Seekhe By Chaturvedi Sir — Gwalior ke best English coaching center. Academic aur competition ke liye English sikhe. Mayur Vihar, Thatipur, Gwalior (MP). Call: +917987947561",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body>
        {children}
      </body>
    </html>
  );
}
