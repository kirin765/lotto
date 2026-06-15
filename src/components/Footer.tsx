import Link from "next/link";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
        <Link
          href="/app"
          className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline mb-3"
        >
          📱 로또 당첨번호 앱 다운로드
        </Link>
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
          본 사이트는 동행복권과 관련 없는 비공식 사이트입니다.
          <br />
          당첨번호 데이터는 동행복권에서 제공하는 공공 정보입니다.
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
          © {CURRENT_YEAR} 로또 당첨번호
        </p>
      </div>
    </footer>
  );
}
