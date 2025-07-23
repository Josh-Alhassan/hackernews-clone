"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN } from "@/constants";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const router = useRouter();
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN) : null;

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN);
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navLeft}>
        <Link href="/" className={styles.logo}>
          Hacker News
        </Link>
        <Link href="/" className={styles.link}>
          new
        </Link>
        <span className={styles.divider}>|</span>
        <Link href="/search" className={styles.link}>
          search
        </Link>
        {authToken && (
          <>
            <span className={styles.divider}>|</span>
            <Link href="/create" className={styles.link}>
              submit
            </Link>
          </>
        )}
      </nav>
      <nav className={styles.navRight}>
        {authToken ? (
          <span className={styles.logout} onClick={handleLogout}>
            logout
          </span>
        ) : (
          <Link href="/login" className={styles.link}>
            login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
