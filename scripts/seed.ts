import { SEED_PRODUCTS } from "../data/seed-products.ts";
import { seedProducts } from "../lib/db.ts";

const input = SEED_PRODUCTS.map(({ id: _id, featured, ...rest }) => ({
  ...rest,
  featured: featured ?? false,
}));

const inserted = await seedProducts(input);
console.log(
  `Seed hoàn tất: đã thêm mới ${inserted}/${input.length} sản phẩm (sản phẩm đã tồn tại theo slug được bỏ qua).`,
);
Deno.exit(0);
