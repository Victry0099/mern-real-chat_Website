// import React from "react";

// import { Line, Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   Tooltip,
//   CategoryScale,
//   LinearScale,
//   ArcElement,
//   Filler,
//   PointElement,
//   LineElement,
//   Legend,
//   scales,
// } from "chart.js";

// ChartJS.register(
//   Tooltip,
//   CategoryScale,
//   LinearScale,
//   ArcElement,
//   Filler,
//   PointElement,
//   LineElement,
//   Legend
// );

// const lineChartOptions = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top",
//       display: false,
//     },
//     title: {
//       display: true,
//       text: "Chart.js Line Chart",
//     },
//   },

//   scales: {
//     x: {
//       grid: {
//         display: false,
//       },
//     },
//     y: {
//       beginAtZero: true,
//       grid: {
//         display: false,
//       },
//     },
//   },
// };

// const LineChart = () => {
//   const data = {
//     labels: ["jan", "feb", "mar", "apr", "may", "jun"],
//     datasets: [{ data: [10, 20, 30, 40, 50, 60] }],
//   };

//   return <Line data={data} options={lineChartOptions} />;
// };

// const DoughnutChart = () => {
//   return <Doughnut />;
// };

// export { LineChart, DoughnutChart };

import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { getLast7Days } from "../../lib/features";
import { purple, purpleLight } from "../../constants/color";

ChartJS.register(...registerables);

const labels = getLast7Days();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: true,
      text: " Chat Messages",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,

        label: "Line Chart",
        borderColor: purple,
        fill: true,
        backgroundColor: purpleLight,
        hoverBackgroundColor: "blue",
        hoverBorderColor: "blue",
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: false,
      text: " Line Chart",
    },
  },
  cutout: 80,
};

const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Doughnut Chart",
        data: value,
        backgroundColor: ["#FF6384", "#36A2EB"],
        borderColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: purpleLight,
        offset: 10,
      },
    ],
  };

  return (
    <Doughnut
      style={{
        zIndex: 10,
        cursor: "pointer",
      }}
      data={data}
      options={doughnutChartOptions}
    />
  );
};

export { LineChart, DoughnutChart };
