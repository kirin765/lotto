import { getBallColor } from "@/lib/constants";

interface LottoBallsProps {
  numbers: number[];
  bonusNo?: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

function Ball({ number, size = "md" }: { number: number; size?: "sm" | "md" | "lg" }) {
  const color = getBallColor(number);
  return (
    <span
      className={`${color.bg} ${color.text} ${sizeMap[size]} inline-flex items-center justify-center rounded-full font-bold shadow-md`}
    >
      {number}
    </span>
  );
}

export default function LottoBalls({ numbers, bonusNo, size = "md" }: LottoBallsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      {numbers.map((num) => (
        <Ball key={num} number={num} size={size} />
      ))}
      {bonusNo !== undefined && (
        <>
          <span className="text-gray-400 font-bold mx-1">+</span>
          <Ball number={bonusNo} size={size} />
        </>
      )}
    </div>
  );
}
