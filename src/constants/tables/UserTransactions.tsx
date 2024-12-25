import Status from "../../components/common/Status";

export const UserTransactionsTable = [
  {
    title: "Order Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Items",
    dataIndex: "itemsCount",
    key: "itemsCount",
  },
  {
    title: "Status",
    render: (record: { orderStatus: string }) => {
        let status = "";
        if (record.orderStatus === "Paid") {
          status = "success";
        } else if (record.orderStatus === "Pending") {
          status = "pending";
        } else if (record.orderStatus === "error") {
          status = "error";
        }
      return <Status status={status} text={record.orderStatus} />;
    },
    key: "orderStatus",
  },
  {
    title: "Total Price",
    dataIndex: "totalPrice",
    key: "totalPrice",
  },
  {
    title: "Shipping",
    dataIndex: "shippingFees",
    key: "shippingFees",
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
  },
  {
    title: "Payment Date",
    dataIndex: "purchaseDate",
    key: "updatedAt",
  },
];
