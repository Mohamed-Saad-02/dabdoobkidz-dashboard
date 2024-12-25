import { Tabs, TabsProps } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getCategories, getSubCategories } from "../../../api/categories";
import CategoryTab from "../../../components/categories/CategoryTab";
import Loading from "../../../components/Loading";
import useDebounce from "../../../hooks/useDebounceHook";

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedTab, setSelectedTab] = useState(
    searchParams.get("tab") || "1"
  );
  const [categorySearch, setCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const devounceSearch = useDebounce(categorySearch, 500);
  const devounceSubCategorySearch = useDebounce(subCategorySearch, 500);
  const [categorySort, setCategorySort] = useState("desc");
  const [subCategorySort, setSubCategorySort] = useState("desc");
  const [categoryCurrentPage, setCategoryCurrntPage] = useState();
  const [subCategoryCurrentPage, setSubCategoryCurrntPage] = useState();
  const [CategorypaginationConfig, setCategoryPaginationConfig] = useState({
    current: categoryCurrentPage,
    pageSize: 10,
    total: 0,
    onChange: (page: number) => {
      setCategoryCurrntPage(page);
    },
  });
  const [subCategorypaginationConfig, setSubCategoryPaginationConfig] =
    useState({
      current: subCategoryCurrentPage,
      pageSize: 10,
      total: 0,
      onChange: (page: number) => {
        setSubCategoryCurrntPage(page);
      },
    });

  const categoryParams = {
    page: categoryCurrentPage,
    order: categorySort,
    query: devounceSearch,

    items: 10,
  };
  const filteredCategoryParams = Object.keys(categoryParams).reduce(
    (acc, key) => {
      if (categoryParams[key]) {
        acc[key] = categoryParams[key];
      }
      return acc;
    },
    {}
  );
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery(
    ["categories", filteredCategoryParams],
    () => getCategories(filteredCategoryParams),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setCategoryPaginationConfig((prev) => ({
          ...prev,
          total: data.metadata.count,
          current: categoryCurrentPage,
        }));
      },
    }
  );

  const subCategoryParams = {
    page: subCategoryCurrentPage,
    order: subCategorySort,
    query: devounceSubCategorySearch,
    items: 10,
  };

  const filteredSubCategoryParams = Object.keys(subCategoryParams).reduce(
    (acc, key) => {
      if (subCategoryParams[key]) {
        acc[key] = subCategoryParams[key];
      }
      return acc;
    },
    {}
  );
  const {
    data: subCategories,
    isLoading: subCategoriesLoading,
    isError: subCategoriesError,
  } = useQuery(
    ["subCategories", filteredSubCategoryParams],
    () => getSubCategories(filteredSubCategoryParams),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setSubCategoryPaginationConfig((prev) => ({
          ...prev,
          total: data.metadata.count,
          current: subCategoryCurrentPage,
        }));
      },
    }
  );

  const CategoryTabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Categories",
      children: (
        <CategoryTab
          paginationConfig={CategorypaginationConfig}
          type="category"
          data={categories?.categories}
          setSorting={setCategorySort}
          setSearch={setCategorySearch}
        />
      ),
    },
    {
      key: "2",
      label: "Sub Categories",
      children: (
        <CategoryTab
          paginationConfig={subCategorypaginationConfig}
          type="subCategory"
          data={subCategories?.categories}
          setSorting={setSubCategorySort}
          setSearch={setSubCategorySearch}
        />
      ),
    },
  ];

  if (categoriesLoading || subCategoriesLoading)
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  if (categoriesError || subCategoriesError)
    return (
      <div className="flex justify-center items-center h-full">
        Something went wrong
      </div>
    );

  return (
    <div className="p-4 bg-white flex flex-col gap-4">
      <Tabs
        activeKey={selectedTab}
        onChange={(key) => {
          setSelectedTab(key);
          setSearchParams({ tab: key });
        }}
        defaultActiveKey="1"
        items={CategoryTabs}
      />
      ;
    </div>
  );
}
