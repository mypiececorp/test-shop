export type OrderOption = {
  id: string;
  title: string;
  description: string;
};

export type CartItemSnapshot = {
  productId: string;
  quantity: number;
  price: number;
};

export type CartSnapshot = {
  items: CartItemSnapshot[];
  optionIds: string[];
  total: number;
};

export type AnalyticsStatus = "success" | "failed";

export type AnalyticsDispatchRecord = {
  id: string;
  status: AnalyticsStatus;
  message: string;
  createdAt: string;
  snapshot: CartSnapshot;
};

export type OrderSubmissionResult = {
  orderId: string;
  acceptedAt: string;
  total: number;
};
