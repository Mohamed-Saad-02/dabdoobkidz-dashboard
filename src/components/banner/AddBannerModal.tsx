import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import { ChangeEvent, DragEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addBanner } from "../../api/Banner";
import { uploadFile } from "../../api/upload";
import BannerUpload from "../../assets/images/banner-upload.svg";
import useLocalStorage from "../../hooks/useLocalStorage";
import { ApiError } from "../../types/ApiError";
import ModalComponent from "../ui/Modal";
import openNotification from "../ui/Notfication";

type AddBannerModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};

export default function AddBannerModal({
  isModalOpen,
  setIsModalOpen,
}: AddBannerModalProps) {
  const { Text, Title } = Typography;
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUplaodLoading, setImageUploadLoading] = useState(false);
  const [token] = useLocalStorage<string>("accessToken", "null");
  const query = useQueryClient();
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
      form.setFieldsValue({ image: droppedFiles[0] });
      setPreview(URL.createObjectURL(droppedFiles[0]));
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setPreview(URL.createObjectURL(selectedFiles[0]));
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    if (document.getElementById("Banner-upload")) {
      (document.getElementById("Banner-upload") as HTMLInputElement).value = "";
    }
  };

  const { mutate, isLoading } = useMutation(
    (data) => {
      return addBanner(data);
    },
    {
      onSuccess: () => {
        setIsModalOpen(false);
        openNotification({
          type: "success",
          message: "Banner Created Successfully",
          description: "Banner has been Created successfully",
        });
        form.resetFields();
        setPreview(null);
        setFile(null);
        query.invalidateQueries("banners");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Problem Updating Banner",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );
  const onFinish = async (values) => {
    // console.log("valuesinBanner", file);

    const formData = new FormData();
    formData.append("file", file as File);
    setImageUploadLoading(true);
    const imageUrl = await uploadFile(file, token, file?.name);
    console.log("imageUrlinUrl", imageUrl);

    setImageUploadLoading(false);
    const data = {
      slug: values.slug,
      url: values.url,
      image: imageUrl,
    };

    mutate(data);
  };

  return (
    <ModalComponent
      isModalOpen={isModalOpen}
      handleOk={() => {
        form.submit();
      }}
      handleCancel={handleCancel}
      title="Add Banner"
      width="50%"
      footer={
        <div className="flex gap-4 justify-end">
          <Button
            key="back"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              form.submit();
            }}
            loading={isLoading || imageUplaodLoading}
            className="w-full sm:w-auto"
          >
            Add Banner
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        autoComplete="off"
        className="flex flex-col gap-4 p-4"
      >
        <Form.Item
          name="image"
          rules={[
            {
              required: () => {
                return !preview;
              },
              message: "Please upload a banner",
            },
          ]}
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("Banner-upload")?.click()}
            style={{
              width: "100%",
              border: "2px dashed #ccc",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                  }}
                />
                <CloseOutlined
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={handleRemove}
                />
              </div>
            ) : (
              <div>
                <img
                  src={BannerUpload}
                  alt="Upload Banner"
                  className="mx-auto"
                />
                <Text className="!mb-0 text-center">
                  Click to upload, or drag and drop
                </Text>
                <br />
                <Text className="!mb-0">SVG, PNG, JPEG (MAX 800X400px)</Text>
              </div>
            )}

            <input
              className="!hidden"
              id="Banner-upload"
              type="file"
              onChange={handleFileChange}
            />
          </div>
        </Form.Item>
        <div className="w-full flex flex-col gap-4">
          <Title level={5} className="!mb-0">
            Title
          </Title>
          <Form.Item
            name="slug"
            rules={[
              { required: true, message: "Please input Title for banner!" },
            ]}
          >
            <Input
              className="py-2"
              placeholder="Enter a title for your banner"
            />
          </Form.Item>
        </div>

        <div className="w-full flex flex-col gap-4">
          <Title level={5} className="!mb-0">
            Url
          </Title>
          <Form.Item
            name="url"
            rules={[
              { required: true, message: "Please input URL for banner!" },
              {
                pattern: new RegExp(
                  "^(https?:\\/\\/)?" + // protocol
                    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
                    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                    "(\\#[-a-z\\d_]*)?$",
                  "i"
                ),
                message: "Please enter a valid URL!",
              },
            ]}
          >
            <Input className="py-2" placeholder="Enter a Url" />
          </Form.Item>
        </div>

        {/* <Button  onClick={()=>{
          form.submit();
        }}>submit</Button> */}
      </Form>
    </ModalComponent>
  );
}
