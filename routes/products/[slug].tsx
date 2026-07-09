import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import {
  formatPrice,
  getCategoryInfo,
  getProductBySlug,
  getRelatedProducts,
} from "../../data/products.ts";
import { ProductBadge } from "../../components/Badge.tsx";
import { StarRating } from "../../components/StarRating.tsx";
import { ProductCard } from "../../components/ProductCard.tsx";
import ProductGallery from "../../islands/ProductGallery.tsx";
import ProductDetailActions from "../../islands/ProductDetailActions.tsx";

export default define.page(function ProductDetailPage(ctx) {
  const product = getProductBySlug(ctx.params.slug);

  if (!product) {
    return (
      <div class="max-w-3xl mx-auto px-4 py-24 text-center">
        <p class="text-6xl mb-4">🧐</p>
        <h1 class="text-2xl font-bold text-brand-950">
          Không tìm thấy sản phẩm
        </h1>
        <p class="mt-2 text-gray-500">
          Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.
        </p>
        <a
          href="/products"
          class="inline-block mt-6 rounded-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
        >
          Xem tất cả sản phẩm
        </a>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(product.category);
  const related = getRelatedProducts(product);

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Head>
        <title>{product.name} - GreenGear Store</title>
      </Head>

      <nav class="text-sm text-gray-500 flex flex-wrap items-center gap-1.5">
        <a href="/" class="hover:text-brand-700">Trang chủ</a>
        <span>/</span>
        <a href="/products" class="hover:text-brand-700">Sản phẩm</a>
        <span>/</span>
        <a
          href={`/products?category=${categoryInfo.id}`}
          class="hover:text-brand-700"
        >
          {categoryInfo.name}
        </a>
        <span>/</span>
        <span class="text-brand-900 font-medium">{product.name}</span>
      </nav>

      <div class="mt-6 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <ProductGallery icon={product.icon} gallery={product.gallery} />
        </div>

        <div>
          {product.badge && (
            <span class="inline-block mb-3">
              <ProductBadge label={product.badge} />
            </span>
          )}
          <h1 class="text-2xl sm:text-3xl font-extrabold text-brand-950">
            {product.name}
          </h1>
          <div class="mt-3">
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>
          <div class="mt-4 flex items-baseline gap-3">
            <span class="text-3xl font-extrabold text-brand-700">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span class="text-lg line-through text-gray-400">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p class="mt-4 text-gray-600 leading-relaxed">
            {product.shortDescription}
          </p>

          <div class="mt-6 pt-6 border-t border-brand-100">
            <ProductDetailActions
              slug={product.slug}
              name={product.name}
              price={product.price}
              icon={product.icon}
            />
          </div>

          <div class="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
            <div class="rounded-xl bg-brand-50 py-3">
              🚚<p class="mt-1">Giao nhanh 2h</p>
            </div>
            <div class="rounded-xl bg-brand-50 py-3">
              🛡️<p class="mt-1">Bảo hành 12-24 tháng</p>
            </div>
            <div class="rounded-xl bg-brand-50 py-3">
              ↩️<p class="mt-1">Đổi trả 7 ngày</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 grid lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2">
          <h2 class="text-xl font-bold text-brand-950 mb-4">
            Mô tả sản phẩm
          </h2>
          <p class="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
        <div>
          <h2 class="text-xl font-bold text-brand-950 mb-4">
            Thông số kỹ thuật
          </h2>
          <dl class="rounded-2xl border border-brand-100 divide-y divide-brand-100 overflow-hidden">
            {Object.entries(product.specs).map(([key, value]) => (
              <div
                key={key}
                class="flex items-center justify-between gap-4 px-4 py-3 text-sm odd:bg-brand-50/50"
              >
                <dt class="text-gray-500">{key}</dt>
                <dd class="font-medium text-brand-950 text-right">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <div class="mt-20">
          <h2 class="text-xl sm:text-2xl font-bold text-brand-950 mb-6">
            Sản phẩm liên quan
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
});
