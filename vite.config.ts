import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [fresh(), tailwindcss()],
  ssr: {
    // The mongodb driver's CJS dependency chain (via @mongodb-js/saslprep)
    // breaks under Vite's SSR module transform; load it natively instead.
    external: ["mongodb"],
  },
});
