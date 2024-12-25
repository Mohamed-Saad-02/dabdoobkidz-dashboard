import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Typography } from "antd";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getTestmonialsById, updateTestmonials } from "../../api/testmonials";
import { uploadFile } from "../../api/upload";
import BannerUpload from "../../assets/images/banner-upload.svg";
import useLocalStorage from "../../hooks/useLocalStorage";
import { ApiError } from "../../types/ApiError";
import ModalComponent from "../ui/Modal";
import openNotification from "../ui/Notfication";

type EditBannerProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  bannerId: string | null;
};

export default function EditTestmonial({
  isModalOpen,
  setIsModalOpen,
  bannerId,
}: EditBannerProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useQueryClient();

  const { data: testmonial } = useQuery(
    [
      "testmonial",
      {
        id: bannerId,
      },
    ],
    () => {
      return bannerId ? getTestmonialsById(Number(bannerId)) : null;
    },
    {
      enabled: !!bannerId,
    }
  );

  const { Text, Title } = Typography;
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUplaodLoading, setImageUploadLoading] = useState(false);
  const [token] = useLocalStorage<string>("accessToken", "null");

  const handleCancel = () => {
    setIsModalOpen(false);
    setSearchParams((data) => {
      return data.delete("id");
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
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

  useEffect(() => {
    if (testmonial) {
      setPreview(testmonial?.image);
    }
  }, [testmonial]);
  const { mutate, isLoading } = useMutation(
    (data) => {
      return updateTestmonials(Number(bannerId), data);
    },
    {
      onSuccess: () => {
        setIsModalOpen(false);
        setSearchParams((data) => {
          return data.delete("id");
        });
        openNotification({
          type: "success",
          message: "Testmonial Updated Successfully",
          description: "Testmonial has been updated successfully",
        });
        query.invalidateQueries("testmonials");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Problem Updating Testmonial",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );
  const onFinish = async (values) => {
    const formData = new FormData();
    let imageUrl = testmonial?.image;
    if (file) {
      formData.append("file", file as File);

      setImageUploadLoading(true);
      imageUrl = await uploadFile(formData, token);
      setImageUploadLoading(false);
    }

    const data = {
      slug: values.slug,
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
      title="Edit Banner"
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
            Save Changes
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
              required: !testmonial?.image,
              message: "Please upload an image for the Testmonial!",
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

        {/* <Button  onClick={()=>{
          form.submit();
        }}>submit</Button> */}
      </Form>
    </ModalComponent>
  );
}
