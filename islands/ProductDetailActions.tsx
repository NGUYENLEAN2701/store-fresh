import { useState } from "preact/hooks";
import { addToCart } from "../lib/cart.ts";

interface ProductDetailActionsProps {
  slug: string;
  name: string;
  price: number;
  icon: string;
}

export default function ProductDetailActions(
  { slug, name, price, icon }: ProductDetailActionsProps,
) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart({ slug, name, price, icon }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addToCart({ slug, name, price, icon }, quantity);
    globalThis.location.href = "/cart";
  }

  return (
    <div>
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-gray-500">Số lượng</span>
        <div class="inline-flex items-center rounded-full border border-brand-200">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            class="h-9 w-9 flex items-center justify-center text-brand-700 hover:bg-brand-50 rounded-full"
            aria-label="Giảm số lượng"
          >
            −
          </button>
          <span class="w-8 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            class="h-9 w-9 flex items-center justify-center text-brand-700 hover:bg-brand-50 rounded-full"
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>
      </div>

      <div class="mt-5 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          class={`flex-1 rounded-full px-6 py-3.5 font-semibold border-2 border-brand-600 transition-colors ${
            added
              ? "bg-brand-600 text-white"
              : "text-brand-700 hover:bg-brand-50"
          }`}
        >
          {added ? "Đã thêm vào giỏ ✓" : "Thêm vào giỏ hàng"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          class="flex-1 rounded-full px-6 py-3.5 font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
}
