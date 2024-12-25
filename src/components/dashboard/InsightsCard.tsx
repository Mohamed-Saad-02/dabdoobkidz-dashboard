export default function InsightsCard({ title, value, imgSrc }) {
  return (
    <div className="bg-white  p-4 flex flex-col gap-[12px] w-[100%] shadow-md   rounded-lg">
      <div className="flex justify-between">
        <span>{title}</span>
        <img src={imgSrc} alt="" />
      </div>
      <h1 className="font-[800] text-[24px]">{value}</h1>
    </div>
  );
}
