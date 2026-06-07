import { productsCatalog, productById } from "@/entities/product/model/product-catalog";
import type { Product } from "@/entities/product/model/types";
import type { CartSnapshot, OrderSubmissionResult } from "@/entities/order/model/types";

export const MIN_ORDER_AMOUNT = 1000;

export type BackendErrorCode =
  | "SERVICE_UNAVAILABLE"
  | "OUT_OF_STOCK"
  | "MIN_ORDER_AMOUNT";

export class BackendError extends Error {
  constructor(
    public readonly code: BackendErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "BackendError";
  }
}

type FakeBackendOptions = {
  random?: () => number;
  latencyMs?: number;
};

export type FetchProductsParams = {
  limit: number;
  offset: number;
  query?: string;
};

export type ProductsPage = {
  items: Product[];
  total: number;
  nextOffset: number | null;
};

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const cloneSnapshot = (snapshot: CartSnapshot): CartSnapshot => ({
  items: snapshot.items.map((item) => ({ ...item })),
  optionIds: [...snapshot.optionIds],
  total: snapshot.total,
});

export const createFakeBackend = (options: FakeBackendOptions = {}) => {
  const random = options.random ?? Math.random;
  const latencyMs = options.latencyMs ?? 350;

  return {
    async fetchProducts({ limit, offset, query }: FetchProductsParams): Promise<ProductsPage> {
      await wait(latencyMs);

      const normalizedQuery = query?.trim().toLowerCase();
      const filteredProducts = normalizedQuery
        ? productsCatalog.filter((product) => product.title.toLowerCase().includes(normalizedQuery))
        : productsCatalog;
      const items = filteredProducts.slice(offset, offset + limit);
      const nextOffset = offset + items.length < filteredProducts.length ? offset + items.length : null;

      return {
        items,
        total: filteredProducts.length,
        nextOffset,
      };
    },

    async sendAnalyticsEvent(snapshot: CartSnapshot) {
      await wait(latencyMs);

      if (random() < 0.18) {
        throw new BackendError("SERVICE_UNAVAILABLE", "Сервис аналитики недоступен");
      }

      return {
        status: "ok" as const,
        eventId: `analytics-${Date.now()}`,
        received: cloneSnapshot(snapshot),
      };
    },

    async submitOrder(snapshot: CartSnapshot): Promise<OrderSubmissionResult> {
      await wait(latencyMs);

      if (snapshot.total < MIN_ORDER_AMOUNT) {
        throw new BackendError(
          "MIN_ORDER_AMOUNT",
          "Не достигнута минимальная сумма для покупки",
        );
      }

      if (random() < 0.12) {
        throw new BackendError("SERVICE_UNAVAILABLE", "Сервис недоступен");
      }

      const unavailableItem = snapshot.items.find((item) => {
        const product = productById.get(item.productId);
        return product ? item.quantity > product.stock : false;
      });

      if (unavailableItem) {
        const product = productById.get(unavailableItem.productId);
        throw new BackendError(
          "OUT_OF_STOCK",
          `Недостаточное количество товара ${product?.title ?? unavailableItem.productId} на складе`,
          { productId: unavailableItem.productId },
        );
      }

      if (random() < 0.1 && snapshot.items.length > 0) {
        const item = snapshot.items[0];
        const product = productById.get(item.productId);
        throw new BackendError(
          "OUT_OF_STOCK",
          `Недостаточное количество товара ${product?.title ?? item.productId} на складе`,
          { productId: item.productId },
        );
      }

      return {
        orderId: `order-${Date.now()}`,
        acceptedAt: new Date().toISOString(),
        total: snapshot.total,
      };
    },
  };
};

export const fakeBackend = createFakeBackend();
