import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { deleteTestmonials } from "../../api/testmonials";
import openNotification from "../../components/ui/Notfication";
import { ApiError } from "../../types/ApiError";

export const TestmonialsTable = [
  {
    title: "Testmonial",
    render: (record: { id: number; image: string }) => {
      return (
        <div className="flex gap-[6px]">
          <span>{record.id}</span>
          <img className="w-[86px]" src={record?.image} alt="" />
        </div>
      );
    },
    key: "id",
  },
  {
    title: "Created At",
    render: (record: { createdAt: string }) => {
      return <p>{new Date(record.createdAt).toDateString()}</p>;
    },
    key: "Created At",
  },

  {
    title: "Action",
    render: (record: { id: number }) => <ActionsComponent record={record} />,
    key: "action",
  },
];

const ActionsComponent = ({ record }: { record: { id: number } }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    "banners",
    () => deleteTestmonials(record.id),
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Testmonial Deleted Successfully",
          description: "Testmonial has been deleted successfully",
        });
        queryClient.invalidateQueries("testmonials");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Deleting Testmonial",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );

  return (
    <div className="flex gap-4">
      <Link to={`/Testmonials?testmonialId=${record.id}`}>
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
