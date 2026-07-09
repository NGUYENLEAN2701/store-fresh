import { ObjectId } from "mongodb";
import { getDb } from "./db.ts";

export const SESSION_COOKIE = "admin_session";
export const SESSION_DAYS = 7;

interface AdminDoc {
  _id: ObjectId;
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

async function getAdminsCollection() {
  const db = await getDb();
  const col = db.collection<AdminDoc>("admins");
  await col.createIndex({ username: 1 }, { unique: true });
  return col;
}

async function getSessionsCollection() {
  const db = await getDb();
  const col = db.collection<SessionDoc>("sessions");
  await col.createIndex({ token: 1 }, { unique: true });
  await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  return col;
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
    id: doc._id.toHexString(),
    username: doc.username,
    createdAt: doc.createdAt,
  };
}

export async function listAdmins(): Promise<AdminSummary[]> {
  const col = await getAdminsCollection();
  const docs = await col.find().sort({ createdAt: 1 }).toArray();
  return docs.map(toSummary);
}

export async function countAdmins(): Promise<number> {
  const col = await getAdminsCollection();
  return await col.countDocuments();
}

export async function createAdmin(
  username: string,
  password: string,
): Promise<void> {
  const col = await getAdminsCollection();
  const existing = await col.findOne({ username });
  if (existing) {
    throw new Error(`Tài khoản "${username}" đã tồn tại.`);
  }
  const passwordHash = await hashPassword(password);
  await col.insertOne({
    _id: new ObjectId(),
    username,
    passwordHash,
    createdAt: new Date(),
  });
}

export async function deleteAdmin(id: string): Promise<void> {
  const col = await getAdminsCollection();
  await col.deleteOne({ _id: new ObjectId(id) });
}

export async function verifyLogin(
  username: string,
  password: string,
): Promise<AdminSummary | null> {
  const col = await getAdminsCollection();
  const doc = await col.findOne({ username });
  if (!doc) return null;
  const ok = await verifyPassword(password, doc.passwordHash);
  if (!ok) return null;
  return toSummary(doc);
}

export async function changePassword(
  id: string,
  newPassword: string,
): Promise<void> {
  const col = await getAdminsCollection();
  const passwordHash = await hashPassword(newPassword);
  await col.updateOne({ _id: new ObjectId(id) }, { $set: { passwordHash } });
}

export async function createSession(admin: AdminSummary): Promise<string> {
  const col = await getSessionsCollection();
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  );
  await col.insertOne({
    token,
    adminId: admin.id,
    username: admin.username,
    createdAt: now,
    expiresAt,
  });
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
  const col = await getSessionsCollection();
  const doc = await col.findOne({ token });
  if (!doc) return null;
  if (doc.expiresAt.getTime() < Date.now()) {
    await col.deleteOne({ token });
    return null;
  }
  return { id: doc.adminId, username: doc.username };
}

export async function deleteSession(token: string | undefined): Promise<void> {
  if (!token) return;
  const col = await getSessionsCollection();
  await col.deleteOne({ token });
}

export async function deleteSessionsForAdmin(adminId: string): Promise<void> {
  const col = await getSessionsCollection();
  await col.deleteMany({ adminId });
}
