import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../utils.ts";
import { changePassword, verifyLogin } from "../../lib/auth.ts";

export const handler = define.handlers({
  GET() {
    return page({ error: undefined, success: false });
  },
  async POST(ctx) {
    const admin = ctx.state.admin!;
    const form = await ctx.req.formData();
    const current = String(form.get("current") ?? "");
    const next = String(form.get("next") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    const ok = await verifyLogin(admin.username, current);
    if (!ok) {
      return page({ error: "Mật khẩu hiện tại không đúng.", success: false });
    }
    if (next.length < 6) {
      return page({
        error: "Mật khẩu mới phải có ít nhất 6 ký tự.",
        success: false,
      });
    }
    if (next !== confirm) {
      return page({
        error: "Xác nhận mật khẩu mới không khớp.",
        success: false,
      });
    }

    await changePassword(admin.id, next);
    return page({ error: undefined, success: true });
  },
});

export default define.page<typeof handler>(function ChangePasswordPage(
  { data },
) {
  return (
    <div class="max-w-md mx-auto px-4 py-10">
      <Head>
        <title>Đổi mật khẩu - GreenGear Admin</title>
      </Head>
      <h1 class="text-2xl font-bold text-brand-950 mb-6">Đổi mật khẩu</h1>

      {data.success && (
        <div class="mb-5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 px-4 py-3 text-sm">
          Đã cập nhật mật khẩu thành công.
        </div>
      )}
      {data.error && (
        <div class="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {data.error}
        </div>
      )}

      <form method="POST" class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-600">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            name="current"
            required
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">
            Mật khẩu mới
          </label>
          <input
            type="password"
            name="next"
            required
            minLength={6}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            name="confirm"
            required
            minLength={6}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <button
          type="submit"
          class="rounded-full px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
        >
          Cập nhật mật khẩu
        </button>
      </form>
    </div>
  );
});
