import { InboxOutlined } from "@ant-design/icons";
import { Form, Input, Switch, Typography, Upload } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  addBrandMutation,
  getBrand,
  updateBrandMutation,
} from "../../api/brands";
import { uploadFile } from "../../api/upload";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useMutateHook } from "../../hooks/useMutateHook";
import { Dragger } from "../../types/Categories";
import SubmitSection from "../common/SubmitSection";
import Header from "../Header";

type BrandsFormProps = {
  type: "add" | "edit";
};

type FieldType = {
  name: string;
  isActive: boolean;
  image: string;
  dragger: Dragger[];
};

export default function BrandsForm({ type }: BrandsFormProps) {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [token] = useLocalStorage<string>("accessToken", "null");
  const { Title } = Typography;

  const { data: brand } = useQuery(
    "brand",
    () => {
      return getBrand(Number(id));
    },
    {
      enabled: type === "edit",
    }
  );

  const [image, setImage] = useState<string | undefined>();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // const [image, setImage] = useState<string | undefined>();
  const { mutate, isLoading, isSuccess } = useMutateHook(
    "plans",
    type === "add" ? addBrandMutation() : updateBrandMutation(Number(id))
  );

  useEffect(() => {
    if (brand) {
      form.setFieldsValue({
        name: brand.name,
        isActive: brand.isActive,
        // image: brand.images[0],
      });
      setImage(brand.images[0]);
    }
  }, [brand]);

  useEffect(() => {
    if (type === "add") {
      form.resetFields();
      setImage(undefined);
    }
  }, [type]);

  const onFinish = async (values) => {
    const formDaata = new FormData();
    let imageUrl = brand?.images[0];
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
    };
    mutate(data);
  };

  const normFile = (e) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  console.log(normFile, "normFile");

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
    navigate("/brands");
  }
  return (
    <div className="flex flex-col gap-4">
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        autoComplete="off"
        className="flex flex-col gap-6 bg-white p-4 rounded-md"
      >
        <Header title={type === "add" ? "Add Brand" : "Edit Brand"} />
        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Name
          </Title>
          <Form.Item<FieldType>
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input className="w-[600px] py-2 mx-auto" />
          </Form.Item>
        </div>
        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Active
          </Title>
          <Form.Item<FieldType>
            name="isActive"
            rules={[{ required: true, message: "Please choose the status" }]}
          >
            <Switch className="mx-auto" />
          </Form.Item>
        </div>
        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Image
          </Title>

          <div className="flex items-center w-full">
            <Form.Item<FieldType>
              name="image"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              className="mx-auto w-[600px]"
              rules={[
                {
                  required: type === "add" ? true : false,
                  message: "Please upload an image",
                },
              ]}
            >
              <Upload.Dragger
                name="files"
                multiple={false}
                beforeUpload={beforeUpload}
                className="mx-auto w-[600px]"
                showUploadList={false}
                maxCount={1}
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
        </div>
      </Form>
      <SubmitSection form={form} isLoading={isLoading || imageUploadLoading} />
    </div>
  );
}
