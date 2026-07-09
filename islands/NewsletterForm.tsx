import { useState } from "preact/hooks";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  }

  if (sent) {
    return (
      <p class="text-brand-300 font-medium">
        Cảm ơn bạn đã đăng ký! Ưu đãi sẽ sớm đến hộp thư của bạn 💌
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      class="flex flex-col sm:flex-row gap-3 w-full max-w-md"
    >
      <input
        type="email"
        required
        value={email}
        onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
        placeholder="Nhập email của bạn"
        class="flex-1 rounded-full px-5 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
      <button
        type="submit"
        class="rounded-full px-6 py-3 bg-brand-400 hover:bg-brand-300 text-brand-950 font-semibold transition-colors"
      >
        Đăng ký
      </button>
    </form>
  );
}
