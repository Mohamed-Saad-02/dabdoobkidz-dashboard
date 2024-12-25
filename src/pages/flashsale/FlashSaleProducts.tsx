import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProducts } from "../../api/products";
import AddFlashSale from "../../components/flashsale/AddFlashSale";
import Header from "../../components/Header";
import { productsSaleTable } from "../../constants/tables/ProductsSaleTable";
import useDebounce from "../../hooks/useDebounceHook";

export default function FlashSaleProducts() {
  const [currentPage, setCurrentPage] = useState(1); // corrected setCurrnetPage
  const [filterCategory, setFilterCategory] = useState();
  const [filterSubCategory, setFilterSubCategory] = useState();
  const [filterBrand, setFilterBrand] = useState();
  const [filterSort, setFilterSort] = useState("desc");
  const [search, setSearch] = useState("");
  const debounceSerach = useDebounce(search, 500);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // to store selected row keys
  const [selectedRows, setSelectedRows] = useState([]);

  const [paginationConfig, setPaginationConfig] = useState({
    current: currentPage,
    pageSize: 10,
    total: 0,
    onChange: (page: number) => {
      setCurrentPage(page); // corrected setCurrnetPage
    },
  });

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
  console.log(filterParams, "filterParamsinflashsale");

  const { data: flashProducts } = useQuery(
    ["flashProducts", filterParams],
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

  const { Text } = Typography;
  const [modalOpen, setModalOpen] = useState(false);

  const [pageSelectedProducts, setPageSelctedProduct] = useState([]);
  const [allSelectedProducts, setAllSelectedProducts] = useState({});
  useEffect(() => {
    setAllSelectedProducts((prev) => {
      return {
        ...prev,
        [currentPage - 1]: pageSelectedProducts,
      };
    });
    console.log(allSelectedProducts, "allSelectedProducts");
  }, [pageSelectedProducts]);

  useEffect(() => {
    setSelectedRowKeys(
      allSelectedProducts[currentPage - 1]?.map((product) => product.id) || []
    );

    console.log(allSelectedProducts, "pageSelectedProducts");
  }, [currentPage]);
  const handleRowSelection = (
    newSelectedRowKeys: any,
    newSelectedRows: any
  ) => {
    console.log(
      newSelectedRowKeys,
      newSelectedRows,
      "newSelectedRowKeys, newSelectedRows"
    );

    // Update selected row keys
    setSelectedRowKeys(newSelectedRowKeys);

    // Update allSelectedProducts, remove deselected rows
    setPageSelctedProduct((prevSelected) => {
      // Filter out deselected rows
      const deselectedIds = prevSelected
        .filter((prev) => !newSelectedRowKeys.includes(prev.id))
        .map((prev) => prev.id);
      console.log(deselectedIds, "deselectedIds");

      // Add newly selected rows and remove deselected rows
      const updatedSelected = prevSelected
        .filter((prev) => !deselectedIds.includes(prev.id))
        .concat(
          newSelectedRows.filter(
            (row) => !prevSelected.some((prev) => prev.id === row.id)
          )
        );

      return updatedSelected;
    });

    // console.log(pageSelectedProducts, "pageSelectedProducts");
  };
  console.log(
    Object.values(allSelectedProducts).flat(),
    "allSelectedProductsssflatmap"
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelection,
  };
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );
  console.log(allSelectedProducts, "allSelectedProducts");

  return (
    <div className="flex flex-col gap-6  ">
      <div className="flex flex-col gap-6 bg-white p-4">
        <div className="flex justify-between">
          <Header title="Flash Sale Products" />
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search Banner"
            className="w-[300px]"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Table
          dataSource={flashProducts?.products.map((product) => ({
            ...product,
            key: product.id,
          }))}
          columns={productsSaleTable}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          pagination={paginationConfig}
        />
      </div>

      <div className="flex justify-end bg-white p-4 rounded-[10px] ">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="mx-4 "
          onClick={() => {
            setModalOpen(true);
          }}
          disabled={allSelectedProducts.length === 0} // disable button if no products are selected
        >
          Add Flash Sale
        </Button>
      </div>
      <AddFlashSale
        isModalOpen={modalOpen}
        setIsModalOpen={setModalOpen}
        selectedRows={Object.values(allSelectedProducts).flat()}
      />
    </div>
  );
}
