import { Minus, Package, Plus, Warehouse } from "lucide-react-native";
import { memo } from "react";
import { Pressable, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { observer } from "mobx-react-lite";

import type { CartStore } from "@/entities/cart/model/cart-store";
import type { Product } from "@/entities/product/model/types";
import { formatMoney } from "@/shared/lib/format";

type ProductListItemProps = {
  product: Product;
  cartStore: CartStore;
};

const imageColors = ["#d9ead3", "#cfe2f3", "#fce5cd", "#eadcf8", "#d0e0e3", "#f4cccc"];

const ProductListItemComponent = ({ product, cartStore }: ProductListItemProps) => {
  return (
    <Surface
      mode="flat"
      style={{
        minHeight: 92,
        borderRadius: 16,
        borderCurve: "continuous",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#edf1ea",
        padding: 12,
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 58,
          height: 58,
          borderRadius: 14,
          borderCurve: "continuous",
          backgroundColor: imageColors[product.imageSeed],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Package size={23} color="#22312a" />
      </View>

      <View style={{ flex: 1, gap: 3 }}>
        <Text variant="titleSmall" numberOfLines={1}>
          {product.title}
        </Text>
        <Text variant="bodySmall" numberOfLines={2} style={{ color: "#68736c" }}>
          {product.description}
        </Text>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Text variant="titleSmall" selectable style={{ color: "#1f7a4d" }}>
            {formatMoney(product.price)}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <Warehouse size={12} color="#778078" />
            <Text variant="labelSmall" selectable style={{ color: "#778078" }}>
              {product.stock}
            </Text>
          </View>
        </View>
      </View>

      <ProductQuantityControl cartStore={cartStore} product={product} />
    </Surface>
  );
};

const ProductQuantityControl = observer(({ cartStore, product }: ProductListItemProps) => {
  const quantity = cartStore.getProductQuantity(product.id);
  const isMaxQuantity = quantity >= product.stock;

  return (
    <View style={{ width: 92, alignItems: "flex-end", gap: 6 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Добавить ${product.title}`}
        disabled={isMaxQuantity}
        onPress={() => cartStore.addProduct(product)}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: isMaxQuantity ? "#d8ded8" : "#1f7a4d",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plus size={20} color="#fff" />
      </Pressable>

      {quantity > 0 ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Убрать ${product.title}`}
            onPress={() => cartStore.removeProduct(product.id)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "#e9eee8",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Minus size={16} color="#22312a" />
          </Pressable>
          <Text variant="labelLarge" selectable style={{ minWidth: 22, textAlign: "center", fontVariant: ["tabular-nums"] }}>
            {quantity}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

export const ProductListItem = memo(ProductListItemComponent);
