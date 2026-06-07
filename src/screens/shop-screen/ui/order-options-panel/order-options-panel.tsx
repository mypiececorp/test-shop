import {
  BellRing,
  DoorOpen,
  HandCoins,
  PackageCheck,
  Phone,
  ShieldCheck,
} from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { observer } from "mobx-react-lite";

import type { CartStore } from "@/entities/cart/model/cart-store";
import { orderOptions } from "@/entities/order/model/order-options";

type OrderOptionsPanelProps = {
  cartStore: CartStore;
};

const optionIcons = {
  "leave-at-door": DoorOpen,
  "call-before-delivery": Phone,
  "no-contact": ShieldCheck,
  "need-change": HandCoins,
};

export const OrderOptionsPanel = observer(({ cartStore }: OrderOptionsPanelProps) => (
  <View style={{ gap: 10 }}>
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <BellRing size={18} color="#335c81" />
        <Text variant="titleMedium" selectable>
          Опции заказа
        </Text>
      </View>
      <Text variant="labelMedium" selectable style={{ color: "#68736c", fontVariant: ["tabular-nums"] }}>
        {cartStore.selectedOptionIds.length}/{orderOptions.length}
      </Text>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingRight: 14 }}
      keyboardShouldPersistTaps="handled"
    >
      {orderOptions.map((option) => (
        <OrderOptionChip
          key={option.id}
          icon={optionIcons[option.id as keyof typeof optionIcons] ?? PackageCheck}
          title={option.title}
          selected={cartStore.selectedOptionIds.includes(option.id)}
          onPress={() => cartStore.toggleOption(option.id)}
        />
      ))}
    </ScrollView>
  </View>
));

type OrderOptionChipProps = {
  icon: typeof PackageCheck;
  title: string;
  selected: boolean;
  onPress: () => void;
};

const OrderOptionChip = ({ icon: Icon, title, selected, onPress }: OrderOptionChipProps) => (
  <Pressable
    accessibilityRole="checkbox"
    accessibilityState={{ checked: selected }}
    accessibilityLabel={title}
    onPress={onPress}
    style={{
      width: 132,
      minHeight: 62,
      borderRadius: 18,
      borderCurve: "continuous",
      backgroundColor: selected ? "#e6f3ea" : "#fff",
      borderWidth: 1,
      borderColor: selected ? "#1f7a4d" : "#dfe5dd",
      padding: 10,
      gap: 7,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: selected ? "#1f7a4d" : "#eef3ec",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={14} color={selected ? "#fff" : "#335c81"} />
      </View>
      {selected ? <PackageCheck size={15} color="#1f7a4d" /> : null}
    </View>
    <Text variant="titleSmall" numberOfLines={2} style={{ color: "#22312a", lineHeight: 17 }}>
      {title}
    </Text>
  </Pressable>
);
