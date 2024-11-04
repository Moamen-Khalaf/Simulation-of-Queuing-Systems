import { Bar } from "@ant-design/plots";
import useSIMStore from "../store/simulation/simulationStore";

const SimulationChart = () => {
  const table = useSIMStore((state) => state.simulationTable);
  const events = table.slice(1).map((row) => {
    return {
      name: `CUSTOMER ${row[0].v}`,
      startTime: +row[2].v,
      endTime: +row[7].v,
      waitingTime: row[8].v === "SERV" ? 0 : +row[8].v,
      duration: +row[7].v - +row[2].v,
    };
  });

  const config = {
    data: events,
    xField: "name",
    yField: ["startTime", "endTime", "waitingTime", "duration"],
    colorField: "name",
  };
  return (
    <div className="w-full lg:w-[80%] mx-auto">
      <Bar {...config} />
    </div>
  );
};
export default SimulationChart;
