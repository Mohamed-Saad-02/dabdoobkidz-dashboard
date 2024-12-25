import { useMutation, useQueryClient } from "react-query";
import { deleteFlashSale } from "../../api/flashsales";
import openNotification from "../../components/ui/Notfication";
import { ApiError } from "../../types/ApiError";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { useState } from "react";

export const flashSaleTable = [
  {
    title: "Start Date",
    render: (record: { start: string }) => {
      return new Date(record?.start).toLocaleString();
    },
    key: "start",
  },
  {
    title: "End Date",
    render: (record: { end: string }) => {
      return new Date(record?.end).toLocaleString();
    },
    key: "endDate",
  },
  {
    title: "Total Products",
    dataIndex: "totalproducts",
    key: "totalProducts",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Action",
    render: (record: { id: number }) => {
      return <ActionsComponent record={record} />;
    },
  },
];

const ActionsComponent = ({ record }: { record: { id: number } }) => {
  const queryClient = useQueryClient();
  const [flashsaleDetailModalOpen , setFlashSaleDetailModalOpen] = useState(false);
  const { mutate: deleteFlashSaleMutation, isLoading: deleteLoading } =
    useMutation(() => deleteFlashSale(record.id), {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Product Deleted Successfully",
          description: "Product has been deleted successfully",
        });
        queryClient.invalidateQueries("flashsales");
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
      <Link to={`/sales/${record.id}`} className="text-primary border-none">
        Details
      </Link>

      {deleteLoading ? (
        <Spin />
      ) : (
        <DeleteOutlined
          onClick={() => {
            deleteFlashSaleMutation();
          }}
          className="text-red-500 text-xl cursor-pointer "
        />
      )}


    </div>
  );
};
