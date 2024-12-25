import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {  useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { deletePlan } from "../../api/plans";
import openNotification from "../../components/ui/Notfication";
import { ApiError } from "../../types/ApiError";
import { Spin } from "antd";

export const PlansTable = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    render: (record: { name: string }) => (
      <span>{record.name}</span>
    ),
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Action",
    render: (record: { id: number }) => <ActionsComponent record={record} />,
  },
];

const ActionsComponent = ({ record }: { record: { id: number } }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    "plans",
    () => deletePlan(record.id),
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Plan Deleted Successfully",
          description: "Plan has been deleted successfully",
        });
        queryClient.invalidateQueries("plans");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Deleting Plan",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );
  return (
    <div className="flex gap-4">
      <Link to={`/plan/${record.id}`}>
        <EditOutlined className="cursor-pointer text-[20px] hover:text-primary" />
      </Link>
      {isLoading ? (
        <Spin indicator={<LoadingOutlined spin />} size="small" />
      ) : (
        <DeleteOutlined
          onClick={() => {
            mutate();
          }}
          className="cursor-pointer text-[20px] text-[red]"
        />
      )}
    </div>
  );
};
