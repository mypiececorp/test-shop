import { makeAutoObservable } from "mobx";

import type { Product } from "@/entities/product/model/types";
import type { AnalyticsDispatchRecord, CartSnapshot } from "@/entities/order/model/types";
import { MIN_ORDER_AMOUNT } from "@/shared/api/fake-backend";

export type CartLine = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  stock: number;
};

export class CartStore {
  private lines = new Map<string, CartLine>();
  selectedOptionIds: string[] = [];
  analyticsLog: AnalyticsDispatchRecord[] = [];
  revision = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get items() {
    return Array.from(this.lines.values());
  }

  get positionsCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get total() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get canCheckout() {
    return this.items.length > 0 && this.total >= MIN_ORDER_AMOUNT;
  }

  get checkoutBlockReason() {
    if (this.items.length === 0) {
      return "Корзина пуста";
    }

    if (this.total < MIN_ORDER_AMOUNT) {
      return `Минимальная сумма заказа ${MIN_ORDER_AMOUNT} ₽`;
    }

    return null;
  }

  get analyticsSnapshot(): CartSnapshot {
    return {
      items: this.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      optionIds: [...this.selectedOptionIds],
      total: this.total,
    };
  }

  getProductQuantity(productId: string) {
    return this.lines.get(productId)?.quantity ?? 0;
  }

  addProduct(product: Product) {
    const current = this.lines.get(product.id);

    if (current) {
      this.lines.set(product.id, {
        ...current,
        quantity: Math.min(current.quantity + 1, product.stock),
      });
    } else {
      this.lines.set(product.id, {
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        stock: product.stock,
      });
    }

    this.touch();
  }

  removeProduct(productId: string) {
    const current = this.lines.get(productId);

    if (!current) {
      return;
    }

    if (current.quantity <= 1) {
      this.lines.delete(productId);
    } else {
      this.lines.set(productId, { ...current, quantity: current.quantity - 1 });
    }

    this.touch();
  }

  removeLine(productId: string) {
    if (this.lines.delete(productId)) {
      this.touch();
    }
  }

  toggleOption(optionId: string) {
    if (this.selectedOptionIds.includes(optionId)) {
      this.selectedOptionIds = this.selectedOptionIds.filter((id) => id !== optionId);
    } else {
      this.selectedOptionIds = [...this.selectedOptionIds, optionId];
    }

    this.touch();
  }

  clear() {
    this.lines.clear();
    this.selectedOptionIds = [];
    this.touch();
  }

  recordAnalyticsResult(record: AnalyticsDispatchRecord) {
    this.analyticsLog = [record, ...this.analyticsLog].slice(0, 8);
  }

  private touch() {
    this.revision += 1;
  }
}
