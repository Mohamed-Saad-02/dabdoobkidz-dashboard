import { Progress } from "antd";

export default function OutletStats() {
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex gap-4 items-center">
        <span className="text-gray w-fit">New york</span>
        <div className="flex flex-col w-[80%]">
          <Progress
            percent={33}
           
            strokeColor="#AD6B46"
            size={{ height : 20}}
            percentPosition={{ align: 'end', type: 'outer' }}
          />
          <Progress
            percent={80}
            showInfo={false}
            strokeColor="#E5E7EB"
            size={{ height : 20}}
            percentPosition={{ align: 'end', type: 'outer' }}

          />
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <span className="text-gray w-fit">New york</span>
        <div className="flex flex-col w-[80%]">
          <Progress
            percent={50}
           
            strokeColor="#AD6B46"
            size={{ height : 20}}
            percentPosition={{ align: 'end', type: 'outer' }}
          />
          <Progress
            percent={90}
            showInfo={false}
            strokeColor="#E5E7EB"
            size={{ height : 20}}
            percentPosition={{ align: 'end', type: 'outer' }}

          />
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <span className="text-gray w-fit">New york</span>
        <div className="flex flex-col w-[80%]">
          <Progress
            percent={70}
           
            strokeColor="#AD6B46"
            size={{ height : 20}}
            percentPosition={{ align: 'end', type: 'outer' }}
          />
          <Progress
            percent={20}
            showInfo={false}
            strokeColor="#E5E7EB"
            size={{ height : 20}}
            percentPosition={{ align: 'end', type: 'outer' }}

          />
        </div>
      </div>
    </div>
  );
}
