import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input } from "antd";

const options = [
  {
    value: "Burns Bay Road",
  },
  {
    value: "Downing Street",
  },
  {
    value: "Wall Street",
  },
];

export default function NavAutoComplete() {
  return (
    <AutoComplete options={options} style={{ width: 300 }}>
      <Input
        className="bg-background"
        prefix={
          <SearchOutlined style={{ fontSize: "18px", borderRadius: "8px" }} />
        }
        placeholder="Searh Here...."
      />
    </AutoComplete>
  );
}
