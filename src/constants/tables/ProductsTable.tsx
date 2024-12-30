import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Switch } from "antd";

import { Link } from "react-router-dom";
import Status from "../../components/common/Status";
import { deleteProduct, updateProduct } from "../../api/products";
import { useMutation, useQueryClient } from "react-query";
import openNotification from "../../components/ui/Notfication";
import { ApiError } from "../../types/ApiError";

export const ProductsTable = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Product",
    render: (record: { name: string; images: string[] }) => (
      <div className="flex items-center">
        <img
          src={record.images[0]}
          alt="product"
          className="w-[52px] h-[52px] object-cover"
        />
        <span className="ml-2">{record.name}</span>
      </div>
    ), //

    key: "name",
  },
  {
    title: "Category",
    render: (record: { category: { name: string } }) => (
      <p>{record.category.name}</p>
    ),
    key: "category",
  },
  {
    title: "Stock",
    render: (record: { stock: string }) => <span>{record.stock}</span>,
    key: "stock",
  },
  {
    title: "Status",
    render: (record: { status: string }) => {
      if (record.status === "in-stock") {
        return <Status status="success" text="In Stock" />;
      }
      if (record.status === "out-of-stock") {
        return <Status status="error" text="Out of Stock" />;
      }
    },
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },

  {
    title: "Actions",
    render: (record: { id: number; isActive: boolean }) => (
      <ActionsComponent record={record} />
    ),
  },
];

const ActionsComponent = ({
  record,
}: {
  record: { id: number; isActive: boolean };
}) => {
  const { mutate, isLoading } = useMutation(
    () => {
      return updateProduct(record.id, { isActive: !record.isActive });
    },
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Product Updated Successfully",
          description: "Product has been updated successfully",
        });
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Updating Product",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );
  const queryClient = useQueryClient();
  const { mutate: deleteProductMutaion, isLoading: deleteLoading } =
    useMutation(() => deleteProduct(record.id), {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Product Deleted Successfully",
          description: "Product has been deleted successfully",
        });
        queryClient.invalidateQueries("tableData");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Deleting Product",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    });

  return (
    <div className="flex gap-4">
      <Link to={`/product/${record.id}`}>
        <EditOutlined className="" />
      </Link>
      <Switch
        onClick={() => {
          mutate();
        }}
        loading={isLoading}
        defaultChecked={record.isActive}
      />
      <DeleteOutlined
        onClick={() => {
          deleteProductMutaion();
        }}
        className="text-primary text-xl cursor-pointer "
      />
    </div>
  );
};
