import { define } from "../../utils.ts";
import type { LayoutConfig } from "fresh";

export const config: LayoutConfig = { skipInheritedLayouts: true };

export default define.layout(function AdminLayout({ Component, state }) {
  return (
    <div class="min-h-screen bg-brand-50/40">
      <header class="bg-brand-950 text-white">
        <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <a href="/admin" class="font-extrabold tracking-tight shrink-0">
            Green<span class="text-brand-400">Gear</span>{" "}
            <span class="text-brand-100/60 font-medium">Admin</span>
          </a>
          <nav class="flex items-center gap-4 text-sm">
            {state.admin && (
              <>
                <a href="/admin" class="text-white/80 hover:text-white">
                  Sản phẩm
                </a>
                <a href="/admin/new" class="text-white/80 hover:text-white">
                  Thêm sản phẩm
                </a>
                <a
                  href="/admin/admins"
                  class="text-white/80 hover:text-white"
                >
                  Tài khoản
                </a>
                <a
                  href="/admin/change-password"
                  class="text-white/80 hover:text-white"
                >
                  Đổi mật khẩu
                </a>
              </>
            )}
            <a
              href="/"
              class="text-brand-300 hover:text-brand-200"
              target="_blank"
            >
              Xem trang web ↗
            </a>
            {state.admin && (
              <div class="flex items-center gap-3 pl-4 border-l border-white/10">
                <span class="text-white/60">{state.admin.username}</span>
                <form method="POST" action="/admin/logout">
                  <button
                    type="submit"
                    class="text-white/80 hover:text-white"
                  >
                    Đăng xuất
                  </button>
                </form>
              </div>
            )}
          </nav>
        </div>
      </header>
      <Component />
    </div>
  );
});
