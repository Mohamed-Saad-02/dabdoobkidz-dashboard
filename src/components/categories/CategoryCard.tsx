import { ArrowRightOutlined } from "@ant-design/icons";
import { Card, Checkbox, Typography } from "antd";
import { Category } from "../../types/Categories";

export default function CategoryCard({ category }: { category: Category }) {
  const { Title, Text } = Typography;

  return (
    <Card
      cover={
        <div className="relative ">
          <img
            className="peer h-[144px] object-contain w-full mx-auto hover:filter hover:brightness-75 transition-all duration-300 ease-in-out"
            alt="cover image"
            src={category.images[0]}
          />
          <Checkbox className="absolute top-2 left-4" />
          <span className="absolute peer-hover:opacity-100 hover:opacity-100 transform translate-x-[-50%] top-[50%] left-[50%] opacity-0 bg-transparent border text-[14px] text-white font-[500] px-[8px] border-white">
            <div className="flex items-center gap-2 ">
              <span>Details</span>
              <ArrowRightOutlined />
            </div>
          </span>
        </div>
      }
    >
      <div className="flex flex-col">
        <Title level={3}>{category.name}</Title>
        <Text className="text-[18px]" type="secondary">
          this is descripition
        </Text>
      </div>
    </Card>
  );
}
