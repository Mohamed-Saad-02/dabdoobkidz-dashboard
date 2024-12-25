import { Link } from "react-router-dom";

import { Item } from "../../types/Order";
import { Typography } from "antd";
import Status from "../../components/common/Status";

const { Title } = Typography;

export const transactionTable = [
  {
    title: "Transaction Number",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Customer Name",
    render: (record: { name: string }) => {
      return <span>{record?.name}</span>;
    },
    key: "customer",
  },
  {
    title: "Total",
    render: (record: { itemsCount: number }) => {
      return <span>{record?.itemsCount}</span>;
    },
    key: "total",
  },
  {
    title: "Payment Amount",
    render: (record: { totalPrice: number }) => {
      return <span>{record.totalPrice}</span>;
    },
  },
  {
    title: "Status",
    render: (record: { orderStatus: string }) => {
      if (record.orderStatus === "Pending") {
        return <Status status="warning" text={record.orderStatus} />;
      }
      if (record.orderStatus === "Paid") {
        return <Status status="success" text={record.orderStatus} />;
      }
      if (record.orderStatus === "Failed") {
        return <Status status="error" text={record.orderStatus} />;
      }
      if (record.orderStatus === "Refunded") {
        return <Status status="pending" text={record.orderStatus} />;
      }
      if (record.orderStatus === "Returned") {
        return <Status status="info" text={record.orderStatus} />;
      }
      return <Status status={record.orderStatus} text={record.orderStatus} />;
    },
    key: "status",
  },
  {
    title: "Delivery",
    render: (record: { orderStatus: string }) => {
      if (record.orderStatus === "Pending") {
        return <Status status="warning" text={record.orderStatus} />;
      }
      if (record.orderStatus === "Delivered ") {
        return <Status status="success" text={record.orderStatus} />;
      }
      if (record.orderStatus === "Failed") {
        return <Status status="error" text={record.orderStatus} />;
      }

      if (record.orderStatus === "Shipped") {
        return <Status status="info" text={record.orderStatus} />;
      }

      return <span>{record.orderStatus}</span>;
    },
    key: "delivery",
  },
  {
    title: "Shipping",
    render: (record: { shippingStatus: string }) => {
      if (record.shippingStatus === "Pending") {
        return <Status status="warning" text={record.shippingStatus} />;
      }
      if (record.shippingStatus === "Delivered ") {
        return <Status status="success" text={record.shippingStatus} />;
      }
      if (record.shippingStatus === "Failed") {
        return <Status status="error" text={record.shippingStatus} />;
      }

      if (record.shippingStatus === "Shipped") {
        return <Status status="info" text={record.shippingStatus} />;
      }
    },
    key: "date",
  },
  {
    title: "Details",
    render: (record: { id: string }) => (
      <Link to={`/transactions/${record.id}`}>
        <Title className="!text-primary !mb-0" level={5}>
          Details
        </Title>
      </Link>
    ),
    key: "date",
  },
];
