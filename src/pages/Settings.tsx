import { useMutation, useQuery, useQueryClient } from "react-query";
import { getMe } from "../api/auth";
import Header from "../components/Header";
import { Button, Form, Input, Typography } from "antd";
import ProfileUpload from "../components/profile/profileUpload";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";

import Loading from "../components/Loading";

import EmailModal from "../components/profile/EmailModal";
import PasswordModal from "../components/profile/PasswordModal";
import { uploadFile } from "../api/upload";
import { User } from "../types/User";
import { updateProfile } from "../api/users";
import openNotification from "../components/ui/Notfication";
import { ApiError } from "../types/ApiError";
import useLocalStorage from "../hooks/useLocalStorage";


export default function Settings() {
  const { data: userData, isLoading: userDataLoading } = useQuery(
    "profile",
    getMe
  );
  const { Title, Text } = Typography;
  const [token] = useLocalStorage<string>("accessToken", "null");
  
  const [form] = Form.useForm();
  type FieldType = {
    name: string;
    email: string;
    avatar: File;
  };
  const [emailOpen, setEmailOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const query = useQueryClient();
  
  const { mutate: updateProfileMutation, isLoading: updateLoading } =
    useMutation((data: User) => {
      return updateProfile(userData?.id, data);
    });


  const [img, setImg] = useState(userData?.avatar);
  useEffect(() => {
    if (userData) {
      setImg(userData.avatar);
    }
    form.setFieldsValue({
      name: `${userData?.firstName} ${userData?.lastName}`,
      email: userData?.email,
      avatar: userData?.avatar,
    });
  }, [userData, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = async(values) => {
    const formData = new FormData();
    formData.append("file", img);
    const imageUrl =await uploadFile(img , token , img.name);

    
    updateProfileMutation(
      {
        firstName: values.name.split(" ")[0],
        isActive: true,
        lastName: values.name.split(" ")[1],
        avatar: imageUrl,
      },
      {
        onSuccess: () => {
          openNotification({
            type: "success",
            message: "Profile Updated Successfully",
            description: "Profile has been updated successfully",
          });
          query.invalidateQueries("profile");
        },
        onError: (error: ApiError) => {
          openNotification({
            type: "error",
            message: "Problem Updating Profile",
            description: error.response?.data.message || "Something went wrong",
          });
        },
      }
    );
  };

  
  if (userDataLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  return (
    <div className="flex flex-col gap-4">
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        className="bg-white rounded-md p-4"
      >
        <Header title="Manage Profile" />

        <div className="flex gap-12 p-4 items-center">
          <div className="max-w-[300px] flex flex-col gap-2">
            <Title level={4} className="!mb-0">
              Avatar
            </Title>
            <Text>Only *.png, *.jpg and *.jpeg image files are accepted</Text>
          </div>
          <Form.Item<FieldType> name="avatar">
            <ProfileUpload onChange={setImg}/>
          </Form.Item>
        </div>

        <div className="flex gap-12 p-4 items-center">
          <Title level={4} className="!mb-0 w-[300px]">
            Name
          </Title>

          <Form.Item<FieldType>
            rules={[{ required: true, message: "Please input your name!" }]}
            name="name"
          >
            <Input className="w-[600px] py-2" />
          </Form.Item>
        </div>

        <div className="flex gap-12 p-4 items-center">
          <Title level={4} className="!mb-0 w-[300px]">
            Role
          </Title>
          <Input disabled={true} className="w-[600px] py-2" value={"Admin"} />
        </div>
        <div className="flex justify-end mt-[12px]">
          <Form.Item>
            <Button
              loading={updateLoading}
              className="p-4"
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>

      <div className="flex flex-col bg-white rounded-md p-4">
        <Header title="Manage Account" />
        <div className="flex items-center justify-between p-4">
          <Text className="text-[14px]">Email</Text>
          <div className="w-[600px] py-2 text-center">{userData?.email}</div>
          <Button
            className="p-4 border border-primary text-primary"
            htmlType="submit"
            onClick={() => setEmailOpen(true)}
          >
            Change Email
          </Button>
        </div>
        <div className="flex items-center justify-between p-4">
          <Text className="text-[14px]">Password</Text>
          <div className="w-[600px] py-2 text-center">
            <span className="font-[800] text-[24px]">............</span>
          </div>
          <Button
            className="p-4 border border-primary text-primary"
            htmlType="submit"
            onClick={() => setPasswordOpen(true)}
          >
            change password
          </Button>
        </div>
        <div className="flex items-center justify-between p-4">
          <Text className="text-[14px]">Logout</Text>
          <Button type="primary" className="p-4" htmlType="submit">
            Logout
          </Button>
        </div>
      </div>
      {/* <SubmitSection form={form} isLoading={updateLoading} /> */}

      <EmailModal
        id={userData?.id}
        isModalOpen={emailOpen}
        email={userData?.email}
        setModalOpen={setEmailOpen}
      />
      <PasswordModal
        isModalOpen={passwordOpen}
        setIsModalOpen={setPasswordOpen}
        id={userData?.id}
      />
    </div>
  );
}
