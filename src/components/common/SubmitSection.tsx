import { Button, FormInstance } from "antd";

export default function SubmitSection({
  isLoading,
  form,
}: {
  isLoading: boolean;
  form: FormInstance;
}) {
  return (
    <div className="flex justify-between bg-white p-4 rounded-[10px] ">
      <div className="flex gap-2 ">
        <div className="flex gap-2 items-center">
          {/* <img className="w-[24px]" src={DoubleCheck} alt="seen icon" /> */}
          {/* <Text>Last Saved 2 hours ago</Text> */}
        </div>
      </div>
      <Button
        loading={isLoading}
        onClick={() => {
          form.submit();
        }}
        className="mx-4 bg-[#E5E7EB]"
      >
        Save
      </Button>
    </div>
  );
}
