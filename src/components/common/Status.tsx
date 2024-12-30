type StatusProps = {
  status: string;
  text: string;
};

export default function Status({ status, text }: StatusProps) {
  let style = "";
  const success = "bg-[#999] text-[#444]";
  const error = "bg-[#999] text-[#444]";
  const pending = "bg-[#999] text-[#444]";
  const warining = "bg-[#999] text-[#444]";
  const info = "bg-[#999] text-[#444]";
  if (status === "success") {
    style = success;
  } else if (status === "error") {
    style = error;
  } else if (status === "pending") {
    style = pending;
  } else if (status === "warning") {
    style = warining;
  } else if (status === "info") {
    style = info;
  }
  console.log(status, text, "status");

  return (
    <div className={`text-[14px] font-[500] w-fit p-1 rounded-md ${style}`}>
      {text}
    </div>
  );
}
