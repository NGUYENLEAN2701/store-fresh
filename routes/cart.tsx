import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import CartPage from "../islands/CartPage.tsx";

export default define.page(function Cart() {
  return (
    <div>
      <Head>
        <title>Giỏ hàng - GreenGear Store</title>
      </Head>
      <CartPage />
    </div>
  );
});
