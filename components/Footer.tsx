export function Footer() {
  return (
    <footer class="bg-brand-950 text-brand-100/80 mt-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <a href="/" class="flex items-center gap-2">
            <span class="h-9 w-9 rounded-xl bg-linear-to-br from-brand-400 to-brand-600 flex items-center justify-center text-lg font-black text-brand-950">
              G
            </span>
            <span class="text-lg font-extrabold text-white tracking-tight">
              Green<span class="text-brand-400">Gear</span>
            </span>
          </a>
          <p class="mt-4 text-sm leading-relaxed">
            Chuyên bàn phím cơ, gaming gear và mô hình trang trí chính hãng —
            nâng tầm góc làm việc và trải nghiệm chơi game của bạn.
          </p>
          <div class="flex items-center gap-3 mt-5">
            {["facebook", "instagram", "youtube"].map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                class="h-9 w-9 rounded-full bg-white/5 hover:bg-brand-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <span class="text-xs uppercase">{s[0]}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Danh mục</h4>
          <ul class="space-y-2.5 text-sm">
            <li>
              <a href="/products?category=keyboard" class="hover:text-white">
                Bàn phím cơ
              </a>
            </li>
            <li>
              <a href="/products?category=gear" class="hover:text-white">
                Gaming Gear
              </a>
            </li>
            <li>
              <a href="/products?category=decor" class="hover:text-white">
                Mô hình trang trí
              </a>
            </li>
            <li>
              <a href="/products" class="hover:text-white">
                Tất cả sản phẩm
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Về GreenGear</h4>
          <ul class="space-y-2.5 text-sm">
            <li>
              <a href="/about" class="hover:text-white">Giới thiệu</a>
            </li>
            <li>
              <a href="/contact" class="hover:text-white">Liên hệ</a>
            </li>
            <li>
              <a href="/cart" class="hover:text-white">Giỏ hàng</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Liên hệ</h4>
          <ul class="space-y-2.5 text-sm">
            <li>123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</li>
            <li>
              <a href="tel:19001234" class="hover:text-white">1900 1234</a>
            </li>
            <li>
              <a href="mailto:hello@greengear.vn" class="hover:text-white">
                hello@greengear.vn
              </a>
            </li>
            <li>8:30 - 21:30, tất cả các ngày</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-5 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()} GreenGear Store. All rights reserved.
          </p>
          <p>Xây dựng với Deno Fresh 💚</p>
        </div>
      </div>
    </footer>
  );
}
