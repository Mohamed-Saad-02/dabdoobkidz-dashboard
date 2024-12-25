import { PlusOutlined } from "@ant-design/icons";
import { Form, Image, Typography, Upload, UploadFile, UploadProps } from "antd";
import { DragEvent, useEffect, useState } from "react";
import BannerUpload from "../../../assets/images/banner-upload.svg";
import ModalComponent from "../../ui/Modal";
type VaraintImageModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  setVaraintImages: (value: any) => void;
  setOldVaraintImages: (value: any) => void;
  variantImages: string[];
  oldVariantImages: string[];
  varaintId: number | null;
};
export default function VaraintImageModal({
  isModalOpen,
  setIsModalOpen,
  setVaraintImages,
  variantImages,
  varaintId,
  setOldVaraintImages,
}: VaraintImageModalProps) {
  useEffect(() => {
    const filtredImages = variantImages?.filter(
      (image) => image?.id === varaintId
    );
    const oldImages = filtredImages?.map((image) => image?.img);
    console.log(oldImages, "oldImages");

    setOldVaraintImages(...oldImages);
    setFileList(...oldImages);
  }, [varaintId]);

  const [file, setFile] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  console.log(fileList, "fileListvarian");

  const [form] = Form.useForm();
  const getBase64 = (file): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const newImages = newFileList.filter((file) => !file.url);
    setVaraintImages(newImages);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handelOk = () => {
    setVaraintImages(fileList);
    form.validateFields().then((values) => {
      setIsModalOpen(false);
    });
  };

  const { Text } = Typography;

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <ModalComponent
      isModalOpen={isModalOpen}
      handleCancel={handleCancel}
      handleOk={handelOk}
      title="Upload Varaint Image"
      width="50%"
      footer={
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 text-white bg-primary rounded-md"
            onClick={handelOk}
          >
            Save
          </button>
          <button
            className="px-4 py-2 text-primary border border-primary rounded-md"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      }
    >
      <Form
        name="basic"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        autoComplete="off"
        onFinish={handelOk}
        form={form}
      >
        <Form.Item name="varaintImages" className="my-6">
          {fileList?.length === 0 ? (
            <div
              onDrop={(e: DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                setFile(e.dataTransfer.files[0]);
              }}
              onDragOver={(e: DragEvent<HTMLDivElement>) => {
                e.preventDefault();
              }}
              onClick={() => document.getElementById("Varaint-upload")?.click()}
              style={{
                width: "100%",
                height: "300px",
                border: "2px dashed #ccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                cursor: "pointer",
              }}
            >
              <input
                type="file"
                id="Varaint-upload"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0] as File;
                  if (file) {
                    const customObject = {
                      lastModified: file.lastModified,
                      lastModifiedDate: file.lastModifiedDate,
                      name: file.name,
                      originFileObj: file,
                      // Initial value
                      size: file.size,
                      // Initial value
                      thumbUrl: URL.createObjectURL(file), // Create a URL for the file
                      type: file.type,
                      uid: `rc-upload-${Date.now()}`, // Generate a unique ID
                    };
                    setFileList((prev) => [...prev, customObject]);
                  }
                  // }
                }}
              />
              <div className="flex flex-col items-center">
                <img src={BannerUpload} alt="upload" className="w-[110px] " />
                <Text className="!mb-0 text-center">
                  Click to upload, or drag and drop
                </Text>
              </div>
            </div>
          ) : (
            <div>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList?.length >= 8 ? null : uploadButton}
              </Upload>

              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </div>
          )}
        </Form.Item>
      </Form>
    </ModalComponent>
  );
}
