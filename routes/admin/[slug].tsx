import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../utils.ts";
import {
  draftFromForm,
  getProductBySlug,
  parseProductForm,
  updateProduct,
} from "../../lib/db.ts";
import { ProductForm } from "../../components/admin/ProductForm.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const product = await getProductBySlug(ctx.params.slug);
    if (!product) {
      return new Response("Không tìm thấy sản phẩm", { status: 404 });
    }
    return page({ product, error: undefined, draft: undefined });
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const product = await getProductBySlug(ctx.params.slug);
    if (!product) {
      return new Response("Không tìm thấy sản phẩm", { status: 404 });
    }
    try {
      const input = parseProductForm(form, ctx.params.slug);
      await updateProduct(ctx.params.slug, input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra.";
      return page({ product, error: message, draft: draftFromForm(form) });
    }
    return ctx.redirect("/admin");
  },
});

export default define.page<typeof handler>(function EditProductPage(
  { data },
) {
  const { product, error, draft } = data;

  return (
    <div class="max-w-3xl mx-auto px-4 py-10">
      <Head>
        <title>Sửa {product.name} - GreenGear Admin</title>
      </Head>
      <h1 class="text-2xl font-bold text-brand-950 mb-6">Sửa sản phẩm</h1>
      <ProductForm
        action={`/admin/${product.slug}`}
        submitLabel="Lưu thay đổi"
        values={draft ?? product}
        slugEditable={false}
        error={error}
      />
    </div>
  );
});
