import { render } from "react-dom";

export const discountConfirmationTable = [
  {
    title: "id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Product",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Quota",
    dataIndex: "stock",
    key: "quota",
  },
  {
    title: "price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
  },
  {
    title: "Discount Price",
    render: (record: {
      price: number;
      discount: number;
      discountType: string;
    }) => (
      <>
        {record.discountType === "percentage"
          ? record.price - (record.price * record.discount) / 100
          : record.price - record.discount}
      </>
    ),
    key: "discountType",
  },
];
