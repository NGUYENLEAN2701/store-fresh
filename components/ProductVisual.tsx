import { isImageUrl } from "../data/products.ts";

interface ProductVisualProps {
  value: string;
  alt: string;
  imgClass?: string;
}

/** Renders a product's `icon`/`gallery` entry as a real image when it's a URL, or as an emoji placeholder otherwise. */
export function ProductVisual({ value, alt, imgClass }: ProductVisualProps) {
  if (isImageUrl(value)) {
    return (
      <img
        src={value}
        alt={alt}
        loading="lazy"
        class={imgClass ?? "h-full w-full object-cover"}
      />
    );
  }
  return <>{value}</>;
}
