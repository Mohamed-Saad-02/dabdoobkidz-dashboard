import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import ProfilePic from "./ProfilePic";

export default function ProfileUpload({
  onChange,
  value,
}: {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}) {
  const [profilePicOpen, setProfilePicOpen] = useState(false);
  const [img, setImg] = useState<string | undefined>(value);
  useEffect(() => {
    setImg(value);
  }, [value]);

  return (
    <>
      <div
        onClick={() => {
          setProfilePicOpen(true);
        }}
        className="w-[100px] h-[100px] rounded-md"
      >
        <div className="w-full h-full">
          <div className="bg-background flex justify-center items-center border border-dashed cursor-pointer border-textgray h-[100px] w-[100px]">
            {img ? (
              <div className="w-full relative">
                <img
                  src={img}
                  alt="Profile"
                  className="h-full w-full peer object-cover hover:brightness-75 transition-all duration-300 ease-in-out rounded-md"
                />
                <span className="absolute peer-hover:opacity-100 hover:opacity-100 transform translate-x-[-50%] top-[50%] left-[50%] opacity-0 bg-transparent   text-white font-[500] px-[8px] ">
                  <div className="flex items-center gap-2 ">
                    <EditOutlined />
                  </div>
                </span>
              </div>
            ) : (
              <PlusCircleOutlined className="text-4xl text-textgray" />
            )}
          </div>
        </div>
      </div>
      <ProfilePic
        isModalOpen={profilePicOpen}
        setModalOpen={setProfilePicOpen}
        image={img ?? ""}
        setImg={setImg}
        onChange={onChange}
      />
    </>
  );
}
