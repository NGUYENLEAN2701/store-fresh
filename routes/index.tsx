import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { categories, products } from "../data/products.ts";
import { CategoryCard } from "../components/CategoryCard.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import NewsletterForm from "../islands/NewsletterForm.tsx";

const FEATURES = [
  {
    icon: "✅",
    title: "100% Chính hãng",
    desc: "Cam kết hàng chính hãng, đầy đủ tem, phiếu bảo hành.",
  },
  {
    icon: "🚚",
    title: "Giao hàng nhanh",
    desc: "Giao trong 2h nội thành, toàn quốc 1-3 ngày làm việc.",
  },
  {
    icon: "🛡️",
    title: "Bảo hành tận tâm",
    desc: "Bảo hành đến 24 tháng, đổi trả miễn phí trong 7 ngày.",
  },
  {
    icon: "💬",
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ tư vấn nhiệt tình, sẵn sàng hỗ trợ mọi lúc.",
  },
];

const TESTIMONIALS = [
  {
    name: "Minh Khang",
    role: "Game thủ Valorant",
    quote:
      "Chuột G Pro X Superlight nhẹ và mượt hơn hẳn mình nghĩ, đặt hàng buổi sáng chiều đã nhận được rồi.",
  },
  {
    name: "Thu Hà",
    role: "Dân văn phòng",
    quote:
      "Bàn phím AKKO Zenith 75 gõ êm, màu xanh rất hợp bàn làm việc, đóng gói cẩn thận.",
  },
  {
    name: "Anh Tuấn",
    role: "Người sưu tầm mô hình",
    quote:
      "Mô hình Gundam chi tiết đẹp, đúng như hình, shop tư vấn nhiệt tình lúc chọn hàng.",
  },
];

export default define.page(function Home() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);

  return (
    <div>
      <Head>
        <title>
          GreenGear Store - Bàn phím cơ, Gaming Gear, Mô hình trang trí
        </title>
      </Head>

      {/* Hero */}
      <section class="hero-gradient relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span class="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-sm text-brand-200">
              🟢 Gear cho Gamer &amp; Dân văn phòng
            </span>
            <h1 class="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1]">
              Nâng tầm góc chơi<br />với{" "}
              <span class="text-gradient-brand">GreenGear</span>
            </h1>
            <p class="mt-6 text-lg text-brand-100/80 max-w-lg">
              Bàn phím cơ, gaming gear và mô hình trang trí chính hãng — chọn
              lọc kỹ càng để mỗi phút gõ, mỗi trận đấu đều trọn vẹn cảm xúc.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <a
                href="/products"
                class="rounded-full px-7 py-3.5 bg-brand-400 hover:bg-brand-300 text-brand-950 font-semibold transition-colors"
              >
                Khám phá sản phẩm
              </a>
              <a
                href="/about"
                class="rounded-full px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold transition-colors"
              >
                Về GreenGear
              </a>
            </div>
            <div class="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-brand-100/70">
              <span>⭐ 4.8/5 từ 1.200+ đánh giá</span>
              <span>📦 500+ đơn hàng mỗi tháng</span>
              <span>🔒 Bảo hành chính hãng</span>
            </div>
          </div>

          <div class="relative h-80 sm:h-96 hidden lg:block">
            <div class="animate-float absolute top-2 left-8 h-32 w-32 rounded-3xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center text-6xl shadow-2xl">
              ⌨️
            </div>
            <div
              class="animate-float absolute top-24 right-4 h-28 w-28 rounded-3xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center text-5xl shadow-2xl"
              style="animation-delay: 1.2s"
            >
              🖱️
            </div>
            <div
              class="animate-float absolute bottom-4 left-24 h-28 w-28 rounded-3xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center text-5xl shadow-2xl"
              style="animation-delay: 0.6s"
            >
              🎧
            </div>
            <div
              class="animate-float absolute bottom-16 right-16 h-24 w-24 rounded-3xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center text-4xl shadow-2xl"
              style="animation-delay: 1.8s"
            >
              🤖
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div class="flex items-end justify-between gap-4 mb-10">
          <div>
            <p class="text-brand-600 font-semibold text-sm uppercase tracking-wide">
              Danh mục
            </p>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-950 mt-2">
              Khám phá theo nhu cầu
            </h2>
          </div>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => <CategoryCard key={c.id} category={c} />)}
        </div>
      </section>

      {/* Featured products */}
      <section class="section-blob py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="flex items-end justify-between gap-4 mb-10">
            <div>
              <p class="text-brand-600 font-semibold text-sm uppercase tracking-wide">
                Nổi bật
              </p>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-950 mt-2">
                Sản phẩm được yêu thích
              </h2>
            </div>
            <a
              href="/products"
              class="hidden sm:inline-flex items-center gap-1 text-brand-700 font-semibold hover:text-brand-800"
            >
              Xem tất cả →
            </a>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div class="mt-10 text-center sm:hidden">
            <a
              href="/products"
              class="inline-flex items-center gap-1 text-brand-700 font-semibold"
            >
              Xem tất cả sản phẩm →
            </a>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div class="text-center max-w-xl mx-auto mb-12">
          <p class="text-brand-600 font-semibold text-sm uppercase tracking-wide">
            Vì sao chọn GreenGear
          </p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-950 mt-2">
            Trải nghiệm mua sắm an tâm
          </h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              class="rounded-2xl border border-brand-100 bg-white p-6 text-center card-hover"
            >
              <div class="mx-auto h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center text-3xl">
                {f.icon}
              </div>
              <h3 class="mt-4 font-bold text-brand-950">{f.title}</h3>
              <p class="mt-2 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div class="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 to-brand-800 px-8 py-14 sm:px-16 text-center">
          <div class="absolute -left-10 -top-10 text-[160px] opacity-10 select-none">
            🎮
          </div>
          <div class="absolute -right-10 -bottom-10 text-[160px] opacity-10 select-none">
            ⌨️
          </div>
          <div class="relative z-10">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white">
              Ưu đãi đến 20% cho đơn hàng đầu tiên
            </h2>
            <p class="mt-3 text-brand-100/80 max-w-lg mx-auto">
              Nhập mã{" "}
              <span class="font-mono font-bold text-brand-200">
                GREEN20
              </span>{" "}
              khi thanh toán để nhận ưu đãi ngay hôm nay.
            </p>
            <a
              href="/products"
              class="inline-block mt-7 rounded-full px-8 py-3.5 bg-white hover:bg-brand-50 text-brand-800 font-semibold transition-colors"
            >
              Mua sắm ngay
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section class="section-blob py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="text-center max-w-xl mx-auto mb-12">
            <p class="text-brand-600 font-semibold text-sm uppercase tracking-wide">
              Khách hàng nói gì
            </p>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-950 mt-2">
              Được tin tưởng bởi cộng đồng
            </h2>
          </div>
          <div class="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                class="rounded-2xl bg-white border border-brand-100 p-6"
              >
                <p class="text-amber-400 text-sm mb-3">★★★★★</p>
                <p class="text-gray-600 leading-relaxed">"{t.quote}"</p>
                <p class="mt-4 font-semibold text-brand-950">{t.name}</p>
                <p class="text-xs text-gray-400">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="text-center lg:text-left">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">
              Đừng bỏ lỡ ưu đãi mới nhất
            </h2>
            <p class="mt-2 text-brand-100/70">
              Đăng ký để nhận thông tin sản phẩm mới và mã giảm giá độc quyền.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
});
