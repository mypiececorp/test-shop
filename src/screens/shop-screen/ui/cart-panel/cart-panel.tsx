import { AlertCircle, CheckCircle2, PackageCheck, ShoppingCart } from "lucide-react-native";
import { View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import { observer } from "mobx-react-lite";

import type { CartStore } from "@/entities/cart/model/cart-store";
import { formatMoney } from "@/shared/lib/format";

type CartPanelProps = {
  cartStore: CartStore;
  onCheckoutPress: () => void;
};

export const CartPanel = observer(({ cartStore, onCheckoutPress }: CartPanelProps) => {
  const latestAnalytics = cartStore.analyticsLog[0];
  const AnalyticsIcon = latestAnalytics?.status === "failed" ? AlertCircle : CheckCircle2;
  const analyticsColor = latestAnalytics?.status === "failed" ? "#b2552f" : "#1f7a4d";

  return (
    <Surface
      mode="elevated"
      style={{
        padding: 16,
        gap: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#fff",
        boxShadow: "0 -2px 12px rgba(30, 45, 36, 0.08)",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#e6f3ea",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingCart size={21} color="#1f7a4d" />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" selectable>
              {formatMoney(cartStore.total)}
            </Text>
            <Text variant="bodySmall" selectable style={{ color: "#667069", fontVariant: ["tabular-nums"] }}>
              Позиций: {cartStore.positionsCount}
            </Text>
          </View>
        </View>
        <Button
          mode="contained"
          disabled={!cartStore.canCheckout}
          onPress={onCheckoutPress}
          icon={() => <PackageCheck size={18} color={cartStore.canCheckout ? "#fff" : "#8a928a"} />}
        >
          Заказать
        </Button>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {latestAnalytics ? <AnalyticsIcon size={16} color={analyticsColor} /> : null}
        <Text variant="bodySmall" selectable style={{ color: latestAnalytics ? analyticsColor : "#68736c", flex: 1 }}>
          {latestAnalytics?.message ?? "Изменения корзины будут отправляться в аналитику"}
        </Text>
      </View>

      {!cartStore.canCheckout && cartStore.checkoutBlockReason ? (
        <Text variant="bodySmall" selectable style={{ color: "#8a5a1f" }}>
          {cartStore.checkoutBlockReason}
        </Text>
      ) : null}
    </Surface>
  );
});
