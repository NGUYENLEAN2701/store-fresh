import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import { categories, type Category, products } from "../../data/products.ts";
import ProductExplorer from "../../islands/ProductExplorer.tsx";

const VALID_CATEGORIES = new Set(categories.map((c) => c.id));

export default define.page(function ProductsPage(ctx) {
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
