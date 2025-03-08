"use client"

import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

export function LineChart() {
  const data = {
    labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
    datasets: [
      {
        label: "Ventas ($)",
        data: [12000, 19000, 15000, 17000, 22000, 25000, 20000],
        borderColor: "rgb(201, 162, 39)",
        backgroundColor: "rgba(201, 162, 39, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(201, 162, 39)",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleFont: {
          size: 13,
          weight: "bold",
          family: "Inter",
        },
        bodyFont: {
          size: 12,
          family: "Inter",
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.04)",
        },
        ticks: {
          font: {
            family: "Inter",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "Inter",
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  }

  return <Line options={options} data={data} />
}

export function BarChart() {
  const data = {
    labels: ["Pizza Margherita", "Burger Classic", "Ensalada César", "Pasta Alfredo", "Sushi Mix"],
    datasets: [
      {
        label: "Unidades vendidas",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "rgba(201, 162, 39, 0.8)",
        borderRadius: 8,
        maxBarThickness: 40,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleFont: {
          size: 13,
          weight: "bold",
          family: "Inter",
        },
        bodyFont: {
          size: 12,
          family: "Inter",
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.04)",
        },
        ticks: {
          font: {
            family: "Inter",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "Inter",
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  }

  return <Bar options={options} data={data} />
}

