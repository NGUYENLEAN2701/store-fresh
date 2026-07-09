import { getKv } from "./kv.ts";

export const SESSION_COOKIE = "admin_session";
export const SESSION_DAYS = 7;
const SESSION_EXPIRE_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

interface AdminDoc {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

interface SessionDoc {
  token: string;
  adminId: string;
  username: string;
  createdAt: Date;
  expiresAt: Date;
}

function adminKey(id: string): Deno.KvKey {
  return ["admins", id];
}

function adminUsernameKey(username: string): Deno.KvKey {
  return ["admins_by_username", username];
}

function sessionKey(token: string): Deno.KvKey {
  return ["sessions", token];
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

async function derive(password: string, salt: Uint8Array): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return toHex(new Uint8Array(bits));
}

/** Constant-time comparison of two equal-length hex strings. */
function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);
  return `${toHex(salt)}:${hash}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const recomputed = await derive(password, fromHex(saltHex));
  return timingSafeEqualStr(recomputed, hashHex);
}

export interface AdminSummary {
  id: string;
  username: string;
  createdAt: Date;
}

function toSummary(doc: AdminDoc): AdminSummary {
  return {
    id: doc.id,
    username: doc.username,
    createdAt: doc.createdAt,
  };
}

export async function listAdmins(): Promise<AdminSummary[]> {
  const kv = await getKv();
  const docs: AdminDoc[] = [];
  const iter = kv.list<AdminDoc>({ prefix: ["admins"] });
  for await (const entry of iter) {
    // Skip username index entries under a different prefix; list only ["admins", id]
    if (entry.key.length !== 2) continue;
    docs.push(entry.value);
  }
  docs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  return docs.map(toSummary);
}

export async function countAdmins(): Promise<number> {
  const kv = await getKv();
  let n = 0;
  const iter = kv.list({ prefix: ["admins"] });
  for await (const entry of iter) {
    if (entry.key.length === 2) n++;
  }
  return n;
}

export async function createAdmin(
  username: string,
  password: string,
): Promise<void> {
  const kv = await getKv();
  const usernameKey = adminUsernameKey(username);
  const existing = await kv.get<string>(usernameKey);
  if (existing.value) {
    throw new Error(`Tài khoản "${username}" đã tồn tại.`);
  }
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const doc: AdminDoc = {
    id,
    username,
    passwordHash,
    createdAt: new Date(),
  };
  const result = await kv.atomic()
    .check(existing)
    .set(adminKey(id), doc)
    .set(usernameKey, id)
    .commit();
  if (!result.ok) {
    throw new Error(`Tài khoản "${username}" đã tồn tại.`);
  }
}

export async function deleteAdmin(id: string): Promise<void> {
  const kv = await getKv();
  const key = adminKey(id);
  const existing = await kv.get<AdminDoc>(key);
  if (!existing.value) return;
  await kv.atomic()
    .check(existing)
    .delete(key)
    .delete(adminUsernameKey(existing.value.username))
    .commit();
  await deleteSessionsForAdmin(id);
}

export async function verifyLogin(
  username: string,
  password: string,
): Promise<AdminSummary | null> {
  const kv = await getKv();
  const idRes = await kv.get<string>(adminUsernameKey(username));
  // Dummy hash so missing-user path still runs PBKDF2 (timing equalization).
  const DUMMY_HASH =
    "00000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000";
  const docRes = idRes.value
    ? await kv.get<AdminDoc>(adminKey(idRes.value))
    : null;
  const stored = docRes?.value?.passwordHash ?? DUMMY_HASH;
  const ok = await verifyPassword(password, stored);
  if (!ok || !docRes?.value) return null;
  return toSummary(docRes.value);
}

export async function changePassword(
  id: string,
  newPassword: string,
): Promise<void> {
  const kv = await getKv();
  const key = adminKey(id);
  const existing = await kv.get<AdminDoc>(key);
  if (!existing.value) {
    throw new Error("Không tìm thấy tài khoản admin.");
  }
  const passwordHash = await hashPassword(newPassword);
  const doc: AdminDoc = { ...existing.value, passwordHash };
  const result = await kv.atomic().check(existing).set(key, doc).commit();
  if (!result.ok) {
    throw new Error("Đổi mật khẩu thất bại, vui lòng thử lại.");
  }
}

export async function createSession(admin: AdminSummary): Promise<string> {
  const kv = await getKv();
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_EXPIRE_MS);
  const doc: SessionDoc = {
    token,
    adminId: admin.id,
    username: admin.username,
    createdAt: now,
    expiresAt,
  };
  await kv.set(sessionKey(token), doc, { expireIn: SESSION_EXPIRE_MS });
  return token;
}

export interface SessionAdmin {
  id: string;
  username: string;
}

export async function getSessionAdmin(
  token: string | undefined,
): Promise<SessionAdmin | null> {
  if (!token) return null;
  const kv = await getKv();
  const res = await kv.get<SessionDoc>(sessionKey(token));
  if (!res.value) return null;
  if (res.value.expiresAt.getTime() < Date.now()) {
    await kv.delete(sessionKey(token));
    return null;
  }
  return { id: res.value.adminId, username: res.value.username };
}

export async function deleteSession(token: string | undefined): Promise<void> {
  if (!token) return;
  const kv = await getKv();
  await kv.delete(sessionKey(token));
}

export async function deleteSessionsForAdmin(adminId: string): Promise<void> {
  const kv = await getKv();
  const iter = kv.list<SessionDoc>({ prefix: ["sessions"] });
  for await (const entry of iter) {
    if (entry.value.adminId === adminId) {
      await kv.delete(entry.key);
    }
  }
}
