import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import useLocalStorage from "../../hooks/useLocalStorage";
import openNotification from "../ui/Notfication";

import { ApiError } from "../../types/ApiError";

export default function LoginForm() {
  const { Title, Text } = Typography;
  type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [, setToken] = useLocalStorage<string>("accessToken", "null");
  const [, setRefreshToken] = useLocalStorage<string>("refreshToken", "null");

  const mutation = useMutation(
    ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    {
      onSuccess: (data) => {
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        localStorage.setItem("role", JSON.stringify(data.user?.role));
        queryClient.invalidateQueries("token");
        openNotification({
          type: "success",
          message: "Login Successfull",
          description: "You have been logged in successfully",
        });
        navigate("/");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Problem in Loggin in",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );

  const onFinish: FormProps<FieldType>["onFinish"] = ({
    email = "",
    password = "",
  }) => {
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col flex-[1] gap-2 mt-[52px]">
      <div className="w-[428px] mx-auto">
        <div className="h-[100px]" />
        <Title level={2} className="!mb-0 !font-bold">
          Hi There!
        </Title>
        <Text type="secondary" className="font-bold">
          Welcome back to ecommerce dashboard
        </Text>
      </div>

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ margin: "0 auto" }}
        initialValues={{ remember: true }}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          layout="vertical"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please input your username!" }]}
          className="w-[428px]"
        >
          <Input className="py-2" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          layout="vertical"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please input your password!" }]}
          className="w-[428px]"
        >
          <Input.Password className="py-2" />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ span: 24 }}
        >
          <div className="flex">
            <Checkbox>Remember me</Checkbox>
            {/* <Link
              to="/forgot-password"
              className="ml-auto underline font-semibold"
            >
              Forgot Password?
            </Link> */}
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            loading={mutation.isLoading}
            className="w-full bg-primary text-white hover:!bg-primary hover:!text-white  p-[18px] rounded-[10px]"
            htmlType="submit"
          >
            {mutation.isLoading ? "Loading" : "Login"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
