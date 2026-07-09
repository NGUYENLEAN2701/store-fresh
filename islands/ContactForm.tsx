import { useState } from "preact/hooks";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div class="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
        <p class="text-4xl mb-3">✅</p>
        <h3 class="font-bold text-brand-950 text-lg">Đã gửi thành công!</h3>
        <p class="mt-2 text-gray-500 text-sm">
          Cảm ơn {form.name || "bạn"}{" "}
          đã liên hệ, GreenGear sẽ phản hồi trong vòng 24 giờ.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium text-gray-600">Họ tên</label>
          <input
            required
            value={form.name}
            onInput={(e) =>
              update("name", (e.target as HTMLInputElement).value)}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onInput={(e) =>
              update("email", (e.target as HTMLInputElement).value)}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
            placeholder="ban@email.com"
          />
        </div>
      </div>
      <div>
        <label class="text-sm font-medium text-gray-600">Nội dung</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onInput={(e) =>
            update("message", (e.target as HTMLTextAreaElement).value)}
          class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
          placeholder="Bạn cần hỗ trợ gì?"
        />
      </div>
      <button
        type="submit"
        class="w-full sm:w-auto rounded-full px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors"
      >
        Gửi liên hệ
      </button>
    </form>
  );
}
