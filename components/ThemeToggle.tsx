"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-ss-white transition-colors duration-300 hover:border-ss-red/50 hover:text-ss-red dark:bg-white/5 dark:text-ss-white"
    >
      <svg
        className={`h-5 w-5 transition-all duration-300 ${isDark ? "scale-100 rotate-0" : "scale-0 -rotate-90 absolute"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3c0 0 1.55 6.29 9.79 9.79Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        className={`h-5 w-5 transition-all duration-300 ${isDark ? "scale-0 rotate-90 absolute" : "scale-100 rotate-0"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
