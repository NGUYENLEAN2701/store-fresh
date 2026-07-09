import { pingDb } from "../../lib/db.ts";

export const handler = {
  async GET() {
    const kv = await pingDb();

    const body = {
      ok: kv.ok,
      deploy: Boolean(Deno.env.get("DENO_DEPLOY")),
      timeline: Deno.env.get("DENO_TIMELINE") ?? null,
      kv,
    };

    return Response.json(body, { status: kv.ok ? 200 : 503 });
  },
};
