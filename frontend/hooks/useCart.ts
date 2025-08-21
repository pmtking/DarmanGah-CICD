// store/cart.ts
import { create } from "zustand";

type Product = {
  id: number;
  title: string;
  image: string;
  price: string;
};

type CartStore = {
  items: Product[];
  addToCart: (item: Product) => void;
};

export const useCart = create<CartStore>((set) => ({
  items: [],
  addToCart: (item) =>
    set((state) => ({
      items: state.items.some((i) => i.id === item.id)
        ? state.items
        : [...state.items, item],
    })),
}));
