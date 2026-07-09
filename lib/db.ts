import { MongoClient } from "mongodb";
import type { Category, Product } from "../data/products.ts";
import { loadDotEnv } from "./env.ts";

loadDotEnv();

const MONGODB_URI = Deno.env.get("MONGODB_URI");
if (!MONGODB_URI) {
  throw new Error(
    "Thiếu biến môi trường MONGODB_URI. Tạo file .env ở thư mục gốc dự án.",
  );
}
const DB_NAME = Deno.env.get("MONGODB_DB") ?? "greengear";

const client = new MongoClient(MONGODB_URI);
let connectPromise: Promise<MongoClient> | null = null;
let indexesEnsured = false;

function getMongoClient(): Promise<MongoClient> {
  if (!connectPromise) {
    connectPromise = client.connect();
  }
  return connectPromise;
}

/** Shared database handle for other modules (e.g. lib/auth.ts) that need their own collections. */
export async function getDb() {
  const c = await getMongoClient();
  return c.db(DB_NAME);
}

interface ProductDoc {
  slug: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  icon: string;
  gallery: string[];
  rating: number;
  reviews: number;
  badge?: Product["badge"];
  featured: boolean;
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection() {
  const db = await getDb();
  const col = db.collection<ProductDoc>("products");
  if (!indexesEnsured) {
    indexesEnsured = true;
    await col.createIndex({ slug: 1 }, { unique: true });
  }
  return col;
}

function toProduct(doc: ProductDoc): Product {
  return {
    id: doc.slug,
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    price: doc.price,
    oldPrice: doc.oldPrice,
    icon: doc.icon,
    gallery: doc.gallery,
    rating: doc.rating,
    reviews: doc.reviews,
    badge: doc.badge,
    featured: doc.featured,
    shortDescription: doc.shortDescription,
    description: doc.description,
    specs: doc.specs,
  };
}

export async function listProducts(
  opts: { category?: Category } = {},
): Promise<Product[]> {
  const col = await getCollection();
  const query = opts.category ? { category: opts.category } : {};
  const docs = await col.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(toProduct);
}

export async function listFeaturedProducts(limit = 8): Promise<Product[]> {
  const col = await getCollection();
  const docs = await col.find({ featured: true }).sort({ createdAt: -1 })
    .limit(limit).toArray();
  return docs.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const col = await getCollection();
  const doc = await col.findOne({ slug });
  return doc ? toProduct(doc) : null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const col = await getCollection();
  const docs = await col.find({
    category: product.category,
    slug: { $ne: product.slug },
  }).limit(limit).toArray();
  return docs.map(toProduct);
}

export interface ProductInput {
  slug: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  icon: string;
  gallery: string[];
  rating: number;
  reviews: number;
  badge?: Product["badge"];
  featured: boolean;
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
}

export async function createProduct(input: ProductInput): Promise<void> {
  const col = await getCollection();
  const existing = await col.findOne({ slug: input.slug });
  if (existing) {
    throw new Error(
      `Đường dẫn "${input.slug}" đã tồn tại, vui lòng chọn tên khác.`,
    );
  }
  const now = new Date();
  await col.insertOne({ ...input, createdAt: now, updatedAt: now });
}

export async function updateProduct(
  slug: string,
  input: ProductInput,
): Promise<void> {
  const col = await getCollection();
  await col.updateOne(
    { slug },
    { $set: { ...input, slug, updatedAt: new Date() } },
  );
}

export async function deleteProduct(slug: string): Promise<void> {
  const col = await getCollection();
  await col.deleteOne({ slug });
}

export async function seedProducts(seed: ProductInput[]): Promise<number> {
  const col = await getCollection();
  const now = new Date();
  let count = 0;
  for (const item of seed) {
    const result = await col.updateOne(
      { slug: item.slug },
      { $setOnInsert: { ...item, createdAt: now, updatedAt: now } },
      { upsert: true },
    );
    if (result.upsertedCount > 0) count++;
  }
  return count;
}

const BADGES = ["Mới", "Hot", "Giảm giá", "Bán chạy"] as const;
const CATEGORY_IDS = ["keyboard", "gear", "decor"] as const;

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function parseSpecs(text: string): Record<string, string> {
  const specs: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key && value) specs[key] = value;
  }
  return specs;
}

function parseGallery(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

function parseBadge(raw: string): Product["badge"] {
  return (BADGES as readonly string[]).includes(raw)
    ? (raw as Product["badge"])
    : undefined;
}

/** Reconstructs form values without validation, for redisplaying a form after an error. */
export function draftFromForm(
  form: FormData,
): Partial<Product> & { gallery: string[] } {
  return {
    name: String(form.get("name") ?? ""),
    slug: String(form.get("slug") ?? ""),
    category: String(form.get("category") ?? "") as Category,
    price: Number(form.get("price") ?? 0),
    oldPrice: form.get("oldPrice") ? Number(form.get("oldPrice")) : undefined,
    icon: String(form.get("icon") ?? ""),
    gallery: parseGallery(String(form.get("gallery") ?? "")),
    rating: Number(form.get("rating") ?? 4.5),
    reviews: Number(form.get("reviews") ?? 0),
    badge: parseBadge(String(form.get("badge") ?? "").trim()),
    featured: form.get("featured") === "on",
    shortDescription: String(form.get("shortDescription") ?? ""),
    description: String(form.get("description") ?? ""),
    specs: parseSpecs(String(form.get("specs") ?? "")),
  };
}

/** Validates and normalizes submitted form data. Throws a user-facing Error on invalid input. */
export function parseProductForm(
  form: FormData,
  forcedSlug?: string,
): ProductInput {
  const name = String(form.get("name") ?? "").trim();
  const rawSlug = String(form.get("slug") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const price = Number(form.get("price"));
  const oldPriceRaw = String(form.get("oldPrice") ?? "").trim();
  const icon = String(form.get("icon") ?? "").trim();
  const rating = Number(form.get("rating") ?? 4.5);
  const reviews = Number(form.get("reviews") ?? 0);
  const shortDescription = String(form.get("shortDescription") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();

  if (!name) throw new Error("Vui lòng nhập tên sản phẩm.");
  if (!(CATEGORY_IDS as readonly string[]).includes(category)) {
    throw new Error("Vui lòng chọn danh mục hợp lệ.");
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Giá bán không hợp lệ.");
  }
  if (!icon) throw new Error("Vui lòng nhập URL ảnh chính.");
  if (!shortDescription) throw new Error("Vui lòng nhập mô tả ngắn.");
  if (!description) throw new Error("Vui lòng nhập nội dung bài viết.");

  const slug = forcedSlug ?? slugify(rawSlug || name);
  if (!slug) throw new Error("Không thể tạo đường dẫn (slug) hợp lệ.");

  return {
    slug,
    name,
    category: category as Category,
    price,
    oldPrice: oldPriceRaw ? Number(oldPriceRaw) : undefined,
    icon,
    gallery: parseGallery(String(form.get("gallery") ?? "")),
    rating: Number.isFinite(rating) ? rating : 4.5,
    reviews: Number.isFinite(reviews) ? reviews : 0,
    badge: parseBadge(String(form.get("badge") ?? "").trim()),
    featured: form.get("featured") === "on",
    shortDescription,
    description,
    specs: parseSpecs(String(form.get("specs") ?? "")),
  };
}
