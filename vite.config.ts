import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

// The mongodb driver's CJS dependency chain (via @mongodb-js/saslprep ->
// sparse-bitfield) gets double-wrapped by Rollup's CJS/ESM interop and
// crashes at runtime ("X.default is not a function"). Keep the whole
// dependency tree external so it's loaded natively by Deno instead of
// being bundled, both for `vite dev` (ssr.external) and `vite build`
// (build.rollupOptions.external).
const MONGO_DEPS = [
  "mongodb",
  "bson",
  "@mongodb-js/saslprep",
  "sparse-bitfield",
  "memory-pager",
  "mongodb-connection-string-url",
  "whatwg-url",
];

export default defineConfig({
  plugins: [fresh(), tailwindcss()],
  ssr: {
    external: MONGO_DEPS,
  },
  build: {
    rollupOptions: {
      external: (id: string) => MONGO_DEPS.some((dep) => id.includes(dep)),
    },
  },
});
