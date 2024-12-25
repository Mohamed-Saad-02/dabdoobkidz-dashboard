import { Form, Input, Select, Space } from "antd";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getUserRoles } from "../../api/userRoles";
import { createUser } from "../../api/users";
import Header from "../../components/Header";
import SubmitSection from "../../components/common/SubmitSection";
import openNotification from "../../components/ui/Notfication";

export default function AddUser() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(
    (data: any) => {
      return createUser(data);
    },
    {
      onSuccess: () => {
        form.resetFields();
        openNotification({
          message: "User Created Successfully",
          type: "success",
          description: "User has been created successfully",
        });
        navigate("/roles");
      },

      onError: (error: any) => {
        openNotification({
          message: "Error Creating User",
          type: "error",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );

  const { data: roles } = useQuery("roles", getUserRoles);

  const onFinish = (values) => {
    mutate({
      ...values,
      isActive: true,
      avatar:
        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
    });
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please input your password!"));
    }

    if (!/[A-Z]/.test(value)) {
      return Promise.reject(
        new Error("Password must contain at least one uppercase letter")
      );
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(
        new Error("Password must contain at least one lowercase letter")
      );
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject(
        new Error("Password must contain at least one number")
      );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject(
        new Error("Password must contain at least one special character")
      );
    }
    return Promise.resolve();
  };

  return (
    <div className="h-[75vh] flex flex-col justify-between">
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        className="flex flex-col gap-6 bg-white p-4"
      >
        <Header title="Add User" />
        <div className="flex gap-4 w-full">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
            className="w-full"
          >
            <Input placeholder="Enter Name" className="w-full py-2" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your Last Name!" },
            ]}
            className="w-full"
          >
            <Input placeholder="Enter Name" className="w-full py-2" />
          </Form.Item>
        </div>

        <div className="flex gap-4">
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please input your Email Adress!" },
            ]}
            className="w-full"
          >
            <Input
              type="email"
              className="py-2"
              placeholder="Enter email address"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name={"password"}
            className="w-full "
            rules={[{ validator: validatePassword }]}
          >
            <Input.Password className="py-2" placeholder="Enter Password" />
          </Form.Item>
        </div>
        <div className="flex gap-4 items-center">
          <Form.Item
            label="Role"
            name="role"
            className="w-full"
            rules={[{ required: true, message: "Please input your ROlename!" }]}
          >
            <Select placeholder="Select Role" className="w-full">
              {roles?.data.map((role) => (
                <Select.Option value={role} key={role}>
                  {role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            className="w-full"
            rules={[{ required: true, message: "Please input phone number" }]}
          >
            <Space.Compact className="w-full">
              <div className="w-[80px]">
                <Select
                  value="+20"
                  options={[{ label: "+20", value: "+20" }]}
                />
              </div>
              <Input className="w-full" />
            </Space.Compact>
          </Form.Item>
        </div>
      </Form>

      <SubmitSection form={form} isLoading={isLoading} />
    </div>
  );
}
