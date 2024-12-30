import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Status from "../../components/common/Status";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { deleteBrand } from "../../api/brands";
import openNotification from "../../components/ui/Notfication";
import { ApiError } from "../../types/ApiError";
import { Spin } from "antd";

export const BrandsTable = [
  {
    title: "ID",
    render: (record: { id: string; images: string[] }) => (
      <div className="flex gap-4">
        <p>{record.id}</p>
        <img
          src={record.images[0]}
          alt="brand"
          className="w-[80px] object-cover"
        />
      </div>
    ),
    key: "id",
  },
  {
    title: "Brand",
    dataIndex: "name",
    key: "brand",
  },
  {
    title: "Active",
    render: (record: { isActive: boolean }) => (
      <Status
        status={record.isActive ? "success" : "error"}
        text={record.isActive ? "Active" : "Inactive"}
      />
    ),
    key: "description",
  },
  {
    title: "Actions",
    render: (record: { id: number }) => <ActionsComponent record={record} />,
    key: "image",
  },
];

const ActionsComponent = ({ record }: { record: { id: number } }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    "brands",
    () => deleteBrand(record.id),
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Brand Deleted Successfully",
          description: "Brand has been deleted successfully",
        });
        queryClient.invalidateQueries("brands");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Deleting Brand",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );
  return (
    <div className="flex gap-4">
      <Link to={`/brand/${record.id}`}>
        <EditOutlined className="cursor-pointer text-[20px] hover:text-primary" />
      </Link>
      {isLoading ? (
        <Spin indicator={<LoadingOutlined spin />} size="small" />
      ) : (
        <DeleteOutlined
          onClick={() => {
            mutate();
          }}
          className="cursor-pointer text-[20px] text-primary"
        />
      )}
    </div>
  );
};
