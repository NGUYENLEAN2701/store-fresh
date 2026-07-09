import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../../utils.ts";
import { deleteProduct, getProductBySlug } from "../../../lib/db.ts";
import { ProductVisual } from "../../../components/ProductVisual.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const product = await getProductBySlug(ctx.params.slug);
    if (!product) {
      return new Response("Không tìm thấy sản phẩm", { status: 404 });
    }
    return page({ product });
  },
  async POST(ctx) {
    await deleteProduct(ctx.params.slug);
    return ctx.redirect("/admin");
  },
});

export default define.page<typeof handler>(function DeleteProductPage(
  { data },
) {
  const { product } = data;

  return (
    <div class="max-w-lg mx-auto px-4 py-16 text-center">
      <Head>
        <title>Xóa {product.name} - GreenGear Admin</title>
      </Head>
      <div class="h-20 w-20 mx-auto rounded-2xl overflow-hidden bg-brand-50 flex items-center justify-center text-4xl">
        <ProductVisual value={product.icon} alt={product.name} />
      </div>
      <h1 class="mt-5 text-xl font-bold text-brand-950">
        Xóa "{product.name}"?
      </h1>
      <p class="mt-2 text-sm text-gray-500">
        Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa khỏi cửa hàng ngay
        lập tức.
      </p>
      <div class="mt-8 flex items-center justify-center gap-3">
        <a
          href="/admin"
          class="rounded-full px-6 py-2.5 border border-brand-200 text-brand-700 font-semibold hover:bg-brand-50"
        >
          Hủy
        </a>
        <form method="POST">
          <button
            type="submit"
            class="rounded-full px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Xác nhận xóa
          </button>
        </form>
      </div>
    </div>
  );
});
