import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getBrands } from "../../api/brands";
import Header from "../../components/Header";
import ReusableTable from "../../components/ui/Table";
import { BrandsTable } from "../../constants/tables/BrandsTable";
import useDebounce from "../../hooks/useDebounceHook";

export default function Brands() {
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
  const { data: brands } = useQuery(
    ["brands", filterParams],
    () => {
      return getBrands(filterParams);
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
  return (
    <div className="flex flex-col bg-white p-6 gap-6 rounded-md">
      <div className="flex justify-between">
        <Header title="Brands" />
        <Button
          onClick={() => {
            navigate("/add-brand");
          }}
          type="primary"
        >
          Add Brand
        </Button>
      </div>

      <Input
        prefix={<SearchOutlined className="text-gray-400" />}
        placeholder="Search Banner"
        className="w-[300px] "
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />

      <ReusableTable dataSource={brands} columns={BrandsTable} />
    </div>
  );
}
