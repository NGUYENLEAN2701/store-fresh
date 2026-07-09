import { Head } from "fresh/runtime";
import { page } from "fresh";
import { define } from "../../utils.ts";
import { categories, type Category } from "../../data/products.ts";
import { listProducts } from "../../lib/db.ts";
import ProductExplorer from "../../islands/ProductExplorer.tsx";

const VALID_CATEGORIES = new Set(categories.map((c) => c.id));

export const handler = define.handlers({
  async GET() {
    const products = await listProducts();
    return page({ products });
  },
});

export default define.page<typeof handler>(function ProductsPage(ctx) {
  const { products } = ctx.data;
  const categoryParam = ctx.url.searchParams.get("category");
  const initialCategory: Category | "all" =
    categoryParam && VALID_CATEGORIES.has(categoryParam as Category)
      ? (categoryParam as Category)
      : "all";

  return (
    <div>
      <Head>
        <title>Sản phẩm - GreenGear Store</title>
      </Head>

      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white">
            Tất cả sản phẩm
          </h1>
          <p class="mt-3 text-brand-100/75 max-w-xl mx-auto">
            Bàn phím cơ, gaming gear và mô hình trang trí — chọn lọc chính hãng,
            giao nhanh toàn quốc.
          </p>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <ProductExplorer
          products={products}
          categories={categories}
          initialCategory={initialCategory}
        />
      </section>
    </div>
  );
});
