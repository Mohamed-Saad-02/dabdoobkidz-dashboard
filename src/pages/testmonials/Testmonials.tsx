import { Button } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getTestmonials } from "../../api/testmonials";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import AddTestmonialModal from "../../components/testmonials/AddTestmonialModal";
import EditTestmonial from "../../components/testmonials/EditTestmonialsModal";
import ReusableTable from "../../components/ui/Table";
import { TestmonialsTable } from "../../constants/tables/Testmonials";
import useDebounce from "../../hooks/useDebounceHook";

export default function Testmonials() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const debounceSearch = useDebounce(search, 500);
  const [searchParams, setSearchParams] = useSearchParams();
  const [testmonialId, setTestmonialId] = useState<string | null>(null);
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
  const { data: testmonials, isLoading } = useQuery(
    ["testmonials", filterParams],
    () => {
      return getTestmonials(filterParams);
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
  useEffect(() => {
    if (searchParams.get("testmonialId")) {
      setUpdateModalOpen(true);
      setTestmonialId(searchParams.get("testmonialId"));
    }
  }, [searchParams.get("testmonialId")]);

  if (isLoading) {
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-white p-6 gap-6 rounded-md">
      <div className="flex justify-between">
        <Header title="Testmonials" />
        <Button
          onClick={() => {
            setAddModalOpen(true);
          }}
          type="primary"
        >
          Add Testmonial
        </Button>
      </div>

      {/* <Input
        prefix={<SearchOutlined className="text-gray-400" />}
        placeholder="Search Banner"
        className="w-[300px] "
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      /> */}

      <ReusableTable
        dataSource={testmonials?.categories}
        columns={TestmonialsTable}
        pagination={paginationConfig}
      />

      <AddTestmonialModal
        isModalOpen={addModalOpen}
        setIsModalOpen={setAddModalOpen}
      />

      <EditTestmonial
        isModalOpen={updateModalOpen}
        setIsModalOpen={setUpdateModalOpen}
        bannerId={testmonialId}
      />
    </div>
  );
}
