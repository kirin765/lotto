"use client";

import { getBallColor } from "@/lib/constants";

interface NumberGridProps {
  highlights?: Map<number, number>;
  selected?: Set<number>;
  onToggle?: (num: number) => void;
}

export default function NumberGrid({
  highlights,
  selected,
  onToggle,
}: NumberGridProps) {
  return (
    <div className="grid grid-cols-9 gap-1.5 max-w-sm mx-auto">
      {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
        const color = getBallColor(num);
        const isSelected = selected?.has(num);
        const freq = highlights?.get(num);

        return (
          <button
            key={num}
            type="button"
            onClick={() => onToggle?.(num)}
            className={`
              aspect-square rounded-full text-xs font-bold flex items-center justify-center transition-all
              ${
                isSelected
                  ? `${color.bg} ${color.text} scale-110 ring-2 ring-offset-1 ring-blue-400`
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }
            `}
            aria-label={`번호 ${num}${freq !== undefined ? `, 출현 ${freq}회` : ""}`}
            aria-pressed={isSelected}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}
