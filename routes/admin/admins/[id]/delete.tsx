import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../../../utils.ts";
import {
  countAdmins,
  deleteAdmin,
  deleteSessionsForAdmin,
  listAdmins,
} from "../../../../lib/auth.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const admins = await listAdmins();
    const target = admins.find((a) => a.id === ctx.params.id);
    if (!target) {
      return new Response("Không tìm thấy tài khoản", { status: 404 });
    }
    if (target.id === ctx.state.admin?.id) {
      return ctx.redirect("/admin/admins");
    }
    return page({ target });
  },
  async POST(ctx) {
    if (ctx.params.id === ctx.state.admin?.id) {
      return ctx.redirect("/admin/admins");
    }
    const total = await countAdmins();
    if (total <= 1) {
      return new Response(
        "Không thể xóa tài khoản quản trị cuối cùng.",
        { status: 400 },
      );
    }
    await deleteAdmin(ctx.params.id);
    await deleteSessionsForAdmin(ctx.params.id);
    return ctx.redirect("/admin/admins");
  },
});

export default define.page<typeof handler>(function DeleteAdminPage(
  { data },
) {
  const { target } = data;

  return (
    <div class="max-w-lg mx-auto px-4 py-16 text-center">
      <Head>
        <title>Xóa tài khoản {target.username} - GreenGear Admin</title>
      </Head>
      <h1 class="text-xl font-bold text-brand-950">
        Xóa tài khoản "{target.username}"?
      </h1>
      <p class="mt-2 text-sm text-gray-500">
        Tài khoản này sẽ không thể đăng nhập vào trang quản trị nữa.
      </p>
      <div class="mt-8 flex items-center justify-center gap-3">
        <a
          href="/admin/admins"
          class="rounded-full px-6 py-2.5 border border-brand-200 text-brand-700 font-semibold hover:bg-brand-50"
        >
          Hủy
        </a>
        <form method="POST">
          <button
            type="submit"
            class="rounded-full px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Xác nhận xóa
          </button>
        </form>
      </div>
    </div>
  );
});
