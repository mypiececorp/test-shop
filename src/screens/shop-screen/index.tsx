import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Snackbar } from "react-native-paper";

import { useRootStore } from "@/shared/providers/root-store-provider";
import { useCartAnalytics } from "@/features/cart/model/use-cart-analytics";
import { useSubmitOrder } from "@/features/order/model/use-submit-order";
import { BackendError } from "@/shared/api/fake-backend";
import { CartPanel } from "./ui/cart-panel/cart-panel";
import { OrderConfirmationDialog } from "./ui/order-confirmation-dialog/order-confirmation-dialog";
import { OrderOptionsPanel } from "./ui/order-options-panel/order-options-panel";
import { ProductCatalog } from "./ui/product-catalog/product-catalog";

export const ShopScreen = () => {
  const { cartStore } = useRootStore();
  const {
    error: submitOrderError,
    isPending: isSubmitOrderPending,
    mutate: submitOrderMutate,
    reset: resetSubmitOrder,
  } = useSubmitOrder();
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useCartAnalytics(cartStore);

  const handleCheckoutPress = useCallback(() => {
    setConfirmVisible(true);
  }, []);

  const handleDismissOrder = useCallback(() => {
    resetSubmitOrder();
    setConfirmVisible(false);
  }, [resetSubmitOrder]);

  const handleDismissSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const orderOptionsSlot = useMemo(() => <OrderOptionsPanel cartStore={cartStore} />, [cartStore]);

  const handleConfirmOrder = useCallback(() => {
    submitOrderMutate(cartStore.analyticsSnapshot, {
      onSuccess: (result) => {
        setConfirmVisible(false);
        setSuccessMessage(`Заказ ${result.orderId} принят`);
        cartStore.clear();
      },
    });
  }, [cartStore, submitOrderMutate]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f7f4" }}>
      <ProductCatalog cartStore={cartStore} headerSlot={orderOptionsSlot} />

      <CartPanel cartStore={cartStore} onCheckoutPress={handleCheckoutPress} />

      <OrderConfirmationDialog
        visible={isConfirmVisible}
        cartStore={cartStore}
        isSubmitting={isSubmitOrderPending}
        error={(submitOrderError as BackendError | Error | null) ?? null}
        onDismiss={handleDismissOrder}
        onConfirm={handleConfirmOrder}
      />

      <Snackbar visible={Boolean(successMessage)} onDismiss={handleDismissSuccess} duration={3500}>
        {successMessage}
      </Snackbar>
    </View>
  );
};
