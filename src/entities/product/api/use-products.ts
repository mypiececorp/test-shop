import { useInfiniteQuery } from "@tanstack/react-query";

import { fakeBackend } from "@/shared/api/fake-backend";

export const PRODUCTS_PAGE_SIZE = 20;

type UseProductsParams = {
  query: string;
};

export const useProducts = ({ query }: UseProductsParams) =>
  useInfiniteQuery({
    queryKey: ["products", query.trim().toLowerCase()],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fakeBackend.fetchProducts({
        limit: PRODUCTS_PAGE_SIZE,
        offset: pageParam,
        query,
      }),
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });
