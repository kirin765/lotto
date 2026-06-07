import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${SITE_NAME} 개인정보처리방침`,
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = "kwan765@naver.com";
const EFFECTIVE_DATE = "2026년 6월 7일";

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1 className="text-2xl font-bold mb-2">개인정보처리방침</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        시행일: {EFFECTIVE_DATE}
      </p>

      <p className="mb-4">
        {SITE_NAME}(이하 &ldquo;서비스&rdquo;)는 이용자의 개인정보를 중요하게
        생각하며, 「개인정보 보호법」 등 관련 법령을 준수합니다. 본
        개인정보처리방침은 서비스(웹사이트 및 Android 앱)가 어떤 정보를 어떻게
        다루는지 설명합니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">1. 수집하는 개인정보</h2>
      <p className="mb-4">
        서비스는 회원가입, 로그인, 결제 기능을 제공하지 않으며 이름, 연락처,
        주소 등 이용자를 식별할 수 있는 개인정보를 직접 수집하지 않습니다.
        서비스 이용 과정에서 이용자가 별도로 정보를 입력하거나 제출하는 절차는
        없습니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        2. 자동으로 수집되는 정보
      </h2>
      <p className="mb-4">
        서비스 품질 개선과 이용 통계 분석을 위해 Vercel Analytics를 통해 익명의
        사용 데이터(페이지 조회, 대략적인 지역, 기기 유형, 브라우저 종류 등)가
        집계됩니다. 이 데이터는 개인을 식별하지 않는 형태로 처리되며, 개별
        이용자를 추적하는 데 사용되지 않습니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">3. 정보의 이용 목적</h2>
      <p className="mb-4">
        수집된 익명 데이터는 서비스 안정성 유지, 이용 현황 파악, 기능 개선의
        목적으로만 이용됩니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">4. 제3자 제공 및 처리위탁</h2>
      <p className="mb-4">
        서비스는 이용자의 개인정보를 제3자에게 판매하거나 제공하지 않습니다.
        다만 서비스 운영을 위해 다음의 인프라 제공업체를 이용합니다.
      </p>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>Vercel Inc. — 웹 호스팅 및 익명 이용 통계</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">5. 권한</h2>
      <p className="mb-4">
        Android 앱은 웹 콘텐츠 표시를 위한 인터넷 연결 외에 카메라, 위치, 연락처
        등 기기의 민감한 권한을 요청하지 않습니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">6. 아동의 개인정보</h2>
      <p className="mb-4">
        서비스는 만 14세 미만 아동을 주요 대상으로 하지 않으며, 아동의
        개인정보를 고의로 수집하지 않습니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">7. 면책 고지</h2>
      <p className="mb-4">
        서비스가 제공하는 로또 당첨번호 및 통계 정보는 참고용이며, 공식 결과는
        동행복권(dhlottery.co.kr)을 통해 확인하시기 바랍니다. 서비스는 어떠한
        형태의 복권 구매나 사행 행위도 제공하지 않습니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">8. 방침 변경</h2>
      <p className="mb-4">
        본 개인정보처리방침은 법령이나 서비스 변경에 따라 수정될 수 있으며,
        변경 시 본 페이지를 통해 고지합니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">9. 문의처</h2>
      <p className="mb-4">
        개인정보 관련 문의는 아래 이메일로 연락해 주시기 바랍니다.
        <br />
        이메일:{" "}
        <a className="text-blue-600 dark:text-blue-400" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </p>
    </article>
  );
}
