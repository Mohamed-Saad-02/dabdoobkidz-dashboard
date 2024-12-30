import { SearchOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Radio } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { getUsers } from "../../api/users";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import ReusableTable from "../../components/ui/Table";
import { userTableColumns } from "../../constants/tables/UsersTable";
import useDebounce from "../../hooks/useDebounceHook";

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounceSerach = useDebounce(search, 500);

  const [paginationConfig, setPaginationConfig] = useState({
    current: currentPage,
    pageSize: 10,
    total: 0,
    onChange: (page: number) => {
      setCurrentPage(page);
    },
  });
  const [order, setOrder] = useState("desc");
  const params = {
    page: currentPage,
    items: 10,
    type: "normal",
    order,
    query: debounceSerach,
  };

  const filterParams = Object.keys(params).reduce((acc, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});

  const {
    data: usersData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery(["users", filterParams], () => getUsers(filterParams), {
    keepPreviousData: true,
    onSuccess: (data) => {
      setPaginationConfig((prev) => ({
        ...prev,
        total: data.metadata.count,
        current: currentPage,
      }));
    },
  });

  // const {
  //   data: addressesData,
  //   isLoading: addressLoading,
  //   isError: addressError,
  // } = useQuery(["addresses"], getAddresses);

  if (userLoading)
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  if (userError)
    return (
      <div className="flex justify-center items-center h-full">
        Something went wrong
      </div>
    );
  return (
    <div className=" flex flex-col gap-6 bg-white p-4">
      <div className="flex justify-between">
        <Header title="Users" />
        <div className="flex gap-4 font-[600]">
          <Dropdown
            trigger={["click"]}
            dropdownRender={(menu) => (
              <div className="bg-white p-4 flex flex-col">
                {menu}
                <Radio.Group
                  onChange={(e) => setOrder(e.target.value)}
                  className="flex flex-col gap-4"
                >
                  <Radio value="asc">Ascending</Radio>
                  <Radio value="desc">Descending</Radio>
                </Radio.Group>
              </div>
            )}
          >
            <Button className="font-[600]" icon={<SortAscendingOutlined />}>
              Sort
            </Button>
          </Dropdown>

          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search Users"
            className="w-[300px]"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ReusableTable
        dataSource={usersData?.users}
        columns={userTableColumns}
        paginationConfig={paginationConfig}
      />
    </div>
  );
}
