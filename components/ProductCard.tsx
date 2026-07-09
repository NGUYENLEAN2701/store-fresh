import type { Product } from "../data/products.ts";
import { formatPrice } from "../data/products.ts";
import { ProductBadge } from "./Badge.tsx";
import { StarRating } from "./StarRating.tsx";
import QuickAddButton from "../islands/QuickAddButton.tsx";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div class="group relative flex flex-col rounded-2xl bg-white border border-brand-100 overflow-hidden card-hover">
      <a href={`/products/${product.slug}`} class="block relative">
        <div class="product-icon-tile aspect-square flex items-center justify-center text-6xl sm:text-7xl group-hover:scale-105 transition-transform duration-300">
          {product.icon}
        </div>
        {product.badge && (
          <span class="absolute top-3 left-3">
            <ProductBadge label={product.badge} />
          </span>
        )}
      </a>
      <div class="flex flex-col flex-1 p-4">
        <a
          href={`/products/${product.slug}`}
          class="font-semibold text-[15px] text-brand-950 hover:text-brand-700 line-clamp-1"
        >
          {product.name}
        </a>
        <div class="mt-1">
          <StarRating rating={product.rating} reviews={product.reviews} />
        </div>
        <div class="mt-3 flex items-end justify-between gap-2">
          <div>
            <p class="text-brand-700 font-bold leading-tight">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice && (
              <p class="text-xs line-through text-gray-400">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>
          <QuickAddButton
            slug={product.slug}
            name={product.name}
            price={product.price}
            icon={product.icon}
          />
        </div>
      </div>
    </div>
  );
}
