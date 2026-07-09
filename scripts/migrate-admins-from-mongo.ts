/**
 * One-shot: copy admin accounts (username + password hash) from MongoDB → Deno KV.
 *
 * Local KV:
 *   deno run -A --unstable-kv scripts/migrate-admins-from-mongo.ts
 *
 * Deploy KV (remote):
 *   export DENO_KV_ACCESS_TOKEN=ddo_...
 *   export DENO_KV_URL=https://api.deno.com/v2/databases/<DATABASE_ID>/connect
 *   deno run -A --unstable-kv scripts/migrate-admins-from-mongo.ts
 */
import { MongoClient, ObjectId } from "npm:mongodb@^6.11.0";
import { getKv } from "../lib/kv.ts";

function loadDotEnv() {
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
    // rely on real env
  }
}

loadDotEnv();

const uri = Deno.env.get("MONGODB_URI");
if (!uri) {
  console.error("Thiếu MONGODB_URI trong .env — không đọc được admin cũ.");
  Deno.exit(1);
}

const dbName = Deno.env.get("MONGODB_DB") ?? "greengear";

interface MongoAdmin {
  _id: ObjectId;
  username: string;
  passwordHash: string;
  createdAt?: Date;
}

const client = new MongoClient(uri);
await client.connect();
const col = client.db(dbName).collection<MongoAdmin>("admins");
const docs = await col.find().toArray();
await client.close();

if (docs.length === 0) {
  console.log("MongoDB không có admin nào để migrate.");
  Deno.exit(0);
}

const kv = await getKv();
let created = 0;
let skipped = 0;

for (const doc of docs) {
  const username = doc.username;
  const usernameKey: Deno.KvKey = ["admins_by_username", username];
  const existing = await kv.get<string>(usernameKey);
  if (existing.value) {
    console.log(`skip: "${username}" đã có trên KV`);
    skipped++;
    continue;
  }

  const id = doc._id.toHexString();
  const adminDoc = {
    id,
    username,
    passwordHash: doc.passwordHash,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(),
  };

  const result = await kv.atomic()
    .check(existing)
    .set(["admins", id], adminDoc)
    .set(usernameKey, id)
    .commit();

  if (result.ok) {
    console.log(`ok: migrated "${username}"`);
    created++;
  } else {
    console.log(`skip: "${username}" (race)`);
    skipped++;
  }
}

console.log(
  `Xong: migrated ${created}, skipped ${skipped}, total mongo ${docs.length}.`,
);
console.log("Đăng nhập bằng đúng username/password cũ trên MongoDB.");
Deno.exit(0);
