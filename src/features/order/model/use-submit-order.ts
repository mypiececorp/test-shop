import { useMutation } from "@tanstack/react-query";

import type { CartSnapshot } from "@/entities/order/model/types";
import { fakeBackend } from "@/shared/api/fake-backend";

export const useSubmitOrder = () =>
  useMutation({
    mutationFn: (snapshot: CartSnapshot) => fakeBackend.submitOrder(snapshot),
  });
