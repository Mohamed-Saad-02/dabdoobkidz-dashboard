import ReusableTable from "../ui/Table";

import { TopProductsTableData } from "../../constants/tables/TopProductsTable";

export default function TopProductsTable({ data }: any) {
  return (
    <ReusableTable
      dataSource={data}
      columns={TopProductsTableData}
      pagination={false}
    />
  );
}
