import type { Metadata } from "next";
// import "../styles/globals.css";
import Header from "@/components/Layout/Header";
import { ReactNode } from "react";
import ApolloWrapper from "@/lib/ApolloProviderWrapper";

export const metadata: Metadata = {
  title: "Hackernews Clone",
  description: "Built wth Next.js and Apollo",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div>
          <Header />
          <div>
            <ApolloWrapper>{children}</ApolloWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}
