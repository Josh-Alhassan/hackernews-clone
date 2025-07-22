import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/Layout/Header";
import { ReactNode } from "react";
import ApolloWrapper from "@/lib/ApolloProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hackernews Clone",
  description: "Built wth Next.js and Apollo",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="center w85">
          <Header />
          <div className="ph3 pv1 background-gray">
            <ApolloWrapper>{children}</ApolloWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}
