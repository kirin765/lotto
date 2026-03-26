"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          🎱 <span className="text-gray-900 dark:text-white">로또</span>
        </Link>
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/" || pathname.startsWith("/lotto")
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="hidden sm:inline mr-1">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
