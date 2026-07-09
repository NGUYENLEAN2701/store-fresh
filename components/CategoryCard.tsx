import type { CategoryInfo } from "../data/products.ts";

export function CategoryCard({ category }: { category: CategoryInfo }) {
  return (
    <a
      href={`/products?category=${category.id}`}
      class="group relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 bg-linear-to-br from-brand-800 to-brand-950 text-white overflow-hidden card-hover min-h-[220px]"
    >
      <div class="absolute -right-6 -bottom-6 text-[120px] opacity-10 group-hover:opacity-20 transition-opacity select-none">
        {category.icon}
      </div>
      <div class="relative z-10">
        <span class="text-4xl">{category.icon}</span>
        <h3 class="mt-4 text-xl font-bold">{category.name}</h3>
        <p class="mt-2 text-sm text-brand-100/80">{category.description}</p>
      </div>
      <div class="relative z-10 mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-300 group-hover:text-brand-200">
        Khám phá ngay
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 transition-transform group-hover:translate-x-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </a>
  );
}
