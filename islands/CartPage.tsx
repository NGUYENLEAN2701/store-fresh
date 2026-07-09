import { useState } from "preact/hooks";
import {
  cartLines,
  cartTotal,
  removeFromCart,
  setQuantity,
} from "../lib/cart.ts";
import { formatPrice } from "../data/products.ts";

export default function CartPage() {
  const [placed, setPlaced] = useState(false);
  const lines = cartLines.value;

  function handleCheckout() {
    cartLines.value = [];
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("greengear_cart");
    }
    setPlaced(true);
  }

  if (placed) {
    return (
      <div class="max-w-3xl mx-auto px-4 py-24 text-center">
        <p class="text-6xl mb-4">🎉</p>
        <h1 class="text-2xl font-bold text-brand-950">Đặt hàng thành công!</h1>
        <p class="mt-2 text-gray-500">
          Cảm ơn bạn đã tin tưởng GreenGear. Đội ngũ sẽ liên hệ xác nhận đơn
          hàng trong thời gian sớm nhất.
        </p>
        <a
          href="/products"
          class="inline-block mt-6 rounded-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
        >
          Tiếp tục mua sắm
        </a>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div class="max-w-3xl mx-auto px-4 py-24 text-center">
        <p class="text-6xl mb-4">🛒</p>
        <h1 class="text-2xl font-bold text-brand-950">Giỏ hàng trống</h1>
        <p class="mt-2 text-gray-500">
          Hãy khám phá các sản phẩm nổi bật của GreenGear.
        </p>
        <a
          href="/products"
          class="inline-block mt-6 rounded-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
        >
          Khám phá sản phẩm
        </a>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-10">
      <div class="lg:col-span-2">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-brand-950 mb-6">
          Giỏ hàng của bạn
        </h1>
        <div class="rounded-2xl border border-brand-100 divide-y divide-brand-100 overflow-hidden">
          {lines.map((line) => (
            <div
              key={line.slug}
              class="flex items-center gap-4 p-4 bg-white"
            >
              <a
                href={`/products/${line.slug}`}
                class="product-icon-tile h-20 w-20 shrink-0 rounded-xl flex items-center justify-center text-3xl"
              >
                {line.icon}
              </a>
              <div class="flex-1 min-w-0">
                <a
                  href={`/products/${line.slug}`}
                  class="font-semibold text-brand-950 hover:text-brand-700 line-clamp-1"
                >
                  {line.name}
                </a>
                <p class="text-brand-700 font-bold mt-1">
                  {formatPrice(line.price)}
                </p>
              </div>
              <div class="inline-flex items-center rounded-full border border-brand-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(line.slug, line.quantity - 1)}
                  class="h-8 w-8 flex items-center justify-center text-brand-700 hover:bg-brand-50 rounded-full"
                  aria-label="Giảm số lượng"
                >
                  −
                </button>
                <span class="w-7 text-center text-sm font-semibold">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(line.slug, line.quantity + 1)}
                  class="h-8 w-8 flex items-center justify-center text-brand-700 hover:bg-brand-50 rounded-full"
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(line.slug)}
                aria-label={`Xóa ${line.name}`}
                class="h-9 w-9 shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 2a1 1 0 00-1 1v1H4a1 1 0 000 2h12a1 1 0 100-2h-3V3a1 1 0 00-1-1H8zM6 7a1 1 0 012 0v8a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v8a1 1 0 102 0V7a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="rounded-2xl border border-brand-100 bg-brand-50/50 p-6 sticky top-24">
          <h2 class="font-bold text-brand-950 text-lg mb-4">
            Tóm tắt đơn hàng
          </h2>
          <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Tạm tính</span>
            <span>{formatPrice(cartTotal.value)}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span>Phí vận chuyển</span>
            <span class="text-brand-600 font-medium">Miễn phí</span>
          </div>
          <div class="flex items-center justify-between text-lg font-bold text-brand-950 pt-4 border-t border-brand-100">
            <span>Tổng cộng</span>
            <span>{formatPrice(cartTotal.value)}</span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            class="mt-6 w-full rounded-full px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors"
          >
            Tiến hành đặt hàng
          </button>
          <a
            href="/products"
            class="block mt-3 text-center text-sm text-brand-700 hover:text-brand-800 font-medium"
          >
            ← Tiếp tục mua sắm
          </a>
        </div>
      </div>
    </div>
  );
}
