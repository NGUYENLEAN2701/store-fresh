import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

const STATS = [
  { value: "5+", label: "Năm kinh nghiệm" },
  { value: "20,000+", label: "Khách hàng tin dùng" },
  { value: "150+", label: "Sản phẩm chính hãng" },
  { value: "4.8/5", label: "Đánh giá trung bình" },
];

const VALUES = [
  {
    icon: "🌱",
    title: "Chọn lọc kỹ càng",
    desc:
      "Mỗi sản phẩm đều được đội ngũ GreenGear trải nghiệm thực tế trước khi lên kệ.",
  },
  {
    icon: "🤝",
    title: "Minh bạch & tận tâm",
    desc:
      "Giá cả rõ ràng, tư vấn trung thực, đặt lợi ích khách hàng lên hàng đầu.",
  },
  {
    icon: "⚡",
    title: "Trải nghiệm hiện đại",
    desc: "Website tối ưu tốc độ, đặt hàng nhanh chóng, hỗ trợ đa kênh.",
  },
  {
    icon: "♻️",
    title: "Bền vững",
    desc: "Ưu tiên bao bì thân thiện môi trường, đồng hành cùng lối sống xanh.",
  },
];

export default define.page(function About() {
  return (
    <div>
      <Head>
        <title>Giới thiệu - GreenGear Store</title>
      </Head>

      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-sm text-brand-200">
            🟢 Câu chuyện GreenGear
          </span>
          <h1 class="mt-6 text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Nơi hội tụ đam mê{" "}
            <span class="text-gradient-brand">gõ phím &amp; chơi game</span>
          </h1>
          <p class="mt-5 text-brand-100/80 max-w-2xl mx-auto text-lg">
            GreenGear ra đời từ tình yêu với những chiếc bàn phím cơ, những món
            gear chất lượng và niềm đam mê sưu tầm mô hình — mang đến không gian
            mua sắm xanh mát, hiện đại cho cộng đồng.
          </p>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div class="rounded-2xl bg-white border border-brand-100 shadow-xl grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-100">
          {STATS.map((s) => (
            <div key={s.label} class="text-center py-8 px-4">
              <p class="text-2xl sm:text-3xl font-extrabold text-brand-700">
                {s.value}
              </p>
              <p class="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-brand-600 font-semibold text-sm uppercase tracking-wide">
            Hành trình
          </p>
          <h2 class="text-3xl font-extrabold text-brand-950 mt-2">
            Từ đam mê cá nhân đến cửa hàng được tin yêu
          </h2>
          <p class="mt-4 text-gray-600 leading-relaxed">
            Bắt đầu từ một nhóm bạn trẻ mê mẩn tiếng "thock" của bàn phím cơ và
            những trận đấu căng thẳng cùng gaming gear chất lượng, GreenGear dần
            lớn lên thành điểm đến quen thuộc của cộng đồng yêu công nghệ và sưu
            tầm mô hình tại Việt Nam.
          </p>
          <p class="mt-4 text-gray-600 leading-relaxed">
            Chúng tôi tin rằng một góc làm việc hay góc chơi game được đầu tư
            đúng cách sẽ truyền cảm hứng mỗi ngày — đó là lý do mọi sản phẩm tại
            GreenGear đều được chọn lọc kỹ lưỡng về chất lượng lẫn thẩm mỹ.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="animate-float rounded-3xl bg-brand-50 aspect-square flex items-center justify-center text-6xl">
            ⌨️
          </div>
          <div
            class="animate-float rounded-3xl bg-brand-800 aspect-square flex items-center justify-center text-6xl mt-8"
            style="animation-delay: .8s"
          >
            🎧
          </div>
          <div
            class="animate-float rounded-3xl bg-brand-800 aspect-square flex items-center justify-center text-6xl -mt-8"
            style="animation-delay: .4s"
          >
            🖱️
          </div>
          <div
            class="animate-float rounded-3xl bg-brand-50 aspect-square flex items-center justify-center text-6xl"
            style="animation-delay: 1.2s"
          >
            🤖
          </div>
        </div>
      </section>

      <section class="section-blob py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="text-center max-w-xl mx-auto mb-12">
            <p class="text-brand-600 font-semibold text-sm uppercase tracking-wide">
              Giá trị cốt lõi
            </p>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-950 mt-2">
              Điều làm nên GreenGear
            </h2>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                class="rounded-2xl border border-brand-100 bg-white p-6 card-hover"
              >
                <div class="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center text-3xl">
                  {v.icon}
                </div>
                <h3 class="mt-4 font-bold text-brand-950">{v.title}</h3>
                <p class="mt-2 text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div class="rounded-3xl bg-linear-to-br from-brand-600 to-brand-800 px-8 py-14 sm:px-16 text-center">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white">
            Sẵn sàng nâng cấp góc làm việc của bạn?
          </h2>
          <p class="mt-3 text-brand-100/80 max-w-lg mx-auto">
            Khám phá bộ sưu tập bàn phím cơ, gaming gear và mô hình trang trí
            đang chờ bạn tại GreenGear.
          </p>
          <a
            href="/products"
            class="inline-block mt-7 rounded-full px-8 py-3.5 bg-white hover:bg-brand-50 text-brand-800 font-semibold transition-colors"
          >
            Mua sắm ngay
          </a>
        </div>
      </section>
    </div>
  );
});
