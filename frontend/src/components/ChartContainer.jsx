import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
  
  import { Line } from "react-chartjs-2";
  import { useData } from "../contexts/DataContext";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  
  function ChartContainer() {
    const { metrics } = useData();
  
    const data = {
      labels: metrics.months || [],
  
      datasets: [
        {
          label: "Revenue",
  
          data: metrics.revenueHistory || [],
  
          borderColor: "#3b82f6",
  
          backgroundColor: "rgba(59,130,246,.2)",
  
          tension: 0.4,
  
          fill: true,
        },
      ],
    };
  
    const options = {
      responsive: true,
  
      plugins: {
        legend: {
          position: "top",
        },
  
        title: {
          display: true,
          text: "Revenue Overview",
        },
      },
    };
  
    return (
      <div className="chart-card">
        <Line data={data} options={options} />
      </div>
    );
  }
  
  export default ChartContainer;