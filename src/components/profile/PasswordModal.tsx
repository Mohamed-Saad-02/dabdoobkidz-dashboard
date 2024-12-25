import { Form, Input } from "antd";
import { useMutation } from "react-query";
import { updateProfile } from "../../api/users";
import { ApiError } from "../../types/ApiError";
import ModalComponent from "../ui/Modal";
import openNotification from "../ui/Notfication";

type PasswordModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  id?: number;
};

export default function PasswordModal({
  isModalOpen,
  setIsModalOpen,
  id,
}: PasswordModalProps) {
  const [form] = Form.useForm();
  const { mutate: changePassword } = useMutation(
    (password: string | undefined) => {
      return updateProfile(id, {
        password,
      });
    },
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Password Updated Successfully",
          description: "Password has been updated successfully",
        });
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Problem Updating Password",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        changePassword(values.newPassword);
        setIsModalOpen(false);
      })
      .catch((info) => {});
  };

  return (
    <ModalComponent
      title="Edit Password"
      isModalOpen={isModalOpen}
      handleOk={handleOk}
      handleCancel={() => setIsModalOpen(false)}
    >
      <Form form={form} layout="vertical" className="p-4">
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Please input your new password!",
            },
          ]}
        >
          <Input.Password placeholder="New Password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Please confirm your new password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
      </Form>
    </ModalComponent>
  );
}
