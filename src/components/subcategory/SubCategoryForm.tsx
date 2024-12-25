import Header from "../Header";
import { Form, Input, Select, Switch, Typography, Upload } from "antd";
import useLocalStorage from "../../hooks/useLocalStorage";

import SubmitSection from "../common/SubmitSection";
import { Category } from "../../types/Categories";
import { InboxOutlined } from "@ant-design/icons";

import {
  addSubCategoryMutation,
  editSubCategoryMutation,
  getCategoriesLookup,
  getSubCategoryById,
} from "../../api/categories";

import { useMutateHook } from "../../hooks/useMutateHook";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { uploadFile } from "../../api/upload";

type CategoryType = {
  type: "add" | "edit";
};
export default function SubCategoryForm({ type }: CategoryType) {
  const { id } = useParams<{ id: string }>();
  const { Title, Text } = Typography;
  const [token] = useLocalStorage<string>("accessToken", "null");
  const [form] = Form.useForm();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  type FieldType = {
    category: Category;
    name: string;
    isActive: boolean;
    description: string;
    image: string;
  };

  const { data: subCategory } = useQuery(
    "subcategory",
    () => {
      return getSubCategoryById(Number(id));
    },
    {
      enabled: type === "edit",
    }
  );
  const { data: CategoryLookups } = useQuery("categoryLookups", () =>
    getCategoriesLookup({
      lookup: true,
    })
  );
  const [image, setImage] = useState<string | undefined>();
  useEffect(() => {
    if (subCategory) {
      form.setFieldsValue({
        category: subCategory.category.id,
        name: subCategory.name,
        description: subCategory.description,
        isActive: subCategory.isActive,
      });
      setImage(subCategory.images[0]);
    }
  }, [subCategory]);

  useEffect(() => {
    if (type === "add") {
      form.resetFields();
      setImage(undefined);
    }
  }, [type]);


  const { mutate, isLoading, isSuccess } = useMutateHook(
    "subcategories",
    type === "add"
      ? addSubCategoryMutation()
      : editSubCategoryMutation(Number(id))
  );

  console.log(type, "typeofsubmutation");

  const onFinish = async (values) => {
    console.log(values, "values");

    const formDaata = new FormData();
    let imageUrl = subCategory?.images[0];
    if (values?.image) {
      formDaata.append("file", values.image[0].originFileObj);
      setImageUploadLoading(true);
      imageUrl = await uploadFile(values.image[0].originFileObj, token, values.image[0].originFileObj?.name);
      setImageUploadLoading(false);
    }
    const data = {
      category: values.category,
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
  const navigate = useNavigate();
  if (isSuccess) {
    form.resetFields();
    navigate("/categories?tab=2");
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-[10px] p-4">
        <Header
          title={type === "add" ? "Add Subcategory" : "Edit Subcategory"}
        />
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
                  Category
                </Title>
                <Text className="max-w-[250px]" type="secondary">
                  Select the category for the subcategory
                </Text>
              </div>
              <Form.Item<FieldType>
                name="category"
                className=" w-[600px]  mx-auto"
                rules={[
                  { required: true, message: "Please input Category Name" },
                ]}
              >
                <Select placeholder="Select a Category">
                  {CategoryLookups?.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex  items-center w-full">
              <div className="flex flex-col justify-center max-w-[300px]">
                <Title level={5} className="!mb-0">
                  Subcategory Name
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
                rules={[
                  { required: true, message: "Please Enter a description" },
                  {
                    min: 10,
                    message: "Description should be at least 20 characters",
                  },
                ]}
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
                      subCategory?.isActive ? subCategory?.isActive : false
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
                required
                rules={[
                  {
                    required: type === "add",
                    message: "Please Upload a Thumbnail",
                  },
                ]}
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
