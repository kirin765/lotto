import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PLAY_STORE_URL, SITE_NAME } from "@/lib/constants";
import {
  generateAppJsonLd,
  generateFAQJsonLd,
  generateMeta,
  generateWebPageJsonLd,
} from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";

export const revalidate = 86400;

const FEATURES = [
  { icon: "⚡", title: "추첨 직후 바로 확인", desc: "매주 토요일 추첨이 끝나면 최신 당첨번호를 가장 빠르게 받아봅니다." },
  { icon: "📋", title: "전 회차 조회", desc: "1회차부터 최신 회차까지 모든 당첨번호를 한 곳에서 검색합니다." },
  { icon: "📊", title: "번호별 출현 통계", desc: "번호별 출현 빈도를 분석해 자주 나온 번호를 한눈에 봅니다." },
  { icon: "🎲", title: "무료 번호 생성기", desc: "조합을 즉석에서 자동 생성합니다. 광고 외 추가 비용이 없습니다." },
];

const STEPS = [
  "아래 ‘Google Play에서 받기’ 버튼을 누릅니다.",
  "Play 스토어에서 ‘설치’를 누릅니다.",
  "앱을 열면 최신 회차 당첨번호가 바로 표시됩니다.",
];

const APP_FAQ = [
  {
    question: "로또 당첨번호 앱은 무료인가요?",
    answer:
      "네, 무료로 다운로드하고 모든 기능을 이용할 수 있습니다. 최신·역대 당첨번호 조회, 번호 통계, 번호 생성기까지 추가 비용 없이 제공합니다.",
  },
  {
    question: "어떤 기기에서 사용할 수 있나요?",
    answer:
      "현재 Google Play 스토어를 통해 안드로이드 기기에서 설치할 수 있습니다. 별도 설치 없이 웹사이트(lotto6.kr)에서도 동일한 정보를 볼 수 있습니다.",
  },
  {
    question: "당첨번호는 얼마나 빨리 업데이트되나요?",
    answer:
      "매주 토요일 오후 8시 35분 추첨이 끝난 직후, 동행복권 공식 결과가 확정되는 대로 앱에 반영됩니다.",
  },
  {
    question: "이 앱에서 로또를 구매할 수 있나요?",
    answer:
      "아니요. 이 앱은 당첨번호 확인·통계·번호 생성을 위한 정보 앱입니다. 실제 구매와 당첨금 수령은 동행복권 공식 채널을 이용하세요.",
  },
];

export const metadata: Metadata = generateMeta({
  title: "로또 당첨번호 앱 무료 다운로드 (안드로이드)",
  description:
    "로또 6/45 최신 당첨번호를 추첨 직후 바로 확인하는 무료 안드로이드 앱. 전 회차 조회·번호 통계·번호 생성기까지 한 번에. Google Play에서 무료 설치하세요.",
  path: "/app",
});

export default function AppLandingPage() {
  return (
    <>
      <JsonLd data={generateAppJsonLd()} />
      <JsonLd
        data={generateWebPageJsonLd({
          title: `${SITE_NAME} 앱 다운로드`,
          description:
            "로또 6/45 당첨번호 확인 앱을 무료로 다운로드할 수 있는 안내 페이지입니다.",
          path: "/app",
        })}
      />
      <JsonLd data={generateFAQJsonLd(APP_FAQ)} />

      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "앱 다운로드" }]} />

      <section className="text-center mt-2">
        <Image
          src="/icon-192.png"
          alt="로또 당첨번호 앱 아이콘"
          width={72}
          height={72}
          className="mx-auto rounded-2xl shadow-sm"
        />
        <h1 className="mt-4 text-2xl font-bold leading-snug">
          로또 당첨번호 앱
          <br />
          <span className="text-blue-600 dark:text-blue-400">무료 다운로드</span>
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          로또 6/45 최신 당첨번호를 추첨 직후 가장 빠르게 확인하세요. 전 회차
          조회, 번호 통계, 번호 생성기까지 한 곳에서 무료로 제공합니다.
        </p>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-semibold"
        >
          ▶ Google Play에서 받기
        </a>
      </section>

      <section aria-label="주요 기능" className="mt-10">
        <h2 className="text-base font-bold mb-4">주요 기능</h2>
        <ul className="grid grid-cols-1 gap-3">
          {FEATURES.map((f) => (
            <li
              key={f.title}
              className="flex gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3"
            >
              <span className="text-xl shrink-0" aria-hidden>
                {f.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {f.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="설치 방법" className="mt-10">
        <h2 className="text-base font-bold mb-4">설치 방법</h2>
        <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {i + 1}.
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="앱 자주 묻는 질문" className="mt-10">
        <h2 className="text-base font-bold mb-4">자주 묻는 질문</h2>
        <dl className="space-y-4">
          {APP_FAQ.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3"
            >
              <dt className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {item.question}
              </dt>
              <dd className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← 최신 당첨번호 보러가기
        </Link>
      </p>
    </>
  );
}
