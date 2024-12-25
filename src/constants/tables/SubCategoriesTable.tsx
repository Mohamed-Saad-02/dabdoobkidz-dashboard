import { Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import Status from "../../components/common/Status";
import { useMutation, useQueryClient } from "react-query";
import { deleteCategory, deleteSubCategory } from "../../api/categories";
import openNotification from "../../components/ui/Notfication";
import { ApiError } from "../../types/ApiError";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
export const SubCategoryTable = [
  {
    title: "CATEGORY",
    render: (record: { name: string; images: string[] }) => (
      <div className="flex">
        <img
          src={record?.images[0]}
          alt="category"
          className="w-[82px]  object-cover rounded-lg mr-2"
        />
        <Title className="!mb-0" level={5}>
          {record.name}
        </Title>
      </div>
    ),
    key: "name",
  },
  {
    title: "DESCRIPTION",
    render: (record: { description: string }) => {
      if (!record.description) return <span>No Description</span>;
      return <span>{record.description}</span>;
    },
    key: "description",
  },
  {
    title: "STATUS",
    render: (record: { isActive: boolean }) => {
      if (record.isActive) return <Status status="success" text="Active" />;
      return <Status status="error" text="inActive" />;
    },
    key: "status",
  },
  {
    title: "ACTION",
    key: "action",
    render: (record: { id: number }) => <ActionsComponent record={record} />,
  },
];
const ActionsComponent = ({ record }: { record: { id: number } }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    "subCategories",
    () => deleteSubCategory(record.id),
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Subcategory Deleted Successfully",
          description: "Subcategory has been deleted successfully",
        });
        queryClient.invalidateQueries("subCategories");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Deleting Category",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );
  return (
    <div className="flex gap-4">
      <Link to={`/subcategory/${record.id}`}>
        <Title className="!text-primary !mb-0" level={5}>
          Details
        </Title>
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
