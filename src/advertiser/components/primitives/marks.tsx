/**
 * Payment brand marks, drawn rather than imported so they stay crisp at any
 * size and add no network requests. Decorative: each sits beside a text label
 * that already names the method.
 */
import kokoLogo from "figma:asset/09ac28c5614ff62377e494f60366a17f58f0e925.png";

export function VisaMark() {
  return (
    <span aria-hidden="true" className="text-[13px] font-black italic tracking-tight text-[#1A1F71]">
      VISA
    </span>
  );
}

export function MastercardMark() {
  return (
    <span aria-hidden="true" className="flex items-center">
      <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
      <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#F79E1B]/90" />
    </span>
  );
}

export function JustPayMark() {
  return (
    <span aria-hidden="true" className="text-[13px] font-black lowercase tracking-tight text-[#2b3ce0]">
      justpay
    </span>
  );
}

export function KokoMark({ className = "h-6 w-6" }: { className?: string }) {
  return <img src={kokoLogo} alt="" aria-hidden="true" className={`${className} object-contain`} />;
}

export function PaymentMark({ id }: { id: string }) {
  if (id === "credit") return <KokoMark />;
  if (id === "card")
    return (
      <span className="flex items-center gap-2">
        <VisaMark />
        <MastercardMark />
      </span>
    );
  return <JustPayMark />;
}
