export type Category = "keyboard" | "gear" | "decor";

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  icon: string;
}

export const categories: CategoryInfo[] = [
  {
    id: "keyboard",
    name: "Bàn phím cơ",
    description: "Gõ đã tay, switch đa dạng, hotswap dễ dàng",
    icon: "⌨️",
  },
  {
    id: "gear",
    name: "Gaming Gear",
    description: "Chuột, tai nghe, phụ kiện tối ưu hiệu năng thi đấu",
    icon: "🎮",
  },
  {
    id: "decor",
    name: "Mô hình trang trí",
    description: "Mô hình sưu tầm, trang trí góc làm việc thêm chất",
    icon: "🗿",
  },
];

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  icon: string;
  gallery: string[];
  rating: number;
  reviews: number;
  badge?: "Mới" | "Hot" | "Giảm giá" | "Bán chạy";
  featured?: boolean;
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
}

export function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "₫";
}

export function getCategoryInfo(id: Category): CategoryInfo {
  return categories.find((c) => c.id === id)!;
}

/** True when a product's `icon`/`gallery` value is an image URL rather than an emoji placeholder. */
export function isImageUrl(value: string): boolean {
  return /^https?:\/\//.test(value) || value.startsWith("/");
}
