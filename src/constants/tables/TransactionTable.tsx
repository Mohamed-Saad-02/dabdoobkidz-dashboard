import { Link } from "react-router-dom";

import { Item } from "../../types/Order";
import { Button, Typography } from "antd";
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
    title : "Shipping Fees",
    dataIndex: "shippingFees",

  },
  {
    title : "Payment Method",
    dataIndex: "paymentMethod",
  },
  {
    title: "Payment Status",
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
      if (record.orderStatus === "Cancelled") {
        return <Status status="error" text={record.orderStatus} />;
      }

      if (record.orderStatus === "Initiated") {
        return <Status status="info" text={record.orderStatus} />;
      }

      if (record.orderStatus === "Refunded") {
        return <Status status="success" text={record.orderStatus} />;
      }

      return <span>{record.orderStatus}</span>;
    },
    key: "delivery",
  },
  {
    title: "Shipping",
    render: (record: { shippingStatus: string }) => {
      console.log(record.shippingStatus , "shippingStatusalldat");

      if (record.shippingStatus === "Delivered") {
        console.log(record.shippingStatus , "shippingStatus");

        return <Status status="success" text={record.shippingStatus} />;
      }
      if (record.shippingStatus === "Pending") {
        console.log(record.shippingStatus , "shippingStatus");
        return <Status status="warning" text={record.shippingStatus} />;
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
    title: "Ship",
    render: (record: { id: number; shippingStatus: string }) => (
      <div>
        {record.shippingStatus === "Shipped" || record.shippingStatus === "Delivered" ? (
          <Button className="!bg-white border-none !p-[0px]" disabled>
            <Title className="!text-primary !mb-0 " level={5}>
              Ship
            </Title>
          </Button>
        ) : (
          <Link to={`/ship/${record.id}`}>
            <Title className="!text-primary !mb-0" level={5}>
              Ship
            </Title>
          </Link>
        )}
      </div>
    ),
    width: 100,
  },
  {
    title: "Date",
    render: (record: { createdAt: string }) => {
      const date = new Date(record.createdAt);
      return <span>{date.toDateString()}</span>;
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
