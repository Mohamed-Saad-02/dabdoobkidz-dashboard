import { Button, Dropdown, Radio } from "antd";

import { FileAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getFlashsales } from "../../api/flashsales";
import { Filter } from "../../assets/common";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import ReusableTable from "../../components/ui/Table";
import { flashSaleTable } from "../../constants/tables/FlashSaleTable";
import useDebounce from "../../hooks/useDebounceHook";

export default function FlashSale() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState();
  const [status, setStatus] = useState();
  const debounceSearch = useDebounce(search, 500);
  const [paginationConfig, setPaginationConfig] = useState({
    current: currentPage,
    pageSize: 10,
    total: 0,
    onChange: (page: number) => {
      setCurrentPage(page);
    },
  });
  const params: any = {
    page: currentPage,
    items: 10,
    order: "desc",
    status,
    query: `${debounceSearch}`,
  };
  const filterParams = Object.keys(params).reduce((acc: any, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});

  const { data, isLoading } = useQuery(
    ["flashsales", filterParams],
    () => getFlashsales(filterParams),
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
    <div className="flex flex-col p-4 bg-white rounded-md">
      <Header title="List Flash Sale" />
      <div className="flex justify-end items-center p-4 gap-4">
        <Dropdown
          trigger={["click"]}
          dropdownRender={(menu) => (
            <Radio.Group
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              className="flex flex-col gap-[12px] bg-white"
            >
              <Radio value={"expired"}>Expired</Radio>
              <Radio value={"upcoming"}>Upcoming</Radio>
              <Radio value={"ongoing"}>Ongoing</Radio>
            </Radio.Group>
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
        <Button
          onClick={() => {
            navigate("/flash-product");
          }}
          className="p-4"
          icon={<FileAddOutlined />}
          type="primary"
        >
          Add Flash Sale
        </Button>
      </div>

      <ReusableTable
        columns={flashSaleTable}
        dataSource={data?.flashSales}
        paginationConfig={paginationConfig}
      />
    </div>
  );
}
