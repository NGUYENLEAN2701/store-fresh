import HeaderActions from "../islands/HeaderActions.tsx";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/contact", label: "Liên hệ" },
];

export function Header() {
  return (
    <header class="sticky top-0 z-50 glass-nav border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a href="/" class="flex items-center gap-2 shrink-0">
          <span class="h-9 w-9 rounded-xl bg-linear-to-br from-brand-400 to-brand-600 flex items-center justify-center text-lg font-black text-brand-950">
            G
          </span>
          <span class="text-lg font-extrabold text-white tracking-tight">
            Green<span class="text-brand-400">Gear</span>
          </span>
        </a>

        <nav class="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              href={link.href}
              key={link.href}
              class="px-3.5 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div class="relative group">
            <button
              type="button"
              class="px-3.5 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors inline-flex items-center gap-1"
            >
              Danh mục
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div class="absolute left-0 top-full pt-2 hidden group-hover:block">
              <div class="w-56 rounded-xl bg-brand-950 border border-white/10 shadow-2xl p-2">
                <a
                  href="/products?category=keyboard"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/85 hover:bg-white/10"
                >
                  ⌨️ Bàn phím cơ
                </a>
                <a
                  href="/products?category=gear"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/85 hover:bg-white/10"
                >
                  🎮 Gaming Gear
                </a>
                <a
                  href="/products?category=decor"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/85 hover:bg-white/10"
                >
                  🗿 Mô hình trang trí
                </a>
              </div>
            </div>
          </div>
        </nav>

        <HeaderActions />
      </div>
    </header>
  );
}
