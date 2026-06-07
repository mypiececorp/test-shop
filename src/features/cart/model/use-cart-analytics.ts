import { useMutation } from "@tanstack/react-query";
import { reaction } from "mobx";
import { useEffect } from "react";

import type { CartStore } from "@/entities/cart/model/cart-store";
import type { CartSnapshot } from "@/entities/order/model/types";
import { BackendError, fakeBackend } from "@/shared/api/fake-backend";

const toMessage = (error: unknown) => {
  if (error instanceof BackendError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Не удалось отправить событие аналитики";
};

export const useCartAnalytics = (cartStore: CartStore) => {
  const { mutate } = useMutation({
    mutationFn: (snapshot: CartSnapshot) => fakeBackend.sendAnalyticsEvent(snapshot),
  });

  useEffect(
    () =>
      reaction(
        () => cartStore.revision,
        () => {
          const snapshot = cartStore.analyticsSnapshot;
          const createdAt = new Date().toISOString();

          mutate(snapshot, {
            onSuccess: () => {
              cartStore.recordAnalyticsResult({
                id: `analytics-success-${createdAt}`,
                status: "success",
                message: "Событие аналитики отправлено",
                createdAt,
                snapshot,
              });
            },
            onError: (error) => {
              cartStore.recordAnalyticsResult({
                id: `analytics-failed-${createdAt}`,
                status: "failed",
                message: toMessage(error),
                createdAt,
                snapshot,
              });
            },
          });
        },
      ),
    [cartStore, mutate],
  );
};
