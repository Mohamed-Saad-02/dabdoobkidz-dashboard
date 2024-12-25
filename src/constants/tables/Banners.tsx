import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { deleteBanner } from "../../api/Banner";
import openNotification from "../../components/ui/Notfication";
import { ApiError } from "../../types/ApiError";
import { Link } from "react-router-dom";
import { Spin } from "antd";

export const BannersTable = [
  {
    title: "ID",
    render: (record: { id: string; image: string }) => {
      console.log(record?.image , "imagebannerintable");
      
     return <div className="flex gap-2">
        <p>{record.id}</p>
        <img
          src={record.image}
          alt="banner"
          className="w-[82px]  object-cover rounded-lg mr-2"
        />
      </div>
    },
    key: "id",
  },
  {
    title: "Title",
    dataIndex: "slug",
    key: "type",
  },

  {
    title: "createdAt",
    render: (record: { createdAt: string }) => (
      <p>{new Date(record.createdAt).toDateString()}</p>
    ),
    key: "createdAt",
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
    () => deleteBanner(record.id),
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Banner Deleted Successfully",
          description: "Banner has been deleted successfully",
        });
        queryClient.invalidateQueries("banners");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Deleting Banner",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );

  return (
    <div className="flex gap-4">
      <Link
        to={`/banners?brandId=${record.id}`}
      >
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
