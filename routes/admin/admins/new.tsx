import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../../utils.ts";
import { createAdmin } from "../../../lib/auth.ts";

export const handler = define.handlers({
  GET() {
    return page({ error: undefined });
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (!username) {
      return page({ error: "Vui lòng nhập tên đăng nhập." });
    }
    if (password.length < 6) {
      return page({ error: "Mật khẩu phải có ít nhất 6 ký tự." });
    }
    if (password !== confirm) {
      return page({ error: "Xác nhận mật khẩu không khớp." });
    }

    try {
      await createAdmin(username, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra.";
      return page({ error: message });
    }

    return ctx.redirect("/admin/admins");
  },
});

export default define.page<typeof handler>(function NewAdminPage({ data }) {
  return (
    <div class="max-w-md mx-auto px-4 py-10">
      <Head>
        <title>Thêm tài khoản quản trị - GreenGear Admin</title>
      </Head>
      <h1 class="text-2xl font-bold text-brand-950 mb-6">
        Thêm tài khoản quản trị
      </h1>

      {data.error && (
        <div class="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {data.error}
        </div>
      )}

      <form method="POST" class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-600">
            Tên đăng nhập
          </label>
          <input
            name="username"
            required
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">Mật khẩu</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            name="confirm"
            required
            minLength={6}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <div class="flex gap-3">
          <button
            type="submit"
            class="rounded-full px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
          >
            Tạo tài khoản
          </button>
          <a
            href="/admin/admins"
            class="rounded-full px-8 py-3 border border-brand-200 text-brand-700 font-semibold hover:bg-brand-50"
          >
            Hủy
          </a>
        </div>
      </form>
    </div>
  );
});
