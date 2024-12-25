import { PlusCircleOutlined } from "@ant-design/icons";
import ModalComponent from "../ui/Modal";
import { useRef } from "react";
import { Button } from "antd";

type ProfilePicProps = {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  image: string;
  setImg: (value: string) => void;
  onChange?: (file: File) => void;
};

export default function ProfilePic({
  isModalOpen,
  setModalOpen,
  image,
  setImg,
  onChange,
}: ProfilePicProps) {
  const profileRef = useRef();
  const handleOk = () => {
    setModalOpen(false);
  };

  const handleCancel = () => {


    setModalOpen(false);
  };

  return (
    <ModalComponent
      isModalOpen={isModalOpen}
      handleOk={handleOk}
      handleCancel={handleCancel}
      title="Edit Avatar"
      width="50%"
      footer={
        <div className="flex gap-4 justify-end">
          <Button>Cancel</Button>
          <Button 
            type="primary"
            onClick={handleOk}
          >Ok</Button>
        </div>
      }
    >
      <div className=" mx-auto ">
        <div className="w-full h-full flex justify-center ">
          <div
            onClick={() => {
              profileRef?.current.click();
            }}
            className="bg-background flex justify-center items-center border border-dashed cursor-pointer border-textgray h-[350px] w-[350px] m-4"
          >
            {image ? (
              <div className="w-full relative ">
                <img
                  src={image}
                  alt="Profile"
                  className="h-full w-full peer object-cover hover:brightness-75 transition-all duration-300 ease-in-out rounded-md"
                />
              </div>
            ) : (
              <PlusCircleOutlined className="text-4xl text-textgray " />
            )}
          </div>
          <div className="flex items-end m-4">
            <label
              className="cursor-pointer bg-[#E5E7EB] text-black px-4 py-2 rounded-md"
              htmlFor="file-upload"
            >
              Replace
            </label>
          </div>
          <input
            id="file-upload"
            type="file"
            ref={profileRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImg(reader.result as string);
                };
                reader.readAsDataURL(file);
               

                onChange && onChange(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>
    </ModalComponent>
  );
}
