import React from "react";
import { Recatangle } from "../../assets/images";
const SalesCard = ({ values, title }: { values: number; title: string }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${Recatangle})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
      className="rounded-lg bg-gradient-to-br w-full bg-white p-4"
    >
      <div className="p-4 flex flex-col gap-[8px]">
        <div className="text-sm text-gray-500 mb-2 font-[500] text-[26px]">
          Total {title}
        </div>
        <div className="text-3xl font-bold text-black mb-2">{values} {
          title === "Sales" ? "EGP" : "Users"
          }</div>

      </div>
    </div>
  );
};

export default SalesCard;
