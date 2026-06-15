"use client";

import { useEffect, useState } from "react";
import { PLAY_STORE_URL } from "@/lib/constants";

const DISMISS_KEY = "lotto-review-dismissed";
const VISIT_KEY = "lotto-visit-count";
const MIN_VISITS = 3;

export default function ReviewPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const inApp =
      document.referrer.startsWith("android-app://") ||
      window.matchMedia("(display-mode: standalone)").matches;
    if (!inApp) return;

    const visits = Number(localStorage.getItem(VISIT_KEY) || "0") + 1;
    localStorage.setItem(VISIT_KEY, String(visits));

    const dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    if (!dismissed && visits >= MIN_VISITS) setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md">
      <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center gap-3">
        <span className="text-2xl shrink-0" aria-hidden>
          ⭐
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">앱이 도움이 되셨나요?</p>
          <p className="text-xs text-gray-500 truncate">별점 한 번이면 큰 힘이 됩니다</p>
        </div>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="shrink-0 px-3.5 py-1.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs font-semibold"
        >
          평점 남기기
        </a>
        <button
          onClick={dismiss}
          aria-label="평점 요청 닫기"
          className="shrink-0 px-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
