import { define } from "../../utils.ts";
import { getSessionAdmin, SESSION_COOKIE } from "../../lib/auth.ts";
import { getCookie } from "../../lib/cookies.ts";

const PUBLIC_PATHS = new Set(["/admin/login"]);

export default define.middleware(async (ctx) => {
  if (PUBLIC_PATHS.has(ctx.url.pathname)) {
    return ctx.next();
  }

  const token = getCookie(ctx.req, SESSION_COOKIE);
  const admin = await getSessionAdmin(token);

  if (!admin) {
    return ctx.redirect(
      `/admin/login?next=${encodeURIComponent(ctx.url.pathname)}`,
    );
  }

  ctx.state.admin = admin;
  return ctx.next();
});
