import { Button, Input } from "antd";
import Header from "../../components/Header";
import { SearchOutlined, ShopOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { getCoupons } from "../../api/coupons";
import ReusableTable from "../../components/ui/Table";
import { CouponsTable } from "../../constants/tables/CouponsTable";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loading from "../../components/Loading";
import useDebounce from "../../hooks/useDebounceHook";

export default function Coupons() {
  const [currentPage, setCurrentPage] = useState();
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);
  const [paginationConfig, setPaginationConfig] = useState({
    current: currentPage,
    pageSize: 10,
    total: 0,
    onChange: (page: number) => {
      setCurrentPage(page);
    },
  });
  const params = {
    page: currentPage,
    items: 10,
    query: debounceSearch,
    order: "desc",
  };
  const filterParams = Object.keys(params).reduce((acc, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});
  const navigate = useNavigate();
  const { data: coupons, isLoading } = useQuery(
    ["coupons", filterParams],
    () => getCoupons(filterParams),
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
  if (isLoading)
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  return (
    <div className="flex flex-col gap-6 bg-white p-4 rounded-[10px]">
      <div className="flex justify-between items-center">
        <Header title="Coupons" />

        <div className="flex gap-[12px]">
        <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search Coupons"
            className="w-[300px]"
            onChange={(e) => setSearch(e.target.value)}
          />
        <Button
          onClick={() => navigate("/add-coupons")}
          className="rounded-[10px] p-[16px] "
          icon={<ShopOutlined />}
          type="primary"
        >
          Add Coupon
        </Button>

   
        </div>
      </div>
      <ReusableTable
        dataSource={coupons?.promocodes}
        pagination={paginationConfig}
        columns={CouponsTable}
      />
    </div>
  );
}
