import { InboxOutlined } from "@ant-design/icons";
import { Form, Input, Switch, Typography, Upload } from "antd";
import useLocalStorage from "../../hooks/useLocalStorage";
import SubmitSection from "../common/SubmitSection";
import Header from "../Header";

import {
  addCategoryMutaion,
  editCategoryMutation,
  getCategoryById,
} from "../../api/categories";

import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { uploadFile } from "../../api/upload";
import { useMutateHook } from "../../hooks/useMutateHook";

type CategoryType = {
  type: "add" | "edit";
};
export default function CategoryForm({ type }: CategoryType) {
  const { id } = useParams<{ id: string }>();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const { Title, Text } = Typography;
  const [token] = useLocalStorage<string>("accessToken", "null");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  type FieldType = {
    name: string;
    isActive: boolean;
    description: string;
    image: string;
  };

  const { data: category } = useQuery(
    "category",
    () => {
      return getCategoryById(Number(id));
    },
    {
      enabled: type === "edit",
    }
  );

  const [image, setImage] = useState<string | undefined>();
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        isActive: category.isActive,
      });
      setImage(category.images[0]);
    }
  }, [category]);

  const { mutate, isLoading, isSuccess } = useMutateHook(
    "categories",
    type === "add" ? addCategoryMutaion() : editCategoryMutation(Number(id))
  );

  useEffect(() => {
    if (type === "add") {
      form.resetFields();
      setImage(undefined);
    }
  }, [type]);

  if (isSuccess) {
    form.resetFields();
    navigate("/categories");
  }

  const onFinish = async (values) => {
    const formDaata = new FormData();
    let imageUrl = category?.images[0];
    if (values.image) {
      formDaata.append("file", values.image[0].originFileObj);
      setImageUploadLoading(true);
      imageUrl = await uploadFile(
        values.image[0].originFileObj,
        token,
        values.image[0].originFileObj?.name
      );
      setImageUploadLoading(false);
    }
    const data = {
      name: values.name,
      isActive: values.isActive,
      images: [imageUrl],
      description: values.description,
    };

    mutate(data);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload, handle it manually
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-[10px] p-4">
        <Header title={type === "add" ? "Add Category" : "Edit Category"} />
        <div className="flex flex-col p-4 gap-6">
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            autoComplete="off"
            className="flex flex-col  gap-6"
          >
            <div className="flex  items-center w-full">
              <div className="flex flex-col justify-center max-w-[300px]">
                <Title level={5} className="!mb-0">
                  Category Name
                </Title>
                <Text className="max-w-[250px]" type="secondary">
                  Do not exceed 20 characters when entering the product name.
                </Text>
              </div>
              <Form.Item<FieldType>
                name="name"
                className=" w-[600px]  mx-auto"
                rules={[
                  { required: true, message: "Please input Category Name" },
                ]}
              >
                <Input className="py-2" placeholder="Enter Category Name" />
              </Form.Item>
            </div>

            <div className="flex  items-center w-full">
              <div className="flex flex-col justify-center ">
                <Title level={5} className="!mb-0">
                  Description
                </Title>
                <Text className="max-w-[250px]" type="secondary">
                  Set a description on category to detail your category and
                  better visibility
                </Text>
              </div>
              <Form.Item<FieldType>
                name="description"
                className="mx-auto"
                // rules={[
                //   { required: true, message: "Please Enter a description" },
                //   {
                //     min: 20,
                //     message: "Description should be atleast 20 characters",
                //   },
                // ]}
              >
                <Input.TextArea
                  placeholder="Description"
                  className=" w-[600px] py-2 "
                />
              </Form.Item>
            </div>
            <div className="flex  items-center w-full">
              <div className="flex flex-col justify-center max-w-[300px]">
                <Title level={5} className="!mb-0">
                  Status
                </Title>
                <Text className="max-w-[250px]" type="secondary">
                  Set a status for category to determine whether your category
                  is displayed or not
                </Text>
              </div>
              <div className="w-[600px] mx-auto">
                <Form.Item<FieldType> name="isActive" valuePropName="checked">
                  <Switch
                    defaultChecked={
                      category?.isActive ? category?.isActive : false
                    }
                  />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-center w-full">
              <div className="flex flex-col justify-center w-[300px]">
                <Title level={5} className="!mb-0">
                  Thumbnail
                </Title>
                <Text className="max-w-[250px]" type="secondary">
                  Set the product thumbnail image. Only *.png, *.jpg and *.jpeg
                  image files are accepted. Recommended minimum width 1080px X
                  1080px, with a max size of 5MB
                </Text>
              </div>

              <Form.Item<FieldType>
                name="image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="mx-auto w-[600px]"
                // rules={[
                //   {
                //     required: type === "add",
                //     message: "Please Upload a Thumbnail",
                //   },
                // ]}
              >
                <Upload.Dragger
                  className="mx-auto w-[600px]"
                  name="file"
                  multiple={false}
                  beforeUpload={(file) => beforeUpload(file)}
                  showUploadList={false}
                  maxCount={1}
                >
                  {image ? (
                    <img
                      src={image}
                      alt="avatar"
                      style={{
                        width: "200px",
                        marginInline: "auto",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload.
                      </p>
                    </div>
                  )}
                </Upload.Dragger>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
      <SubmitSection form={form} isLoading={isLoading || imageUploadLoading} />
    </div>
  );
}
