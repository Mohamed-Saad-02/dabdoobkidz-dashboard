import { Button } from "antd";
import Status from "../../components/common/Status";
import { Link } from "react-router-dom";

export const RefundRequests = [
  {
    title: "Transaction Number",
    render: (record: { orderReference: string }) => (
      <span>{record?.orderReference}</span>
    ),
  },
  {
    title: "Customer Name",
    render: (record: { customer: string }) => <span>{record?.customer}</span>,
  },
  {
    title: "Product Purchased",
    render: (record: { products: string[] }) => <span>{record?.products[0]}</span>,
  },
  {
    title: "Date",
    render: (record: { createdAt: string }) => {
      const date = new Date(record?.createdAt);
      return <span>{date.toDateString()}</span>;
    },
  },

  {
    title: "phone",
    render: (record: { phone: string }) => (
      <span>{record?.phone || "N/A"}</span>
    ),
  },
  {
    title: "Pament Amount",
    render: (record: { totalPrice: string }) => (
      <span>{record?.totalPrice}</span>
    ),
  },
  {
    title: "Status",
    render: (record: { status: string }) => {
      let status = "info";
      if (record?.status === "approved") {
        status = "success";
      } else if (record?.status === "rejected") {
        status = "error";
      }
      return <Status status={status} text={record?.status} />;
    },
  },
  {
    title: "Action",
    render: (record: { id: number }) => {
      return (
        <Link className="text-primary" to={`/refund/${record.id}`}>
          Details
        </Link>
      );
    },
  },
];
