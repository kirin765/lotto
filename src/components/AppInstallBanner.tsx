"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PLAY_STORE_URL } from "@/lib/constants";

const DISMISS_KEY = "lotto-app-banner-dismissed";

export default function AppInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const inApp =
      document.referrer.startsWith("android-app://") ||
      window.matchMedia("(display-mode: standalone)").matches;
    const dismissed = localStorage.getItem(DISMISS_KEY) === "1";

    if (isAndroid && !inApp && !dismissed) setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md">
      <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center gap-3">
        <Image
          src="/icon-192.png"
          alt="로또 당첨번호 앱"
          width={40}
          height={40}
          className="rounded-lg shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">로또 당첨번호 앱</p>
          <p className="text-xs text-gray-500 truncate">당첨번호를 가장 빠르게 — 무료 설치</p>
        </div>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3.5 py-1.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs font-semibold"
        >
          설치
        </a>
        <button
          onClick={dismiss}
          aria-label="배너 닫기"
          className="shrink-0 px-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
