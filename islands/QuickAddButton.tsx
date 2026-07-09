import { useState } from "preact/hooks";
import { addToCart } from "../lib/cart.ts";

interface QuickAddButtonProps {
  slug: string;
  name: string;
  price: number;
  icon: string;
}

export default function QuickAddButton(props: QuickAddButtonProps) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(props, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Thêm ${props.name} vào giỏ hàng`}
      class={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all ${
        added
          ? "bg-brand-600 text-white"
          : "bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white"
      }`}
    >
      {added
        ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.415l-7.005 7a1 1 0 01-1.414 0l-3.005-3a1 1 0 111.415-1.414l2.297 2.296 6.298-6.296a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        )
        : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2.5 3a1 1 0 000 2h.7l1.68 8.39A2 2 0 006.83 15H15a1 1 0 100-2H6.83l-.2-1H15.5a2 2 0 001.94-1.515l1.05-4.2A1 1 0 0017.53 5H5.11l-.25-1.24A1 1 0 003.88 3H2.5z" />
          </svg>
        )}
    </button>
  );
}
