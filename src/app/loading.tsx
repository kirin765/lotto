export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      <p className="text-sm text-gray-400 dark:text-gray-500">
        당첨번호를 불러오는 중...
      </p>
    </div>
  );
}
