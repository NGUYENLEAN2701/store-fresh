const STYLES: Record<string, string> = {
  "Mới": "bg-sky-500 text-white",
  "Hot": "bg-orange-500 text-white",
  "Giảm giá": "bg-brand-600 text-white",
  "Bán chạy": "bg-violet-500 text-white",
};

export function ProductBadge({ label }: { label: string }) {
  const cls = STYLES[label] ?? "bg-brand-600 text-white";
  return (
    <span
      class={`${cls} text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm`}
    >
      {label}
    </span>
  );
}
