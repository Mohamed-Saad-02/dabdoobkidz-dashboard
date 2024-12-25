import { Table } from "antd";
import { TableProps } from "antd/es/table";

interface ReusableTableProps<T> extends TableProps<T> {
  columns: TableProps<T>["columns"];
  dataSource: TableProps<T>["dataSource"];
  setSelectedRowData?: (data: T[]) => void;
  selectedRowKeys?: React.Key[];
  paginationConfig?: {
    page: number;
    total: number;
    onChange: (page: number) => void;
  };
}

const ReusableTable = <T extends object>({
  columns,
  dataSource,
  setSelectedRowData,
  selectedRowKeys = [],
  paginationConfig,
  scroll,
  ...rest
}: ReusableTableProps<T>) => {
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => {
      setSelectedRowData && setSelectedRowData(selectedRows);
    },
  };

  return (
    <div>
      <Table
        className="font-[400]"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        pagination={paginationConfig}
        scroll={scroll}
        rowKey={(record: T) => {
          return (record as { id?: string }).id || "defaultKey";
        }}
        rowClassName={() => ""}
        {...rest}
      />
    </div>
  );
};

export default ReusableTable;
