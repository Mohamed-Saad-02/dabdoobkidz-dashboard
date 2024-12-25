import {
  Button,
  Form,
  Image,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useState } from "react";
import { UploadIcon } from "../../assets/icons/index";

const { Text } = Typography;

const ImageUploadComponent = ({
  setSelctedImages,
  selecedImages,
  type,
}: {
  setSelctedImages: () => void;
  selecedImages: any;
  type: string;
}) => {
  console.log(selecedImages, "selecedImagesinproducts");

  const [fileList, setFileList] = useState<UploadFile[]>(selecedImages);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setSelctedImages(newFileList);
  };

  console.log(previewImage, "fileListinproduct");

  return (
    <div className="flex gap-4">
      <Form.Item
        name={`images`}
        rules={[
          {
            validator: (_, value) => {
              if (selecedImages.length === 0) {
                return Promise.reject("Please upload atleast one image");
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Upload
          listType="picture-card"
          fileList={selecedImages}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {selecedImages.length < 4 && (
            <div className="flex flex-col gap-1 ">
              <img className="w-[32px] mx-auto" src={UploadIcon} alt="" />
              <Button size="small" type="primary">
                Add Image
              </Button>
              <Text className="text-[10px]">or drop image to upload</Text>
            </div>
          )}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Form.Item>
    </div>
  );
};

export default ImageUploadComponent;
