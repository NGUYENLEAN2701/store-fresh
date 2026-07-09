let loaded = false;

/** Loads key=value pairs from a `.env` file at the project root into `Deno.env`, if not already set. */
export function loadDotEnv() {
  if (loaded) return;
  loaded = true;
  try {
    const text = Deno.readTextFileSync(new URL("../.env", import.meta.url));
    for (const rawLine of text.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!Deno.env.has(key)) Deno.env.set(key, value);
    }
  } catch {
    // No .env file next to the project — rely on real environment variables.
  }
}
