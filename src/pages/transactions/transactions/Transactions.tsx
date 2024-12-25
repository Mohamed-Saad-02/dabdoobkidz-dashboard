import { SearchOutlined } from "@ant-design/icons";
import { Button, Collapse, Dropdown, Input, Radio, Select } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { getTransactions } from "../../../api/transaction";
import { Filter, Sort } from "../../../assets/common";
import Header from "../../../components/Header";
import ReusableTable from "../../../components/ui/Table";
import { transactionTable } from "../../../constants/tables/TransactionTable";

import Loading from "../../../components/Loading";
import useDebounce from "../../../hooks/useDebounceHook";
export default function Transactions() {
  const [order, setOrder] = useState("desc");
  const [orderStatusFilter, setOrderStatusFilter] = useState();
  const [orderShippingFilter, setOrderShippingFilter] = useState();
  const [currentPage, setCurrnetPage] = useState(1);
  const [searchBy, setSearchBy] = useState("phone");
  const [search, setSearch] = useState("");
  const debounceSerach = useDebounce(search, 500);
  const params = {
    page: currentPage,
    order: order,
    items: 10,
    orderStatus: orderStatusFilter,
    shippingStatus: orderShippingFilter,
    [`${searchBy}`]: debounceSerach,
  };

  const filterParams = Object.keys(params).reduce((acc, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});
  const [paginationConfig, setPaginationConfig] = useState({
    current: currentPage,
    pageSize: 10,
    total: 0,
    onChange: (page: number) => {
      setCurrnetPage(page);
    },
  });
  const { data: transactions, isLoading } = useQuery(
    ["transactions", filterParams],
    () => getTransactions(filterParams),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setPaginationConfig((prev) => ({
          ...prev,
          total: data.metadata.count,
          current: currentPage,
        }));
      },
    }
  );
  const items = [
    {
      label: "Order Status",
      children: (
        <Radio.Group
          onChange={(e) => setOrderStatusFilter(e.target.value)}
          className="flex flex-col gap-4"
        >
          <Radio value="Pending">Pending</Radio>
          <Radio value="Paid">Paid</Radio>
          <Radio value="Initiated">Initiated</Radio>
          <Radio value="Completed">Completed</Radio>
          <Radio value="Refunded">Refunded</Radio>
          <Radio value="Cancelled">Cancelled</Radio>
          <Radio value="Failed">Failed</Radio>
        </Radio.Group>
      ),
    },
    {
      label: "Shipping Status",
      children: (
        <Radio.Group
          onChange={(e) => setOrderShippingFilter(e.target.value)}
          className="flex flex-col gap-4"
        >
          <Radio value="Pending">Pending</Radio>
          <Radio value="Delivered">Delivered</Radio>
          <Radio value="Cancelled">Cancelled</Radio>
          <Radio value="Returned">Returned</Radio>
        </Radio.Group>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-white p-4 gap-4 rounded-md">
      <Header title="Transactions List" />
      <div className="flex justify-between items-center p-4">
        <div className="flex gap-[12px]">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder={`Enter ${searchBy}`}
            className="w-[300px]"
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-4 items-center">
            <span>Search By:</span>
            <Select
              defaultValue={searchBy}
              className="w-[200px]"
              onChange={(e) => setSearchBy(e)}
              options={[
                { label: "Phone", value: "phone" },
                { label: "City", value: "city" },
                { label: "Governorate", value: "governorate" },
                { label: "Name", value: "customer" },
                { label: "Address", value: "address" },
                { label: "Order Refrence", value: "reference" },
              ]}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Dropdown
            trigger={["click"]}
            dropdownRender={(menu) => (
              <Radio.Group
                onChange={(e) => setOrder(e.target.value)}
                className="flex flex-col gap-4 bg-white mt-5"
              >
                <Radio value="asc">Ascending</Radio>
                <Radio value="desc">Descending </Radio>
              </Radio.Group>
            )}
          >
            <Button
              icon={<img src={Sort} />}
              className="bg-background font-semibold"
              iconPosition="end"
            >
              Sort
            </Button>
          </Dropdown>
          <Dropdown
            trigger={["click"]}
            dropdownRender={(menu) => (
              <div className="bg-white p-4 flex flex-col">
                <Collapse items={items} />
              </div>
            )}
          >
            <Button
              iconPosition="end"
              icon={<img src={Filter} />}
              className="bg-background hover:bg-background font-semibold"
            >
              Filters
            </Button>
          </Dropdown>
        </div>
      </div>
      <ReusableTable
        dataSource={transactions?.data}
        columns={transactionTable}
        paginationConfig={paginationConfig}
      />
    </div>
  );
}
