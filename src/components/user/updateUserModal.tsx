import { Button, Form, Input } from "antd";
import { useMutation, useQueryClient } from "react-query";
import openNotification from "../ui/Notfication";
import { ApiError } from "../../types/ApiError";
import { updateProfile } from "../../api/users";
import { useEffect } from "react";

export default function UpdateUserModal({ userInfo, closeModal }: any) {
  console.log(userInfo, "userInfo");
  useEffect(() => {
    form.setFieldsValue({
      firstName: userInfo?.firstName,
      lastName: userInfo?.lastName,
      email: userInfo?.email,
      phone: userInfo?.phone,
      address: userInfo?.address,
    });
  }, [userInfo]);

  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (updatedData) => updateProfile(userInfo.id, updatedData),
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "User Updated Successfully",
          description: "User has been updated successfully",
        });
        queryClient.invalidateQueries("userDetail");
        closeModal();
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Updating User",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );

  const onFinish = (values: any) => {
    console.log(values, "updateuserValues");
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      address: values.address,
    };
    mutate(data);
  };
  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: "Please input your first name!" }]}
      >
        <Input type="text" name="firstName" />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: "Please input your Last Name!" }]}
      >
        <Input type="text" name="lastName" />
      </Form.Item>

      <Form.Item
        label="Email Address"
        name="email"
        rules={[{ required: true, message: "Please input your Email Adress!" }]}
      >
        <Input type="email" name="email" />
      </Form.Item>

      <Form.Item
        label="phone Number"
        name="phone"
        rules={[{ required: true, message: "Please input your phone number!" }]}
      >
        <Input type="text" name="phone" />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input your address!" }]}
      >
        <Input type="text" name="address" />
      </Form.Item>

      <div className="flex justify-end gap-4">
        <Button onClick={closeModal}>Cancel</Button>
        <Button htmlType="submit" loading={isLoading} type="primary">
          Save
        </Button>
      </div>
    </Form>
  );
}
