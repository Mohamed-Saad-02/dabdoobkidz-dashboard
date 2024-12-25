import { FileAddOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getPlans } from "../../../api/plans";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";
import ReusableTable from "../../../components/ui/Table";
import { PlansTable } from "../../../constants/tables/PlansTable";
import useDebounce from "../../../hooks/useDebounceHook";

export default function Plans() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState();
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
    order: "desc",
    query: `${debounceSearch}`,
  };
  const filterParams = Object.keys(params).reduce((acc, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});
  const { data: plansData, isLoading } = useQuery(
    ["plans", filterParams],
    () => {
      return getPlans(filterParams);
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
    <div className="flex flex-col bg-white p-4 gap-4 rounded-[10px]">
      <Header title="Plans" />
      <div className="flex justify-between items-center ">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search Plans"
          className="w-[300px]"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            navigate("/add-plan");
          }}
          className="p-4"
          icon={<FileAddOutlined />}
          type="primary"
        >
          Add Plan
        </Button>
      </div>

      <ReusableTable
        paginationConfig={paginationConfig}
        dataSource={plansData?.plans}
        columns={PlansTable}
      />
    </div>
  );
}
