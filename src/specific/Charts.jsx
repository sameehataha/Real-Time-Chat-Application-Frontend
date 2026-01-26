import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  scales,
} from "chart.js/auto";

ChartJS.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  Legend
);
import {getLast7Days} from "../lib/features"
const labels = getLast7Days()
const LineChartOptions =  {
    responsive:true,
    plugins: {
      legend: {
         display:false,
      },
       title: {
        display:false,
       },
       scales:{
        x: {
            grid:{
                display:false,
            },
        },
        y: {
            beginAtZero: true,
            grid:{
             display:false
            // display:false,
        },
       },
},
}
}
const LineChart = ({dataArray=[]}) => {
  const data = {
    labels,
    datasets: [ 
      {  data: dataArray,
         label: "Total Chats VS Group Charts",
         fill:false,
         backgroundColor: "rgba(168, 46, 234, 0.6)", 
         borderColor: "rgba(83, 90, 236, 1)",
         pointBackgroundColor: "rgba(3, 26, 117, 1)",
         pointBorderColor: "#fff",
         tension: 0.4,
      },
      {  data: dataArray,
         label: "Revenue2",
         fill:true,
         backgroundColor: "rgba(168, 46, 234, 0.6)", 
         borderColor: "rgba(83, 90, 236, 1)",
         pointBackgroundColor:  "rgba(3, 26, 117, 1)",
         pointBorderColor: "#fff",
         tension: 0.4,
      }
    ],
  };
  return <Line data={data}  options={LineChartOptions}/>;
};
const DoughnutChart = ({ dataArray = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: dataArray,
        offset:40,
        backgroundColor: [
          "rgba(168, 46, 234, 0.6)", 
          "rgba(27, 112, 230, 0.6)",  
        ],
        borderColor: [
          "rgba(106, 101, 243, 1)",
          "rgba(27, 112, 230, 1)",
        ],
        hoverBackgroundColor: [
          "rgba(168, 46, 234, 0.3)", 
          "rgba(27, 112, 230, 0.3)",  
        ],

        borderWidth: 2,
        cutout: "80%", 
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut style={{zIndex:10}} data={data} options={options} />;
};

export { LineChart, DoughnutChart };
