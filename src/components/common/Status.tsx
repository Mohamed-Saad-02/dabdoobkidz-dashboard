type StatusProps = {
  status: string;
  text: string;
};

export default function Status({ status, text }: StatusProps) {
  let style = "";
  const success = "bg-[#D7F0E580] text-[#36B37E]";
  const error = "bg-[#FFDDD680] text-[#FF5630]";
  const pending = "bg-[#CCE0FF80] text-[#0065FF]";
  const warining = "bg-[#FFFAE580] text-[#FFAB00]";
  const info = "bg-[#E5E7EB] text-[#3B4453]";
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
  console.log(status , text , "status");
  

  return (
    <div className={`text-[14px] font-[500] w-fit p-1 rounded-md ${style}`}>
      {text}
    </div>
  );
}
