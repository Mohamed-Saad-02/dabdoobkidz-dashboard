import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomBarShape = (props) => {
  const { x, y, width, height, fill } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rx={10} // Adjust this value for border radius
      ry={2} // Adjust this value for border radius
    />
  );
};

export default function BarChartComponent() {
  const data = [
    {
      name: "1-10 Aug",
      sales: 1000,
    },
    {
      name: "10-10 Aug",
      sales: 2000,
    },
    {
      name: "20-10 Aug",
      sales: 3000,
    },
    {
      name: "30-10 Aug",
      sales: 4000,
    },
  ];
  return (
    <ResponsiveContainer width="100%" height={400} className="mt-6">
      <BarChart
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barSize={40}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="sales"
          fill="#AD6B46"
          shape={<CustomBarShape />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}