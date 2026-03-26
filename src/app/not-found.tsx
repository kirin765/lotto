import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
        페이지를 찾을 수 없습니다
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
        요청하신 회차가 존재하지 않거나 아직 추첨되지 않았습니다.
      </p>
      <Link
        href="/"
        className="inline-block py-2.5 px-6 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        최신 당첨번호 보기
      </Link>
    </div>
  );
}
