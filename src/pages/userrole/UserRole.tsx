import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../api/users";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import ReusableTable from "../../components/ui/Table";
import { UserTable } from "../../constants/tables/UserRoleTable";
import useDebounce from "../../hooks/useDebounceHook";

export default function UserRole() {
  const navigate = useNavigate();
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
    query: debounceSearch,
    type: "backoffice",
    items: 10,
  };
  const filterParams = Object.keys(params).reduce((acc, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});
  const { data: userRole, isLoading } = useQuery(
    ["userRole", filterParams],
    () => getUsers(filterParams),
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
      <div className="h-[70vh] bg-white w-full flex justify-center rounded-md">
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-white p-4 gap-4">
      <div className="flex justify-between">
        <Header title="User Role" />
        <Button
          onClick={() => {
            navigate("/add-user");
          }}
          icon={<PlusCircleOutlined />}
          type="primary"
        >
          Add User Role
        </Button>
      </div>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search Users"
        className="w-[300px] "
        onChange={(e) => setSearch(e.target.value)}
      />
      <ReusableTable
        dataSource={userRole?.users}
        pagination={paginationConfig}
        columns={UserTable}
      />
    </div>
  );
}
