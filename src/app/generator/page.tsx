import type { Metadata } from "next";
import { generateMeta, generateWebPageJsonLd } from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import GeneratorClient from "./GeneratorClient";

export const metadata: Metadata = generateMeta({
  title: "번호 생성기",
  description:
    "로또 6/45 번호를 랜덤으로 생성해보세요. 1~45 중 6개 번호를 자동으로 추첨합니다.",
  path: "/generator",
  images: ["/opengraph-image"],
});

export default function GeneratorPage() {
  return (
    <>
      <JsonLd
        data={generateWebPageJsonLd({
          title: "로또 번호 생성기",
          description:
            "1부터 45까지 숫자 중 6개를 무작위로 조합해 로또 6/45 번호를 생성하는 도구 페이지입니다.",
          path: "/generator",
        })}
      />
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "번호 생성기" }]} />
      <h1 className="text-xl font-bold mb-2">🎲 번호 생성기</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        랜덤으로 로또 번호를 생성해보세요
      </p>
      <p className="mb-6 text-sm leading-6 text-gray-600 dark:text-gray-300">
        번호 생성기는 로또 6/45 규칙에 맞춰 1부터 45 사이 숫자 6개를 중복 없이 무작위로
        추천합니다. 통계 페이지와 함께 참고용으로 활용할 수 있습니다.
      </p>
      <GeneratorClient />
    </>
  );
}
