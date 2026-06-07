import { describe, expect, it } from "vitest";

import {
  BackendError,
  createFakeBackend,
  MIN_ORDER_AMOUNT,
} from "./fake-backend";

describe("fake backend", () => {
  it("returns products in pages of 20 items with the next offset", async () => {
    const backend = createFakeBackend({ random: () => 0.9 });

    const firstPage = await backend.fetchProducts({ limit: 20, offset: 0 });
    const secondPage = await backend.fetchProducts({ limit: 20, offset: firstPage.nextOffset ?? 0 });

    expect(firstPage.items).toHaveLength(20);
    expect(firstPage.items[0].id).toBe("product-1");
    expect(firstPage.total).toBe(1000);
    expect(firstPage.nextOffset).toBe(20);
    expect(secondPage.items).toHaveLength(20);
    expect(secondPage.items[0].id).toBe("product-21");
  });

  it("rejects order submission below the minimum amount", async () => {
    const backend = createFakeBackend({ random: () => 0.9 });

    await expect(
      backend.submitOrder({
        items: [{ productId: "product-1", quantity: 1, price: MIN_ORDER_AMOUNT - 1 }],
        optionIds: [],
        total: MIN_ORDER_AMOUNT - 1,
      }),
    ).rejects.toMatchObject({
      code: "MIN_ORDER_AMOUNT",
      message: "Не достигнута минимальная сумма для покупки",
    });
  });

  it("rejects order submission when the simulated service is unavailable", async () => {
    const backend = createFakeBackend({ random: () => 0.01 });

    await expect(
      backend.submitOrder({
        items: [{ productId: "product-1", quantity: 3, price: 400 }],
        optionIds: [],
        total: 1200,
      }),
    ).rejects.toBeInstanceOf(BackendError);
  });

  it("sends analytics events with the full cart snapshot", async () => {
    const backend = createFakeBackend({ random: () => 0.9 });

    const result = await backend.sendAnalyticsEvent({
      items: [{ productId: "product-1", quantity: 2, price: 420 }],
      optionIds: ["leave-at-door"],
      total: 840,
    });

    expect(result.status).toBe("ok");
    expect(result.received.items).toHaveLength(1);
    expect(result.received.optionIds).toEqual(["leave-at-door"]);
  });
});
