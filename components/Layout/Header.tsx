"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN } from "@/constants";

const Header: React.FC = () => {
  const router = useRouter();
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN) : null;

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN);
    router.push("/");
  };

  return (
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <Link href="/" className="no-underline black">
          <div className="fw7 mr1">Hacker News</div>
        </Link>
        <Link href="/" className="ml1 no-underline black">
          new
        </Link>
        <div className="ml1">|</div>
        <Link href="/search" className="ml1 no-underline black">
          search
        </Link>
        {authToken && (
          <div className="flex">
            <div className="ml1">|</div>
            <Link href="/create" className="ml1 no-underline black">
              submit
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div className="ml1 pointer black" onClick={handleLogout}>
            logout
          </div>
        ) : (
          <Link href="/login" className="ml1 no-underline black">
            login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
