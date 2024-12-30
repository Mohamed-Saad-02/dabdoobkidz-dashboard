import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";

import { Link } from "react-router-dom";
import { deleteCoupon } from "../../api/coupons";
import openNotification from "../../components/ui/Notfication";
import { ApiError } from "../../types/ApiError";
import { Spin } from "antd";
import Status from "../../components/common/Status";

export const CouponsTable = [
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Type",
    dataIndex: "discountType",
    key: "name",
  },
  {
    title: "Discount",
    dataIndex: "discountValue",
    key: "discountValue",
  },
  {
    title: "Customers Type",
    dataIndex: "userType",
    key: "discount",
  },
  {
    title: "Status",
    render: (record: { status }) => {
      if (record.status === "active") {
        return <Status status="success" text={record.status} />;
      } else if (record.status === "upcoming") {
        return <Status status="warning" text={record.status} />;
      } else {
        return <Status status="error" text={record.status} />;
      }
    },
    key: "status",
  },
  {
    title: "Start Date",
    render: (record: { startDate: string }) => {
      return new Date(record.startDate).toLocaleDateString();
    },
    key: "startDate",
  },
  {
    title: "End Date",
    render: (record: { endDate: string }) => {
      return new Date(record.endDate).toLocaleDateString();
    },
    key: "endDate",
  },
  {
    title: "Action",
    render: (record: { id: number }) => <ActionsComponent record={record} />,
  },
];

const ActionsComponent = ({ record }: { record: { id: number } }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    "coupons",
    () => deleteCoupon(record.id),
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Coupon Deleted Successfully",
          description: "Coupon has been deleted successfully",
        });
        queryClient.invalidateQueries("coupons");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Deleting Coupon",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );
  return (
    <div className="flex gap-4">
      <Link to={`/coupon/${record.id}`} className="hover:text-primary">
        <EditOutlined className="cursor-pointer text-[20px]" />
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
