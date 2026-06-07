import type { OrderOption } from "./types";

export const orderOptions: OrderOption[] = [
  {
    id: "leave-at-door",
    title: "Оставить у двери",
    description: "Курьер оставит заказ у входной двери.",
  },
  {
    id: "call-before-delivery",
    title: "Позвонить по доставке",
    description: "Курьер заранее позвонит перед приездом.",
  },
  {
    id: "no-contact",
    title: "Бесконтактная доставка",
    description: "Передача без личного контакта.",
  },
  {
    id: "need-change",
    title: "Нужна сдача",
    description: "Курьер подготовит сдачу с наличных.",
  },
];
