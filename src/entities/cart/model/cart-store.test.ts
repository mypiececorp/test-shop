import { describe, expect, it } from "vitest";

import { CartStore } from "./cart-store";
import type { Product } from "@/entities/product/model/types";

const product: Product = {
  id: "product-1",
  title: "Arabica Coffee",
  description: "Ground coffee, 250 g",
  price: 420,
  stock: 8,
  imageSeed: 1,
};

describe("CartStore", () => {
  it("aggregates item quantity and total when the same product is added", () => {
    const store = new CartStore();

    store.addProduct(product);
    store.addProduct(product);

    expect(store.items).toHaveLength(1);
    expect(store.items[0]).toMatchObject({ productId: "product-1", quantity: 2 });
    expect(store.total).toBe(840);
    expect(store.positionsCount).toBe(2);
  });

  it("removes products by quantity and then removes the item completely", () => {
    const store = new CartStore();

    store.addProduct(product);
    store.addProduct(product);
    store.removeProduct(product.id);
    store.removeProduct(product.id);

    expect(store.items).toEqual([]);
    expect(store.total).toBe(0);
  });

  it("keeps selected fixed order options in the analytics snapshot", () => {
    const store = new CartStore();

    store.addProduct(product);
    store.toggleOption("leave-at-door");

    expect(store.selectedOptionIds).toEqual(["leave-at-door"]);
    expect(store.analyticsSnapshot).toMatchObject({
      items: [{ productId: "product-1", quantity: 1, price: 420 }],
      optionIds: ["leave-at-door"],
      total: 420,
    });
  });

  it("marks orders below the minimum amount as invalid", () => {
    const store = new CartStore();

    store.addProduct(product);

    expect(store.canCheckout).toBe(false);
    expect(store.checkoutBlockReason).toBe("Минимальная сумма заказа 1000 ₽");
  });
});
