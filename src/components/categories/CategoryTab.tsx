import { MenuOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Radio } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GridIcon, Sort } from "../../assets/common";
import { categoriesTable } from "../../constants/tables/CategoriesTable";
import { SubCategoryTable } from "../../constants/tables/SubCategoriesTable";
import { Category } from "../../types/Categories";
import Header from "../Header";
import ReusableTable from "../ui/Table";
import GridCategoryComponent from "./GridCategoryComponent";
type CategoryTabProps = {
  type: "category" | "subCategory";
  data?: Category[];
  paginationConfig?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
  setSorting?: (sort: string) => void;
  setSearch?: (search: string) => void;
};
export default function CategoryTab({
  type,
  data,
  paginationConfig,
  setSorting,
  setSearch,
}: CategoryTabProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({ display: "table" });
  let content = <></>;

  if (searchParams.get("display") === "table") {
    content =
      type === "category" ? (
        <ReusableTable
          dataSource={data}
          paginationConfig={paginationConfig}
          columns={categoriesTable}
        />
      ) : (
        <ReusableTable
          dataSource={data}
          paginationConfig={paginationConfig}
          columns={SubCategoryTable}
        />
      );
  }

  if (searchParams.get("display") === "grid") {
    content = <GridCategoryComponent categories={data} />;
  }
  return (
    <div className="flex flex-col gap-4 bg-white p-4">
      <div className="flex justify-between">
        <Header title={type === "category" ? "Categories" : "SubCategories"} />
        <div className="flex gap-2">
          <Dropdown
            trigger={["click"]}
            dropdownRender={(menu) => (
              <div>
                <Radio.Group
                  onChange={(e) => {
                    setSorting(e.target.value);
                  }}
                  className="flex flex-col bg-white gap-4"
                >
                  <Radio value="asc">Asc</Radio>
                  <Radio value="desc">Desc</Radio>
                </Radio.Group>
              </div>
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

          {/* <Button
            iconPosition="end"
            icon={<img src={Filter} />}
            className="bg-background hover:bg-background font-semibold"
          >
            Filters
          </Button> */}
          <Button
            onClick={() => {
              type === "category"
                ? navigate("/add-Category")
                : navigate("/add-Subcategory");
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            {type === "category" ? "Add Category" : "Add SubCategory"}
          </Button>

          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search Users"
            className="w-[300px]"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            onClick={() => {
              setSearchParams({ display: "grid" });
            }}
            icon={<img src={GridIcon} />}
          />
          <Button
            onClick={() => {
              setSearchParams({ display: "table" });
            }}
            icon={<MenuOutlined />}
          />
        </div>
      </div>

      {content}
    </div>
  );
}
