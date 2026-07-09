import { createAdmin } from "../lib/auth.ts";

const [username, password] = Deno.args;

if (!username || !password) {
  console.error(
    "Cách dùng: deno run -A scripts/create-admin.ts <username> <password>",
  );
  Deno.exit(1);
}

await createAdmin(username, password);
console.log(`Đã tạo tài khoản admin "${username}".`);
Deno.exit(0);
