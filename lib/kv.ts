let kvPromise: Promise<Deno.Kv> | null = null;

/**
 * Shared Deno KV handle — one open per isolate.
 * Local / Deploy: `Deno.openKv()` (Deploy uses the assigned database).
 * Optional remote seed: set `DENO_KV_URL` + `DENO_KV_ACCESS_TOKEN`.
 */
export function getKv(): Promise<Deno.Kv> {
  if (!kvPromise) {
    const url = Deno.env.get("DENO_KV_URL");
    kvPromise = url ? Deno.openKv(url) : Deno.openKv();
  }
  return kvPromise;
}
