import { computed, signal } from "@preact/signals";

export interface CartLine {
  slug: string;
  name: string;
  price: number;
  icon: string;
  quantity: number;
}

const STORAGE_KEY = "greengear_cart";

function loadInitial(): CartLine[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const cartLines = signal<CartLine[]>(loadInitial());

export const cartCount = computed(() =>
  cartLines.value.reduce((sum, line) => sum + line.quantity, 0)
);

export const cartTotal = computed(() =>
  cartLines.value.reduce((sum, line) => sum + line.quantity * line.price, 0)
);

function persist() {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartLines.value));
}

export function addToCart(
  item: Omit<CartLine, "quantity">,
  quantity = 1,
) {
  const existing = cartLines.value.find((l) => l.slug === item.slug);
  if (existing) {
    cartLines.value = cartLines.value.map((l) =>
      l.slug === item.slug ? { ...l, quantity: l.quantity + quantity } : l
    );
  } else {
    cartLines.value = [...cartLines.value, { ...item, quantity }];
  }
  persist();
}

export function removeFromCart(slug: string) {
  cartLines.value = cartLines.value.filter((l) => l.slug !== slug);
  persist();
}

export function setQuantity(slug: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(slug);
    return;
  }
  cartLines.value = cartLines.value.map((l) =>
    l.slug === slug ? { ...l, quantity } : l
  );
  persist();
}
