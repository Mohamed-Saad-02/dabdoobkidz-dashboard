import { Button } from "antd";
import Empty from "../../assets/common/empty.svg";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
export default function EmptyComponent({
  text,
  description,
  link
}: {
  text: string;
  description: string;
  link?: string;
}) {
    const navigate = useNavigate();
  return (
    <div className="w-full h-[70vh] flex justify-center items-center text-center">
      <div className="flex flex-col gap-6 w-[400px]">
        <img src={Empty} className="w-[240px] mx-auto" alt="empty image" />
        <div>
          <h1 className="text-2xl font-bold">No available {text}</h1>
          <p className="text-gray-400">{description}</p>
          <Button
            onClick={()=>{
                navigate(link)
            }}
          type="primary" prefix={PlusOutlined} className="mt-4 w-full">
            Add {text}
          </Button>
        </div>
      </div>
    </div>
  );
}
