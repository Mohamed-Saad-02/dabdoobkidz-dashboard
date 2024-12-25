import { Form, Input } from "antd";
import ModalComponent from "../ui/Modal";
import { useState } from "react";
import { useMutation } from "react-query";
import { updateProfile } from "../../api/users";
import openNotification from "../ui/Notfication";
import { ApiError } from "../../types/ApiError";

type EmailModalProps = {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  email?: string;
  id?: number;
};

export default function EmailModal({
  isModalOpen,
  setModalOpen,
  email,
  id,
}: EmailModalProps) {
  const handleCancel = () => {
    setModalOpen(false);
  };

  const { mutate: updateEmail } = useMutation(
    (email: string | undefined) => {
      return updateProfile(id, {
        email,
      });
    },
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Email Updated Successfully",
          description: "Email has been updated successfully",
        });
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Problem Updating Email",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );
  const handleOk = () => {
    updateEmail(newEmail);
    setModalOpen(false);
  };

  const [newEmail, setEmail] = useState(email);
  return (
    <ModalComponent
      isModalOpen={isModalOpen}
      handleOk={handleOk}
      handleCancel={handleCancel}
      title="Edit Password"
    >
      <Form layout="vertical" className="p-4">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input disabled={true} defaultValue={email} placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="New Email"
          name="newEmail"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </Form.Item>
      </Form>
    </ModalComponent>
  );
}
