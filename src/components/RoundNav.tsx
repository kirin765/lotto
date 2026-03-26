import Link from "next/link";

interface RoundNavProps {
  currentRound: number;
  latestRound: number;
}

export default function RoundNav({ currentRound, latestRound }: RoundNavProps) {
  const hasPrev = currentRound > 1;
  const hasNext = currentRound < latestRound;

  return (
    <nav className="flex items-center justify-between gap-3 mt-6" aria-label="회차 이동">
      {hasPrev ? (
        <Link
          href={`/lotto/${currentRound - 1}`}
          className="flex-1 py-2.5 px-4 text-center rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          ← {currentRound - 1}회
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {hasNext ? (
        <Link
          href={`/lotto/${currentRound + 1}`}
          className="flex-1 py-2.5 px-4 text-center rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {currentRound + 1}회 →
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
