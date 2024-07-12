import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesChart({ salesData }) {
  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Data Penjualan & Pesanan",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const labels = salesData?.map((data) => data?.date);

  const data = {
    labels,
    datasets: [
      {
        label: "Penjualan",
        data: salesData?.map((data) => data?.sales),
        borderColor: "rgb(34, 197 ,94)",
        backgroundColor: "rgba(134, 239, 172, 0.8)",
        yAxisID: "y",
      },
      {
        label: "Pesanan",
        data: salesData?.map((data) => data?.numOfOrders),
        borderColor: "rgb(234, 179, 8)",
        backgroundColor: "rgba(253, 224, 71, 0.8)",
        yAxisID: "y1",
      },
    ],
  };
  return <Line options={options} data={data} />;
}
