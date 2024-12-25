import { DeleteOutlined } from "@ant-design/icons";
import { Spin, Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { deleteUser, toggleUserStatus } from "../../api/users";
import openNotification from "../../components/ui/Notfication";

export const UserTable = [
  {
    title: "Username",
    render: (record: { firstName: string; lastName: string }) => (
      <p>
        {record.firstName} {record.lastName}
      </p>
    ),
    key: "username",
  },
  {
    title: "Email Address",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "User Role",
    dataIndex: "role",
    key: "role",
  },

  {
    title: "Phone Number",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Status",
    render: (record: { isActive: boolean }) => {
      if (record.isActive) {
        return <p className="text-green-500">Active</p>;
      } else {
        return <p className="text-red-500">in Active</p>;
      }
    },
    key: "status",
  },
  {
    title: "Created At",
    render: (record: { createdAt: string }) => {
      const date = new Date(record.createdAt);
      return <p>{date.toDateString()}</p>;
    },
    key: "status",
  },
  {
    title: "Actions",
    render: (record: { id: number; isActive: boolean }) => (
      <ActionComponent id={record.id} isActive={record?.isActive} />
    ),
  },
];

const ActionComponent = (record: { id: number; isActive: boolean }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteUserMutation, isLoading } = useMutation(
    (id: number) => deleteUser(id),
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "User Deleted",
          description: "User has been deleted successfully",
        });
        queryClient.invalidateQueries("userRole");
      },
      onError: () => {
        openNotification({
          type: "error",
          message: "User Deletion Failed",
          description: "User deletion failed",
        });
      },
    }
  );
  const { mutate: toggleUserStatusMutation, isLoading: isToggling } =
    useMutation(
      (mutationId) => toggleUserStatus(mutationId, {
        isActive: !record.isActive,
      }),
      {
        onSuccess: () => {
          openNotification({
            type: "success",
            message: "User Status Updated",
            description: "User status has been updated successfully",
          });
          queryClient.invalidateQueries("userRole");
        },
        onError: () => {
          openNotification({
            type: "error",
            message: "User Status Update Failed",
            description: "User status update failed",
          });
        },
      }
    );
  return (
    <div className="flex gap-4">
      <Switch
        loading={isToggling}
        onChange={() => {
          toggleUserStatusMutation(record.id);
        }}
        defaultChecked={record?.isActive}
      />
      {isLoading ? (
        <Spin />
      ) : (
        <DeleteOutlined
          className="text-red-500 cursor-pointer text-[22px]"
          onClick={() => {
            deleteUserMutation(record.id);
          }}
        />
      )}
    </div>
  );
};
