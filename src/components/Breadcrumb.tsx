import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLdItems = items.map((item, i) => ({
    name: item.label,
    url: item.href
      ? `${SITE_URL}${item.href}`
      : i === items.length - 1
        ? undefined
        : SITE_URL,
  })).filter((item): item is { name: string; url: string } => item.url !== undefined);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(jsonLdItems)),
        }}
      />
      <nav aria-label="경로" className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        <ol className="flex items-center gap-1 flex-wrap">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
