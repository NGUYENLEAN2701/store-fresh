import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../utils.ts";
import {
  createSession,
  SESSION_COOKIE,
  SESSION_DAYS,
  verifyLogin,
} from "../../lib/auth.ts";
import { buildCookie } from "../../lib/cookies.ts";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  clientIp,
  recordLoginFailure,
} from "../../lib/rate-limit.ts";

/** Minimum wall time for login responses to reduce timing side-channels. */
const MIN_LOGIN_MS = 400;

async function padTiming(startedAt: number): Promise<void> {
  const elapsed = Date.now() - startedAt;
  if (elapsed < MIN_LOGIN_MS) {
    await new Promise((r) => setTimeout(r, MIN_LOGIN_MS - elapsed));
  }
}

export const handler = define.handlers({
  GET() {
    return page({ error: undefined });
  },
  async POST(ctx) {
    const startedAt = Date.now();
    const form = await ctx.req.formData();
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const ip = clientIp(ctx.req);

    if (!username || !password) {
      await padTiming(startedAt);
      return page(
        { error: "Sai tên đăng nhập hoặc mật khẩu." },
        { status: 401 },
      );
    }

    const limit = await checkLoginRateLimit(ip, username);
    if (!limit.ok) {
      await padTiming(startedAt);
      return page(
        {
          error:
            `Quá nhiều lần đăng nhập thất bại. Thử lại sau ${limit.retryAfterSeconds} giây.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        },
      );
    }

    const admin = await verifyLogin(username, password);

    if (!admin) {
      await recordLoginFailure(ip, username);
      await padTiming(startedAt);
      return page(
        { error: "Sai tên đăng nhập hoặc mật khẩu." },
        { status: 401 },
      );
    }

    await clearLoginFailures(ip, username);
    const token = await createSession(admin);
    const next = ctx.url.searchParams.get("next");
    const target = next && next.startsWith("/admin") ? next : "/admin";
    await padTiming(startedAt);
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

        {data.error && (
          <div class="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
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
              autofocus
              autocomplete="username"
              class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">Mật khẩu</label>
            <input
              type="password"
              name="password"
              required
              autocomplete="current-password"
              class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <button
            type="submit"
            class="w-full rounded-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
});
