import type { Category, Product } from "../data/products.ts";
import { getKv } from "./kv.ts";

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

function productKey(slug: string): Deno.KvKey {
  return ["products", slug];
}

function categoryIndexKey(category: Category, slug: string): Deno.KvKey {
  return ["products_by_category", category, slug];
}

function featuredIndexKey(slug: string): Deno.KvKey {
  return ["products_featured", slug];
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

function sortByCreatedDesc(docs: ProductDoc[]): ProductDoc[] {
  return docs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function writeProductIndexes(op: Deno.AtomicOperation, doc: ProductDoc): void {
  op.set(categoryIndexKey(doc.category, doc.slug), doc.slug);
  if (doc.featured) {
    op.set(featuredIndexKey(doc.slug), doc.slug);
  }
}

function clearProductIndexes(op: Deno.AtomicOperation, doc: ProductDoc): void {
  op.delete(categoryIndexKey(doc.category, doc.slug));
  op.delete(featuredIndexKey(doc.slug));
}

/** Lightweight connectivity probe for Deploy diagnostics. */
export async function pingDb(): Promise<
  { ok: true; db: string } | { ok: false; error: string }
> {
  try {
    const kv = await getKv();
    await kv.get(["__health"]);
    return { ok: true, db: "deno-kv" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[kv] ping failed:", message);
    return { ok: false, error: message };
  }
}

export async function listProducts(
  opts: { category?: Category } = {},
): Promise<Product[]> {
  const kv = await getKv();
  const docs: ProductDoc[] = [];

  if (opts.category) {
    const iter = kv.list<string>({
      prefix: ["products_by_category", opts.category],
    });
    for await (const entry of iter) {
      const slug = entry.value;
      const res = await kv.get<ProductDoc>(productKey(slug));
      if (res.value) docs.push(res.value);
    }
  } else {
    const iter = kv.list<ProductDoc>({ prefix: ["products"] });
    for await (const entry of iter) {
      docs.push(entry.value);
    }
  }

  return sortByCreatedDesc(docs).map(toProduct);
}

export async function listFeaturedProducts(limit = 8): Promise<Product[]> {
  const kv = await getKv();
  const docs: ProductDoc[] = [];
  const iter = kv.list<string>({ prefix: ["products_featured"] });
  for await (const entry of iter) {
    const res = await kv.get<ProductDoc>(productKey(entry.value));
    if (res.value) docs.push(res.value);
  }
  return sortByCreatedDesc(docs).slice(0, limit).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const kv = await getKv();
  const res = await kv.get<ProductDoc>(productKey(slug));
  return res.value ? toProduct(res.value) : null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const kv = await getKv();
  const docs: ProductDoc[] = [];
  const iter = kv.list<string>({
    prefix: ["products_by_category", product.category],
  });
  for await (const entry of iter) {
    if (entry.value === product.slug) continue;
    const res = await kv.get<ProductDoc>(productKey(entry.value));
    if (res.value) docs.push(res.value);
    if (docs.length >= limit) break;
  }
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
  const kv = await getKv();
  const key = productKey(input.slug);
  const existing = await kv.get<ProductDoc>(key);
  if (existing.value) {
    throw new Error(
      `Đường dẫn "${input.slug}" đã tồn tại, vui lòng chọn tên khác.`,
    );
  }
  const now = new Date();
  const doc: ProductDoc = { ...input, createdAt: now, updatedAt: now };
  const op = kv.atomic().check(existing).set(key, doc);
  writeProductIndexes(op, doc);
  const result = await op.commit();
  if (!result.ok) {
    throw new Error(
      `Đường dẫn "${input.slug}" đã tồn tại, vui lòng chọn tên khác.`,
    );
  }
}

export async function updateProduct(
  slug: string,
  input: ProductInput,
): Promise<void> {
  const kv = await getKv();
  const key = productKey(slug);
  const existing = await kv.get<ProductDoc>(key);
  if (!existing.value) {
    throw new Error(`Không tìm thấy sản phẩm "${slug}".`);
  }
  const prev = existing.value;
  const doc: ProductDoc = {
    ...input,
    slug,
    createdAt: prev.createdAt,
    updatedAt: new Date(),
  };
  const op = kv.atomic().check(existing);
  clearProductIndexes(op, prev);
  op.set(key, doc);
  writeProductIndexes(op, doc);
  const result = await op.commit();
  if (!result.ok) {
    throw new Error("Cập nhật sản phẩm thất bại, vui lòng thử lại.");
  }
}

export async function deleteProduct(slug: string): Promise<void> {
  const kv = await getKv();
  const key = productKey(slug);
  const existing = await kv.get<ProductDoc>(key);
  if (!existing.value) return;
  const op = kv.atomic().check(existing);
  clearProductIndexes(op, existing.value);
  op.delete(key);
  const result = await op.commit();
  if (!result.ok) {
    throw new Error("Xóa sản phẩm thất bại, vui lòng thử lại.");
  }
}

export async function seedProducts(seed: ProductInput[]): Promise<number> {
  const kv = await getKv();
  const now = new Date();
  let count = 0;
  for (const item of seed) {
    const key = productKey(item.slug);
    const existing = await kv.get<ProductDoc>(key);
    if (existing.value) continue;
    const doc: ProductDoc = { ...item, createdAt: now, updatedAt: now };
    const op = kv.atomic().check(existing).set(key, doc);
    writeProductIndexes(op, doc);
    const result = await op.commit();
    if (result.ok) count++;
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
