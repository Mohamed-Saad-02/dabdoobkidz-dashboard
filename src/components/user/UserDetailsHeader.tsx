import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal, Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { patch } from "../../api/axios";
import { User } from "../../types/User";
import Header from "../Header";

import { useState } from "react";
import { ApiError } from "../../types/ApiError";
import openNotification from "../ui/Notfication";
import UpdateUserModal from "./updateUserModal";
export default function UserHeaderDetails({
  user,
}: {
  user: User | undefined;
}) {
  const [ismodalOpen, setIsmodalOpen] = useState(false);
  const handleSubmit = () => {};
  const { mutate, isLoading } = useMutation(
    () => {
      return patch(`/users/${user?.id}/status`, { isActive: !user?.isActive });
    },
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Status Changed Successfully",
          description: "User status has been changed successfully",
        });
        queryClient.invalidateQueries("userDetail");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Problem Switching Active Status",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );
  const queryClient = useQueryClient();

  const handleChangeActive = () => {
    mutate();
  };
  return (
    <div className="flex flex-col gap-8 items-center bg-white rounded-[10px] p-4">
      <div className="flex w-full justify-between">
        <Header title="User Details" />
        <div className="flex gap-6 items-center p-4">
          <div className="flex items-center gap-2 ">
            <Switch
              loading={isLoading}
              value={user?.isActive}
              onChange={handleChangeActive}
            />
            <span>{user?.isActive ? "Active" : "Not Active"}</span>
          </div>
          <Button
            className="rounded-[10px] p-[8px]"
            icon={<EditOutlined />}
            type="primary"
            onClick={() => setIsmodalOpen(true)}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="flex  w-full gap-8 px-4">
        <Avatar
          src={user?.avatar}
          className=""
          size={120}
          icon={user?.avatar ? null : <UserOutlined />}
        />
        <div className="flex justify-between  flex-col">
          <span className="text-[24px] font-[500]">
            {user?.firstName} {user?.lastName}
          </span>
          <div className="grid gap-12 auto-cols-auto grid-flow-col">
            <div className="flex flex-col gap-2 w-fit">
              <span className="text-[14px] font-[700] text-textdark">
                Email
              </span>
              <span>{user?.email}</span>
            </div>
            <div className="flex flex-col gap-2 w-fit">
              <span className="text-[14px] font-[700] text-textdark">
                Phone Number
              </span>
              <span>{user?.phone}</span>
            </div>
            <div className="flex flex-col gap-2 w-fit">
              <span className="text-[14px] font-[700] text-textdark">
                Complete Address
              </span>
              <span className="font-">{user?.address}</span>
            </div>
            {user?.plan && (
              <div className="flex items-center gap-[6px] ">
                <span className="font-[600] text-[24px]  text-primary">
                  Premium
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal open={ismodalOpen} onOk={handleSubmit} footer={() => <></>}>
        <UpdateUserModal
          userInfo={user}
          closeModal={() => setIsmodalOpen(false)}
        />
      </Modal>
    </div>
  );
}
