import { useState } from "preact/hooks";
import { ProductVisual } from "../components/ProductVisual.tsx";

interface ProductGalleryProps {
  icon: string;
  gallery: string[];
  name: string;
}

export default function ProductGallery(
  { icon, gallery, name }: ProductGalleryProps,
) {
  const [active, setActive] = useState(0);
  const rest = gallery.filter((g) => g !== icon);
  const images = [icon, ...rest];

  return (
    <div>
      <div class="product-icon-tile rounded-3xl aspect-square flex items-center justify-center text-[7rem] sm:text-[9rem] overflow-hidden">
        <ProductVisual value={images[active]} alt={name} />
      </div>
      {images.length > 1 && (
        <div class="mt-4 flex gap-3">
          {images.map((g, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setActive(i)}
              class={`h-16 w-16 rounded-xl flex items-center justify-center text-2xl border-2 overflow-hidden transition-colors ${
                i === active
                  ? "border-brand-500 bg-brand-50"
                  : "border-brand-100 bg-white hover:border-brand-300"
              }`}
            >
              <ProductVisual value={g} alt={`${name} ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
