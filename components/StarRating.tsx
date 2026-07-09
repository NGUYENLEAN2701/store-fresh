export function StarRating(
  { rating, reviews }: { rating: number; reviews?: number },
) {
  const full = Math.round(rating);
  return (
    <div class="flex items-center gap-1 text-sm">
      <span class="text-amber-400 tracking-tight" aria-hidden="true">
        {"★".repeat(full)}
        <span class="text-gray-300">{"★".repeat(5 - full)}</span>
      </span>
      <span class="text-gray-500 text-xs">
        {rating.toFixed(1)}
        {reviews !== undefined && ` (${reviews})`}
      </span>
    </div>
  );
}
