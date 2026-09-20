/** Cart domain types. */

export interface CartItemSnapshot {
  title: string;
  image?: string;
  slug: string;
  variantValue?: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  snapshot: CartItemSnapshot;
}
