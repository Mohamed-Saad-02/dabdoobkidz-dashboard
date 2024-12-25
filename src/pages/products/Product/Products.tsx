import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Collapse, Dropdown, Input, Radio } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getBrandsLookup } from "../../../api/brands";
import {
  getCategoriesLookup,
  getSubCategoriesLookup,
} from "../../../api/categories";
import { getProducts } from "../../../api/products";
import { Filter, Sort } from "../../../assets/common";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";
import ReusableTable from "../../../components/ui/Table";
import { ProductsTable } from "../../../constants/tables/ProductsTable";
import useDebounce from "../../../hooks/useDebounceHook";

export default function Products() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrnetPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState();
  const [filterSubCategory, setFilterSubCategory] = useState();
  const [filterBrand, setFilterBrand] = useState();
  const [filterSort, setFilterSort] = useState("desc");
  const [paginationConfig, setPaginationConfig] = useState({
    current: currentPage,
    pageSize: 10,
    total: 0,
    onChange: (page: number) => {
      setCurrnetPage(page);
    },
  });

  const { data: brands } = useQuery("brandlookup", getBrandsLookup);
  const { data: categories } = useQuery(
    "categorieslookup",
    getCategoriesLookup
  );
  const { data: subCategories } = useQuery(
    "subcategorieslookup",
    getSubCategoriesLookup
  );
  const debounceSerach = useDebounce(search, 500);

  const params = {
    page: currentPage,
    category: filterCategory,
    items: 10,
    subcategory: filterSubCategory,
    brand: filterBrand,
    order: filterSort,
    query: debounceSerach,
  };

  const filterParams = Object.keys(params).reduce((acc, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});

  const { data: products, isLoading: productsLoading } = useQuery(
    ["tableData", filterParams],
    () => getProducts(filterParams),
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

  const navigate = useNavigate();

  const items = [
    {
      label: "Categories",
      children: (
        <Radio.Group
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex flex-col gap-4"
        >
          {categories?.map((category) => (
            <Radio value={category.id} key={category.id}>
              {category.name}
            </Radio>
          ))}
        </Radio.Group>
      ),
    },
    {
      label: "SubCategories",
      children: (
        <Radio.Group
          onChange={(e) => setFilterSubCategory(e.target.value)}
          className="flex flex-col gap-4"
        >
          {subCategories?.map((sub) => (
            <Radio value={sub.id} key={sub.id}>
              {sub.name}
            </Radio>
          ))}
        </Radio.Group>
      ),
    },
    {
      label: "Brands",
      children: (
        <Radio.Group
          onChange={(e) => setFilterBrand(e.target.value)}
          className="flex flex-col gap-4"
        >
          {brands?.map((brand) => (
            <Radio value={brand.id} key={brand.id}>
              {brand.name}
            </Radio>
          ))}
        </Radio.Group>
      ),
    },
  ];
  if (productsLoading)
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );

  return (
    <div className="flex flex-col  gap-4 bg-white p-4 rounded-[10px]">
      <Header title="Products List" />
      <div className="flex justify-between items-center">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search Products"
          className="w-[300px]"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-4">
          <Dropdown
            trigger={["click"]}
            dropdownRender={(menu) => (
              <Radio.Group
                onChange={(e) => setFilterSort(e.target.value)}
                className="flex flex-col gap-4 bg-white mt-5"
              >
                <Radio value="asc">Ascending</Radio>
                <Radio value="desc">Descending </Radio>
              </Radio.Group>
            )}
          >
            <Button
              icon={<img src={Sort} />}
              className="bg-background font-semibold"
              iconPosition="end"
            >
              Sort
            </Button>
          </Dropdown>
          <Dropdown
            trigger={["click"]}
            dropdownRender={(menu) => (
              <div className="bg-white p-4 flex flex-col">
                <Collapse items={items} />
              </div>
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
              navigate("/add-product");
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            Add Product
          </Button>
        </div>
      </div>
      <ReusableTable
        columns={ProductsTable}
        dataSource={products?.products}
        paginationConfig={paginationConfig}
      />
    </div>
  );
}
