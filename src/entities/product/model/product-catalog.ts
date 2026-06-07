import type { Product } from "./types";

const categories = [
  "Кофе",
  "Чай",
  "Молоко",
  "Сыр",
  "Паста",
  "Рис",
  "Овощи",
  "Фрукты",
  "Хлеб",
  "Снеки",
];

const descriptors = [
  "фермерский",
  "классический",
  "премиальный",
  "органический",
  "домашний",
  "отборный",
  "свежий",
  "семейный",
];

export const PRODUCT_COUNT = 1000;

export const productsCatalog: Product[] = Array.from({ length: PRODUCT_COUNT }, (_, index) => {
  const idNumber = index + 1;
  const category = categories[index % categories.length];
  const descriptor = descriptors[index % descriptors.length];
  const price = 95 + ((index * 37) % 560);
  const stock = 2 + ((index * 13) % 24);

  return {
    id: `product-${idNumber}`,
    title: `${category} ${descriptor} #${idNumber}`,
    description: `Позиция каталога ${idNumber}, доступна для быстрой доставки.`,
    price,
    stock,
    imageSeed: index % 6,
  };
});

export const productById = new Map(productsCatalog.map((product) => [product.id, product]));
