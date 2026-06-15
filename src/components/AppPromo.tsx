import Link from "next/link";

export default function AppPromo() {
  return (
    <Link
      href="/app"
      aria-label="로또 당첨번호 앱 다운로드 안내"
      className="mt-8 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span className="text-2xl shrink-0" aria-hidden>
        📱
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          앱으로 더 빠르게 받기
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          매주 추첨 직후 당첨번호 확인 · 무료 다운로드
        </p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-blue-600 dark:text-blue-400">
        보기 →
      </span>
    </Link>
  );
}
