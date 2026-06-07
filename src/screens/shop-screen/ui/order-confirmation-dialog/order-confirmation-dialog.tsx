import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { observer } from "mobx-react-lite";

import type { CartStore } from "@/entities/cart/model/cart-store";
import { orderOptions } from "@/entities/order/model/order-options";
import type { BackendError } from "@/shared/api/fake-backend";
import { formatMoney } from "@/shared/lib/format";
import { AppDialog } from "@/shared/ui";

type OrderConfirmationDialogProps = {
  visible: boolean;
  cartStore: CartStore;
  isSubmitting: boolean;
  error: BackendError | Error | null;
  onDismiss: () => void;
  onConfirm: () => void;
};

export const OrderConfirmationDialog = observer(
  ({ visible, cartStore, isSubmitting, error, onDismiss, onConfirm }: OrderConfirmationDialogProps) => {
    if (!visible) {
      return null;
    }

    const selectedOptions = orderOptions.filter((option) => cartStore.selectedOptionIds.includes(option.id));

    return (
      <AppDialog
        visible={visible}
        title="Подтвердите заказ"
        onDismiss={isSubmitting ? undefined : onDismiss}
        actions={
          <>
            <Button disabled={isSubmitting} onPress={onDismiss}>
              Назад
            </Button>
            <Button mode="contained" loading={isSubmitting} disabled={isSubmitting} onPress={onConfirm}>
              Подтвердить
            </Button>
          </>
        }
      >
        <View style={{ gap: 8 }}>
          <Text variant="titleSmall" selectable>
            Товары
          </Text>
          {cartStore.items.map((item) => (
            <View key={item.productId} style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <Text variant="bodyMedium" numberOfLines={2} style={{ flex: 1 }}>
                {item.title} x {item.quantity}
              </Text>
              <Text variant="bodyMedium" selectable style={{ fontVariant: ["tabular-nums"] }}>
                {formatMoney(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="titleSmall" selectable>
            Опции
          </Text>
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <Text key={option.id} variant="bodyMedium" selectable>
                {option.title}
              </Text>
            ))
          ) : (
            <Text variant="bodyMedium" selectable style={{ color: "#68736c" }}>
              Без дополнительных опций
            </Text>
          )}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <Text variant="titleMedium" selectable>
            Итого
          </Text>
          <Text variant="titleMedium" selectable style={{ color: "#1f7a4d", fontVariant: ["tabular-nums"] }}>
            {formatMoney(cartStore.total)}
          </Text>
        </View>

        {error ? (
          <Text variant="bodyMedium" selectable style={{ color: "#b2552f" }}>
            {error.message}
          </Text>
        ) : null}
      </AppDialog>
    );
  },
);
