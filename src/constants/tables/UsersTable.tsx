import { Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;
export const userTableColumns = [
  {
    title: "Name",
    render: (record: {
      firstName: string;
      lastName: string;
      email: string;
    }) => (
      <div>
        <Title className="!mb-0" level={5}>
          {record.firstName} {record.lastName}
        </Title>
        <p>{record.email}</p>
      </div>
    ),
    key: "name",
  },
  {
    title: "Registred",
    render: (record: { createdAt: string }) =>
      new Date(record.createdAt).toLocaleString(),
    key: "registered",
  },
  {
    title: "Phone Number",
    render: (record: { phoneNumber: string }) => {
      return record.phone || "N/A";
    },
    key: "phone number",
  },
  {
    title: "Last Activity",
    render: (record: { lastLogin: string }) =>
      new Date(record.lastLogin).toLocaleString(),
    key: "last login",
  },
  {
    title: "Spent",
    render: (record: { spent: number }) => {
      return record.spent || "N/A";
    },
    key: "spent",
  },
  {
    title: "Action",
    render: (record: { id: string }) => (
      <Link to={`/user/${record.id}`}>
        <Title className="!text-primary !mb-0" level={5}>
          Details
        </Title>
      </Link>
    ),
    key: "action",
  },
];
