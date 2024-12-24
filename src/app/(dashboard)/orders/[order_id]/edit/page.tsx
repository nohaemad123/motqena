import OrderFormPage from "@/components/pages/orders/OrderFormPage";
import React from "react";

interface IOrderViewProps {
  params: {
    order_id: string;
  };
}

export default function page({ params: { order_id } }: Readonly<IOrderViewProps>) {
  return <OrderFormPage orderId={order_id} />;
}
