import { memo, ReactNode, useCallback, useMemo, useState } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { ActivityIndicator, Button, Searchbar, Text } from "react-native-paper";
import { PackageSearch, Search, ShoppingBasket, X } from "lucide-react-native";

import type { CartStore } from "@/entities/cart/model/cart-store";
import { useProducts } from "@/entities/product/api/use-products";
import type { Product } from "@/entities/product/model/types";
import { ProductListItem } from "@/features/product/ui/product-list-item";
import { ScreenState } from "@/shared/ui";

const PRODUCT_ROW_HEIGHT = 104;

const keyExtractor = (item: Product) => item.id;

const getItemLayout = (_: ArrayLike<Product> | null | undefined, index: number) => ({
  length: PRODUCT_ROW_HEIGHT,
  offset: PRODUCT_ROW_HEIGHT * index,
  index,
});

type ProductCatalogProps = {
  cartStore: CartStore;
  headerSlot?: ReactNode;
};

const ProductCatalogComponent = ({ cartStore, headerSlot }: ProductCatalogProps) => {
  const [search, setSearch] = useState("");
  const productsQuery = useProducts({ query: search });
  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = productsQuery;

  const products = useMemo(
    () => productsData?.pages.flatMap((page) => page.items) ?? [],
    [productsData],
  );
  const totalProducts = productsData?.pages[0]?.total ?? 0;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => <ProductListItem product={item} cartStore={cartStore} />,
    [cartStore],
  );

  const handleResetSearch = useCallback(() => {
    setSearch("");
  }, []);

  const listHeader = useMemo(
    () => (
      <View style={{ gap: 16, paddingBottom: 4 }}>
        <View
          style={{
            backgroundColor: "#22312a",
            borderRadius: 20,
            borderCurve: "continuous",
            padding: 16,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: "#e6f3ea",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBasket size={22} color="#1f7a4d" />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" selectable style={{ color: "#fff" }}>
                Магазин
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <HeaderBadge label="Минимум 1000 ₽" />
            <HeaderBadge label="Аналитика корзины" />
          </View>
        </View>
        <Searchbar
          value={search}
          onChangeText={setSearch}
          placeholder="Поиск товара"
          icon={() => <Search size={20} color="#68736c" />}
          clearIcon={() => <X size={20} color="#68736c" />}
          inputStyle={{ minHeight: 0 }}
          style={{
            borderRadius: 16,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#e2e8df",
          }}
        />
        {headerSlot}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <PackageSearch size={18} color="#335c81" />
            <Text variant="titleMedium" selectable>
              Товары
            </Text>
          </View>
          <Text variant="bodyMedium" selectable style={{ color: "#68736c", fontVariant: ["tabular-nums"] }}>
            Всего: {totalProducts}
          </Text>
        </View>
      </View>
    ),
    [headerSlot, search, totalProducts],
  );

  const listFooter = useMemo(
    () =>
      isFetchingNextPage ? (
        <View style={{ paddingVertical: 18, alignItems: "center", gap: 8 }}>
          <ActivityIndicator animating />
          <Text variant="bodySmall" selectable style={{ color: "#68736c" }}>
            Загружаем ещё 20 товаров
          </Text>
        </View>
      ) : null,
    [isFetchingNextPage],
  );

  const listEmpty = useMemo(
    () => (
      <View style={{ padding: 24, alignItems: "center", gap: 10 }}>
        <Text variant="titleMedium" selectable>
          Ничего не найдено
        </Text>
        <Button mode="contained-tonal" onPress={handleResetSearch}>
          Сбросить поиск
        </Button>
      </View>
    ),
    [handleResetSearch],
  );

  if (isLoading) {
    return <ScreenState title="Загружаем каталог" message="Подготавливаем 1000 товаров." />;
  }

  if (isError) {
    return (
      <ScreenState
        title="Каталог недоступен"
        message="Не удалось получить список товаров."
        actionLabel="Повторить"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.45}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      initialNumToRender={14}
      maxToRenderPerBatch={16}
      windowSize={9}
      removeClippedSubviews
      getItemLayout={getItemLayout}
      contentContainerStyle={{ padding: 14, paddingBottom: 18, gap: 10 }}
      ListHeaderComponent={listHeader}
      ListFooterComponent={listFooter}
      ListEmptyComponent={listEmpty}
    />
  );
};

export const ProductCatalog = memo(ProductCatalogComponent);

const HeaderBadge = ({ label }: { label: string }) => (
  <View
    style={{
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.12)",
      paddingHorizontal: 10,
      paddingVertical: 5,
    }}
  >
    <Text variant="labelMedium" selectable style={{ color: "#f4f7f3" }}>
      {label}
    </Text>
  </View>
);
