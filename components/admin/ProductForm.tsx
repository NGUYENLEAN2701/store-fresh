import { categories } from "../../data/products.ts";
import type { Product } from "../../data/products.ts";

const BADGES = ["Mới", "Hot", "Giảm giá", "Bán chạy"] as const;
const GALLERY_PLACEHOLDER = "https://...\nhttps://...";
const SPECS_PLACEHOLDER = "Layout: 75%\nKết nối: Bluetooth";

interface ProductFormProps {
  action: string;
  submitLabel: string;
  values?: Partial<Product> & { gallery?: string[] };
  slugEditable?: boolean;
  error?: string;
}

export function ProductForm(
  { action, submitLabel, values = {}, slugEditable = true, error }:
    ProductFormProps,
) {
  const specsText = values.specs
    ? Object.entries(values.specs).map(([k, v]) => `${k}: ${v}`).join("\n")
    : "";
  const galleryText = (values.gallery ?? []).join("\n");

  return (
    <form method="POST" action={action} class="space-y-6">
      {error && (
        <div class="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <label class="text-sm font-medium text-gray-600">
            Tên sản phẩm *
          </label>
          <input
            name="name"
            required
            value={values.name}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">
            Đường dẫn (slug){!slugEditable && " — không thể sửa"}
          </label>
          <input
            name="slug"
            value={values.slug}
            readOnly={!slugEditable}
            placeholder="để trống sẽ tự tạo từ tên"
            class={`mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300 ${
              slugEditable ? "" : "bg-gray-50 text-gray-500"
            }`}
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">Danh mục *</label>
          <select
            name="category"
            required
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 bg-white"
          >
            <option value="" disabled selected={!values.category}>
              Chọn danh mục
            </option>
            {categories.map((c) => (
              <option
                value={c.id}
                key={c.id}
                selected={values.category === c.id}
              >
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">Nhãn</label>
          <select
            name="badge"
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5 bg-white"
          >
            <option value="" selected={!values.badge}>Không có</option>
            {BADGES.map((b) => (
              <option value={b} key={b} selected={values.badge === b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">
            Giá bán (₫) *
          </label>
          <input
            type="number"
            name="price"
            min="0"
            required
            value={values.price}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">
            Giá gốc (₫)
          </label>
          <input
            type="number"
            name="oldPrice"
            min="0"
            value={values.oldPrice}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">
            Đánh giá (0-5)
          </label>
          <input
            type="number"
            name="rating"
            min="0"
            max="5"
            step="0.1"
            value={values.rating ?? 4.5}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">
            Số lượt đánh giá
          </label>
          <input
            type="number"
            name="reviews"
            min="0"
            value={values.reviews ?? 0}
            class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5"
          />
        </div>
        <div class="sm:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={values.featured}
            class="h-4 w-4 rounded border-brand-300"
          />
          <label for="featured" class="text-sm font-medium text-gray-600">
            Hiển thị ở mục "Sản phẩm nổi bật"
          </label>
        </div>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-600">
          Ảnh chính (URL) *
        </label>
        <input
          type="text"
          name="icon"
          required
          value={values.icon}
          placeholder="https://... (dán URL ảnh sản phẩm)"
          class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5"
        />
        <p class="mt-1 text-xs text-gray-400">
          Dán URL ảnh sản phẩm (ví dụ từ Cloudinary, Imgur, Google Drive chia sẻ
          công khai...).
        </p>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-600">
          Ảnh khác (mỗi dòng 1 URL)
        </label>
        <textarea
          name="gallery"
          rows={3}
          class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5"
          placeholder={GALLERY_PLACEHOLDER}
        >
          {galleryText}
        </textarea>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-600">
          Mô tả ngắn *
        </label>
        <input
          name="shortDescription"
          required
          value={values.shortDescription}
          class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5"
        />
      </div>

      <div>
        <label class="text-sm font-medium text-gray-600">
          Bài viết / Mô tả chi tiết *
        </label>
        <textarea
          name="description"
          required
          rows={8}
          class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5"
        >
          {values.description}
        </textarea>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-600">
          Thông số kỹ thuật (mỗi dòng "Tên: Giá trị")
        </label>
        <textarea
          name="specs"
          rows={5}
          class="mt-1.5 w-full rounded-xl border border-brand-100 px-4 py-2.5"
          placeholder={SPECS_PLACEHOLDER}
        >
          {specsText}
        </textarea>
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          class="rounded-full px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
        >
          {submitLabel}
        </button>
        <a
          href="/admin"
          class="rounded-full px-8 py-3 border border-brand-200 text-brand-700 font-semibold hover:bg-brand-50"
        >
          Hủy
        </a>
      </div>
    </form>
  );
}
