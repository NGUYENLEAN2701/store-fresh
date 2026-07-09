/**
 * Reset password for an existing KV admin (by username).
 *
 *   deno run -A --unstable-kv scripts/reset-admin-password.ts <username> <newPassword>
 */
import { getKv } from "../lib/kv.ts";
import { hashPassword } from "../lib/auth.ts";

const [username, newPassword] = Deno.args;
if (!username || !newPassword) {
  console.error(
    "Cách dùng: deno task reset-admin <username> <newPassword>",
  );
  Deno.exit(1);
}
if (newPassword.length < 6) {
  console.error("Mật khẩu phải từ 6 ký tự.");
  Deno.exit(1);
}

const kv = await getKv();
const idRes = await kv.get<string>(["admins_by_username", username]);
if (!idRes.value) {
  console.error(`Không tìm thấy admin "${username}" trên KV hiện tại.`);
  Deno.exit(1);
}

const key: Deno.KvKey = ["admins", idRes.value];
const existing = await kv.get<{
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}>(key);

if (!existing.value) {
  console.error(`Admin "${username}" bị thiếu document.`);
  Deno.exit(1);
}

const passwordHash = await hashPassword(newPassword);
const result = await kv.atomic()
  .check(existing)
  .set(key, { ...existing.value, passwordHash })
  .commit();

if (!result.ok) {
  console.error("Reset thất bại, thử lại.");
  Deno.exit(1);
}

console.log(`Đã đặt lại mật khẩu cho "${username}".`);
Deno.exit(0);
