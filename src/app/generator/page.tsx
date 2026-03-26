import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
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
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "번호 생성기" }]} />
      <h1 className="text-xl font-bold mb-2">🎲 번호 생성기</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        랜덤으로 로또 번호를 생성해보세요
      </p>
      <GeneratorClient />
    </>
  );
}
