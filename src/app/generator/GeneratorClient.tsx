"use client";

import { useState, useCallback } from "react";
import LottoBalls from "@/components/LottoBalls";
import NumberGrid from "@/components/NumberGrid";

interface GeneratedSet {
  id: number;
  numbers: number[];
}

export default function GeneratorClient() {
  const [results, setResults] = useState<GeneratedSet[]>([]);
  const [excluded, setExcluded] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState<"auto" | "exclude">("auto");

  const generate = useCallback(() => {
    setIsAnimating(true);
    const pool = Array.from({ length: 45 }, (_, i) => i + 1).filter(
      (n) => !excluded.has(n)
    );

    if (pool.length < 6) {
      setIsAnimating(false);
      return;
    }

    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const numbers = pool.slice(0, 6).sort((a, b) => a - b);

    setTimeout(() => {
      setResults((prev) => [
        { id: Date.now(), numbers },
        ...prev.slice(0, 9),
      ]);
      setIsAnimating(false);
    }, 400);
  }, [excluded]);

  const toggleExclude = useCallback((num: number) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setResults([]);
    setExcluded(new Set());
  }, []);

  return (
    <div className="space-y-6">
      {/* 모드 토글 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("auto")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "auto"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          }`}
        >
          자동 생성
        </button>
        <button
          type="button"
          onClick={() => setMode("exclude")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "exclude"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          }`}
        >
          제외번호 선택
        </button>
      </div>

      {/* 제외번호 선택 그리드 */}
      {mode === "exclude" && (
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 text-center">
            제외할 번호를 탭하세요 ({excluded.size}개 선택)
          </p>
          <NumberGrid selected={excluded} onToggle={toggleExclude} />
        </div>
      )}

      {/* 생성 버튼 */}
      <button
        type="button"
        onClick={generate}
        disabled={isAnimating}
        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-base transition-colors active:scale-[0.98]"
      >
        {isAnimating ? (
          <span className="inline-flex items-center gap-2">
            <span className="animate-spin">🎱</span> 추첨 중...
          </span>
        ) : (
          "번호 생성하기"
        )}
      </button>

      {/* 결과 목록 */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              생성 결과
            </h2>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-600 transition-colors"
            >
              전체 삭제
            </button>
          </div>
          {results.map((set, i) => (
            <div
              key={set.id}
              className={`bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 ${
                i === 0 ? "ring-2 ring-blue-200 dark:ring-blue-800" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  #{results.length - i}
                </span>
              </div>
              <LottoBalls numbers={set.numbers} size="md" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
