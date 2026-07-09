import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../../utils.ts";
import { listAdmins } from "../../../lib/auth.ts";

export const handler = define.handlers({
  async GET() {
    const admins = await listAdmins();
    return page({ admins });
  },
});

export default define.page<typeof handler>(function AdminAccountsPage(
  { data, state },
) {
  const { admins } = data;
  const currentId = state.admin?.id;

  return (
    <div class="max-w-3xl mx-auto px-4 py-10">
      <Head>
        <title>Tài khoản quản trị - GreenGear Admin</title>
      </Head>

      <div class="flex items-center justify-between mb-6 gap-4">
        <h1 class="text-2xl font-bold text-brand-950">Tài khoản quản trị</h1>
        <a
          href="/admin/admins/new"
          class="rounded-full px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold whitespace-nowrap"
        >
          + Thêm tài khoản
        </a>
      </div>

      <div class="rounded-2xl border border-brand-100 overflow-hidden bg-white">
        <table class="w-full text-sm">
          <thead class="bg-brand-50 text-left text-gray-500">
            <tr>
              <th class="px-4 py-3 font-medium">Tên đăng nhập</th>
              <th class="px-4 py-3 font-medium">Ngày tạo</th>
              <th class="px-4 py-3 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-100">
            {admins.map((a) => (
              <tr key={a.id}>
                <td class="px-4 py-3 font-medium text-brand-950">
                  {a.username}
                  {a.id === currentId && (
                    <span class="ml-2 text-xs text-brand-600">(bạn)</span>
                  )}
                </td>
                <td class="px-4 py-3 text-gray-500">
                  {new Date(a.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td class="px-4 py-3 text-right">
                  {a.id === currentId
                    ? <span class="text-gray-300">Xóa</span>
                    : (
                      <a
                        href={`/admin/admins/${a.id}/delete`}
                        class="text-red-500 hover:underline"
                      >
                        Xóa
                      </a>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
