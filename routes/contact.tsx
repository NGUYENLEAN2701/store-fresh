import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import ContactForm from "../islands/ContactForm.tsx";

export default define.page(function Contact() {
  return (
    <div>
      <Head>
        <title>Liên hệ - GreenGear Store</title>
      </Head>

      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white">
            Liên hệ với chúng tôi
          </h1>
          <p class="mt-3 text-brand-100/75 max-w-xl mx-auto">
            Có câu hỏi về sản phẩm hay đơn hàng? Đội ngũ GreenGear luôn sẵn sàng
            hỗ trợ bạn.
          </p>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-5 gap-10">
        <div class="lg:col-span-2 space-y-6">
          {[
            {
              icon: "📍",
              title: "Địa chỉ cửa hàng",
              desc: "123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
            },
            {
              icon: "📞",
              title: "Hotline",
              desc: "1900 1234 (8:30 - 21:30 tất cả các ngày)",
            },
            {
              icon: "✉️",
              title: "Email",
              desc: "hello@greengear.vn",
            },
            {
              icon: "🕐",
              title: "Giờ làm việc",
              desc: "Thứ 2 - Chủ nhật: 8:30 - 21:30",
            },
          ].map((item) => (
            <div key={item.title} class="flex gap-4">
              <div class="h-12 w-12 shrink-0 rounded-xl bg-brand-50 flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div>
                <h3 class="font-semibold text-brand-950">{item.title}</h3>
                <p class="text-sm text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}

          <div class="rounded-2xl overflow-hidden border border-brand-100 h-56">
            <iframe
              title="Bản đồ GreenGear Store"
              class="w-full h-full"
              loading="lazy"
              src="https://www.google.com/maps?q=123+Nguy%E1%BB%85n+V%C4%83n+C%E1%BB%AB,+Qu%E1%BA%ADn+5,+TP.+H%E1%BB%93+Ch%C3%AD+Minh&output=embed"
            />
          </div>
        </div>

        <div class="lg:col-span-3 rounded-2xl border border-brand-100 p-6 sm:p-8">
          <h2 class="text-xl font-bold text-brand-950 mb-1">Gửi tin nhắn</h2>
          <p class="text-sm text-gray-500 mb-6">
            Điền thông tin bên dưới, GreenGear sẽ phản hồi trong thời gian sớm
            nhất.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
});
