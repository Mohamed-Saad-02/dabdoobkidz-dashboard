import { useState } from "react";
import { useQuery } from "react-query";
import { getRefundRequests } from "../../api/transaction";
import Header from "../../components/Header";
import ReusableTable from "../../components/ui/Table";

import Loading from "../../components/Loading";
import { RefundRequests } from "../../constants/tables/RefundRequests";
import useDebounce from "../../hooks/useDebounceHook";
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
    ["refundRequests", filterParams],
    () => getRefundRequests(filterParams),
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
      <ReusableTable
        dataSource={transactions?.data}
        columns={RefundRequests}
        paginationConfig={paginationConfig}
      />
    </div>
  );
}
