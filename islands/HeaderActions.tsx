import { useState } from "preact/hooks";
import { cartCount } from "../lib/cart.ts";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/products?category=keyboard", label: "Bàn phím cơ" },
  { href: "/products?category=gear", label: "Gaming Gear" },
  { href: "/products?category=decor", label: "Mô hình trang trí" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/contact", label: "Liên hệ" },
];

export default function HeaderActions() {
  const [open, setOpen] = useState(false);

  return (
    <div class="flex items-center gap-2">
      <a
        href="/cart"
        aria-label="Giỏ hàng"
        class="relative h-10 w-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2.5 3a1 1 0 000 2h.7l1.68 8.39A2 2 0 006.83 15H15a1 1 0 100-2H6.83l-.2-1H15.5a2 2 0 001.94-1.515l1.05-4.2A1 1 0 0017.53 5H5.11l-.25-1.24A1 1 0 003.88 3H2.5z" />
        </svg>
        {cartCount.value > 0 && (
          <span class="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-brand-400 text-brand-950 text-[11px] font-bold flex items-center justify-center">
            {cartCount.value}
          </span>
        )}
      </a>
      <button
        type="button"
        aria-label="Mở menu"
        onClick={() => setOpen(!open)}
        class="md:hidden h-10 w-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
      >
        {open
          ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          )
          : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          )}
      </button>

      {open && (
        <div class="md:hidden fixed inset-x-0 top-16 z-40 glass-nav border-t border-white/10 shadow-xl">
          <nav class="flex flex-col p-4 gap-1">
            {NAV_LINKS.map((link) => (
              <a
                href={link.href}
                key={link.href}
                onClick={() => setOpen(false)}
                class="px-3 py-2.5 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
