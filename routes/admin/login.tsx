import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../utils.ts";
import {
  countAdmins,
  createAdmin,
  createSession,
  SESSION_COOKIE,
  SESSION_DAYS,
  verifyLogin,
} from "../../lib/auth.ts";
import { buildCookie } from "../../lib/cookies.ts";
import { listProducts, seedProducts } from "../../lib/db.ts";
import { SEED_PRODUCTS } from "../../data/seed-products.ts";

async function ensureSeedIfEmpty() {
  const existing = await listProducts();
  if (existing.length > 0) return;
  const input = SEED_PRODUCTS.map(({ id: _id, featured, ...rest }) => ({
    ...rest,
    featured: featured ?? false,
  }));
  await seedProducts(input);
}

export const handler = define.handlers({
  async GET() {
    const needsSetup = (await countAdmins()) === 0;
    return page({ error: undefined, needsSetup, setupDone: false });
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const action = String(form.get("action") ?? "login");
    const needsSetup = (await countAdmins()) === 0;

    if (action === "setup") {
      if (!needsSetup) {
        return page({
          error: "Hệ thống đã có admin, vui lòng đăng nhập.",
          needsSetup: false,
          setupDone: false,
        }, { status: 400 });
      }
      if (!username || password.length < 6) {
        return page({
          error: "Username bắt buộc, mật khẩu từ 6 ký tự.",
          needsSetup: true,
          setupDone: false,
        }, { status: 400 });
      }
      try {
        await createAdmin(username, password);
        await ensureSeedIfEmpty();
      } catch (err) {
        return page({
          error: err instanceof Error ? err.message : String(err),
          needsSetup: true,
          setupDone: false,
        }, { status: 400 });
      }
      const admin = await verifyLogin(username, password);
      if (!admin) {
        return page({
          error: "Tạo admin xong nhưng đăng nhập thất bại.",
          needsSetup: false,
          setupDone: true,
        }, { status: 500 });
      }
      const token = await createSession(admin);
      const res = ctx.redirect("/admin");
      res.headers.append(
        "Set-Cookie",
        buildCookie(SESSION_COOKIE, token, {
          maxAgeSeconds: SESSION_DAYS * 24 * 60 * 60,
          secure: ctx.url.protocol === "https:",
        }),
      );
      return res;
    }

    const admin = username && password
      ? await verifyLogin(username, password)
      : null;

    if (!admin) {
      return page(
        {
          error: "Sai tên đăng nhập hoặc mật khẩu.",
          needsSetup: (await countAdmins()) === 0,
          setupDone: false,
        },
        { status: 401 },
      );
    }

    const token = await createSession(admin);
    const next = ctx.url.searchParams.get("next");
    const target = next && next.startsWith("/admin") ? next : "/admin";
    const res = ctx.redirect(target);
    res.headers.append(
      "Set-Cookie",
      buildCookie(SESSION_COOKIE, token, {
        maxAgeSeconds: SESSION_DAYS * 24 * 60 * 60,
        secure: ctx.url.protocol === "https:",
      }),
    );
    return res;
  },
});

export default define.page<typeof handler>(function LoginPage({ data }) {
  return (
    <div class="min-h-screen flex items-center justify-center bg-brand-950 px-4">
      <Head>
        <title>Đăng nhập quản trị - GreenGear</title>
      </Head>
      <div class="w-full max-w-sm bg-white rounded-2xl p-8">
        <div class="flex items-center gap-2 mb-6">
          <span class="h-9 w-9 rounded-xl bg-linear-to-br from-brand-400 to-brand-600 flex items-center justify-center text-lg font-black text-brand-950">
            G
          </span>
          <span class="text-lg font-extrabold text-brand-950 tracking-tight">
            Green<span class="text-brand-600">Gear</span>{" "}
            <span class="text-gray-400 font-medium">Admin</span>
          </span>
        </div>

        {data.needsSetup && (
          <div class="mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
            Chưa có tài khoản admin trên database này. Tạo tài khoản đầu tiên
            bên dưới.
          </div>
        )}

        {data.error && (
          <div class="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {data.error}
          </div>
        )}

        <form method="POST" class="space-y-4">
          <input
            type="hidden"
            name="action"
            value={data.needsSetup ? "setup" : "login"}
          />
          <div>
            <label class="text-sm font-medium text-gray-600">
              Tên đăng nhập
            </label>
            <input
              name="username"
              required
              autofocus
              class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">Mật khẩu</label>
            <input
              type="password"
              name="password"
              required
              minLength={data.needsSetup ? 6 : undefined}
              class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <button
            type="submit"
            class="w-full rounded-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
          >
            {data.needsSetup ? "Tạo admin & đăng nhập" : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
});
