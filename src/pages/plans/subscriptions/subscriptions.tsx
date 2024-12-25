import { useState } from "react";
import { useQuery } from "react-query";
import { getSubscriptions } from "../../../api/subscriptions";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";
import ReusableTable from "../../../components/ui/Table";
import { SubscriptionTable } from "../../../constants/tables/SubscriptionTable";

export default function Subscriptions() {
  const [currentPage, setCurrentPage] = useState();
  const [paginationConfig, setPaginationConfig] = useState({
    current: currentPage,
    pageSize: 5,
    total: 0,
    onChange: (page: number) => {
      setCurrentPage(page);
    },
  });

  const params = {
    page: currentPage,
  };

  const filterParams = Object.keys(params).reduce((acc, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});
  const { data, isLoading } = useQuery(
    ["subscriptions", filterParams],
    () => {
      return getSubscriptions();
    },
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setPaginationConfig({
          ...paginationConfig,
          total: data?.metadata?.count,
          current: currentPage,
        });
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
    <div className="flex flex-col gap-4 p-4 bg-white rounded-md">
      <Header title="Subscriptions" />
      <ReusableTable
        dataSource={data?.subscriptions}
        pagination={paginationConfig}
        columns={SubscriptionTable}
      />
    </div>
  );
}
