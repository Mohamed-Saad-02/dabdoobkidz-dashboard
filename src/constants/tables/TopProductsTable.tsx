import { Typography } from "antd";

const { Title } = Typography;
export const TopProductsTableData = [
  {
    title: "Products",
    render: (record: { name: string; image: string }) => (
      <div className="flex">
        <Title className="!mb-0" level={5}>
          {record.name}
        </Title>
      </div>
    ),
  },
  {
    title: "Sold",
    dataIndex: "item_count",
  },
];
