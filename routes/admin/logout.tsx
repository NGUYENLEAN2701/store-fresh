import { define } from "../../utils.ts";
import { deleteSession, SESSION_COOKIE } from "../../lib/auth.ts";
import { buildExpiredCookie, getCookie } from "../../lib/cookies.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const token = getCookie(ctx.req, SESSION_COOKIE);
    await deleteSession(token);
    const res = ctx.redirect("/admin/login");
    res.headers.append(
      "Set-Cookie",
      buildExpiredCookie(SESSION_COOKIE, ctx.url.protocol === "https:"),
    );
    return res;
  },
});
