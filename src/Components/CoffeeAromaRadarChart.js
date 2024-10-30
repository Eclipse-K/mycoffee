import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js에 필요한 컴포넌트 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function CoffeeAromaRadarChart({ title, flavorDetails }) {
  const data = {
    labels: ["달콤함", "산미", "바디감", "후미", "풍미의 강도"],
    datasets: [
      {
        label: `${title}의 아로마 프로파일`,
        data: [
          flavorDetails.sweetness || 0,
          flavorDetails.acidity || 0,
          flavorDetails.body || 0,
          flavorDetails.aftertaste || 0,
          flavorDetails.intensity || 0,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        stepSize: 1,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="Flavor-Pentagon">
      <Radar data={data} options={options} />;
    </div>
  );
}

export default CoffeeAromaRadarChart;
