import { useEffect, useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";

export function StockChart(props) {
  const [chartData, setChartData] = useState([]);
  let stockData = props.data;
  async function getChartData() {
    let tableData = [];
    for (let x in stockData) {
      tableData.push({
        time: stockData[x].time,
        open: stockData[x].open,
        high: stockData[x].high,
        low: stockData[x].low,
        close: stockData[x].close,
      });
    }
    tableData.reverse();
    setChartData(tableData);
  }
  useEffect(() => {
    (async () => {
      await getChartData();
    })();
  }, [stockData]);

  const data = {
    labels: chartData.map((x) => x.time),

    datasets: [
      {
        label: "Open",
        data: chartData.map((x) => x.open),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "High",
        data: chartData.map((x) => x.high),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Low",
        data: chartData.map((x) => x.low),
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
      },
      {
        label: "Close",
        data: chartData.map((x) => x.close),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
}
