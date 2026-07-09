import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../utils.ts";
import { listProducts } from "../../lib/db.ts";
import { formatPrice, getCategoryInfo } from "../../data/products.ts";
import { ProductVisual } from "../../components/ProductVisual.tsx";

export const handler = define.handlers({
  async GET() {
    const products = await listProducts();
    return page({ products });
  },
});

export default define.page<typeof handler>(function AdminProductList(
  { data },
) {
  const { products } = data;

  return (
    <div class="max-w-6xl mx-auto px-4 py-10">
      <Head>
        <title>Quản lý sản phẩm - GreenGear Admin</title>
      </Head>

      <div class="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 class="text-2xl font-bold text-brand-950">Quản lý sản phẩm</h1>
          <p class="text-sm text-gray-500 mt-1">{products.length} sản phẩm</p>
        </div>
        <a
          href="/admin/new"
          class="rounded-full px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold whitespace-nowrap"
        >
          + Thêm sản phẩm
        </a>
      </div>

      <div class="rounded-2xl border border-brand-100 overflow-hidden bg-white overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-brand-50 text-left text-gray-500">
            <tr>
              <th class="px-4 py-3 font-medium">Ảnh</th>
              <th class="px-4 py-3 font-medium">Tên sản phẩm</th>
              <th class="px-4 py-3 font-medium">Danh mục</th>
              <th class="px-4 py-3 font-medium">Giá</th>
              <th class="px-4 py-3 font-medium">Nổi bật</th>
              <th class="px-4 py-3 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-100">
            {products.map((p) => (
              <tr key={p.slug}>
                <td class="px-4 py-3">
                  <div class="h-12 w-12 rounded-lg overflow-hidden bg-brand-50 flex items-center justify-center text-2xl">
                    <ProductVisual value={p.icon} alt={p.name} />
                  </div>
                </td>
                <td class="px-4 py-3">
                  <p class="font-medium text-brand-950">{p.name}</p>
                  <p class="text-xs text-gray-400">{p.slug}</p>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {getCategoryInfo(p.category).name}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {formatPrice(p.price)}
                </td>
                <td class="px-4 py-3">{p.featured ? "✅" : "—"}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <a
                    href={`/admin/${p.slug}`}
                    class="text-brand-700 hover:underline mr-3"
                  >
                    Sửa
                  </a>
                  <a
                    href={`/admin/${p.slug}/delete`}
                    class="text-red-500 hover:underline"
                  >
                    Xóa
                  </a>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} class="px-4 py-10 text-center text-gray-400">
                  Chưa có sản phẩm nào. Bấm "Thêm sản phẩm" để bắt đầu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
