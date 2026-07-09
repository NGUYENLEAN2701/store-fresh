import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../utils.ts";
import {
  createProduct,
  draftFromForm,
  parseProductForm,
} from "../../lib/db.ts";
import { ProductForm } from "../../components/admin/ProductForm.tsx";

export const handler = define.handlers({
  GET() {
    return page({ error: undefined, draft: undefined });
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    try {
      const input = parseProductForm(form);
      await createProduct(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra.";
      return page({ error: message, draft: draftFromForm(form) });
    }
    return ctx.redirect("/admin");
  },
});

export default define.page<typeof handler>(function NewProductPage({ data }) {
  return (
    <div class="max-w-3xl mx-auto px-4 py-10">
      <Head>
        <title>Thêm sản phẩm - GreenGear Admin</title>
      </Head>
      <h1 class="text-2xl font-bold text-brand-950 mb-6">Thêm sản phẩm mới</h1>
      <ProductForm
        action="/admin/new"
        submitLabel="Tạo sản phẩm"
        values={data.draft}
        error={data.error}
      />
    </div>
  );
});
