import { useMemo, useState } from "preact/hooks";
import type { Category, CategoryInfo, Product } from "../data/products.ts";
import { ProductCard } from "../components/ProductCard.tsx";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Nổi bật" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
];

interface ProductExplorerProps {
  products: Product[];
  categories: CategoryInfo[];
  initialCategory: Category | "all";
}

export default function ProductExplorer(
  { products, categories, initialCategory }: ProductExplorerProps,
) {
  const [category, setCategory] = useState<Category | "all">(
    initialCategory,
  );
  const [sort, setSort] = useState<SortKey>("featured");

  function selectCategory(next: Category | "all") {
    setCategory(next);
    const url = new URL(globalThis.location.href);
    if (next === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", next);
    }
    globalThis.history.replaceState({}, "", url);
  }

  const filtered = useMemo(() => {
    let list = category === "all"
      ? products
      : products.filter((p) => p.category === category);

    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  }, [category, sort]);

  return (
    <div>
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectCategory("all")}
            class={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              category === "all"
                ? "bg-brand-600 border-brand-600 text-white"
                : "bg-white border-brand-100 text-brand-900 hover:border-brand-300"
            }`}
          >
            Tất cả
          </button>
          {categories.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => selectCategory(c.id)}
              class={`px-4 py-2 rounded-full text-sm font-medium border transition-colors inline-flex items-center gap-1.5 ${
                category === c.id
                  ? "bg-brand-600 border-brand-600 text-white"
                  : "bg-white border-brand-100 text-brand-900 hover:border-brand-300"
              }`}
            >
              <span>{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>

        <label class="flex items-center gap-2 text-sm text-gray-500 shrink-0">
          Sắp xếp:
          <select
            value={sort}
            onChange={(e) =>
              setSort((e.target as HTMLSelectElement).value as SortKey)}
            class="rounded-lg border border-brand-100 bg-white px-3 py-2 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            {SORT_OPTIONS.map((o) => (
              <option value={o.value} key={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>

      <p class="mt-5 text-sm text-gray-500">
        {filtered.length} sản phẩm
      </p>

      {filtered.length > 0
        ? (
          <div class="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )
        : (
          <div class="mt-16 text-center text-gray-400">
            <p class="text-5xl mb-4">🔍</p>
            <p>Không tìm thấy sản phẩm phù hợp.</p>
          </div>
        )}
    </div>
  );
}
