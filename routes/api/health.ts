import { define } from "../../utils.ts";
import { pingDb } from "../../lib/db.ts";
import { getSessionAdmin, SESSION_COOKIE } from "../../lib/auth.ts";
import { getCookie } from "../../lib/cookies.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const token = getCookie(ctx.req, SESSION_COOKIE);
    const admin = await getSessionAdmin(token);

    // Public: minimal status only — no deploy/timeline/error details.
    if (!admin) {
      const kv = await pingDb();
      return Response.json(
        { ok: kv.ok },
        { status: kv.ok ? 200 : 503 },
      );
    }

    const kv = await pingDb();
    return Response.json(
      {
        ok: kv.ok,
        deploy: Boolean(Deno.env.get("DENO_DEPLOY")),
        timeline: Deno.env.get("DENO_TIMELINE") ?? null,
        kv,
      },
      { status: kv.ok ? 200 : 503 },
    );
  },
});
