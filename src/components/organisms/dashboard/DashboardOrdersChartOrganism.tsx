"use client";

import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApexOptions } from "apexcharts";

export default function DashboardOrdersChartOrganism({ chartData }: { chartData: any }) {
  const { t } = useTranslation();
  const [chartOptions, setChartOptions] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
      },
      labels: [],
      colors: ["#195950", "#56B948", "#091F1C"], // Adjust colors as needed
      plotOptions: {
        pie: {
          donut: {
            size: "50%", // Adjust thickness
            labels: {
              show: true,
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
          },
        },
      ],
      legend: {
        position: "bottom",
        offsetY: 0,
        height: 50,
      },
    } as ApexOptions,
  });

  useEffect(() => {
    if (chartData) {
      setChartOptions((prev: any) => ({
        ...prev,
        series: chartData.map((order: any) => order.count),
        options: {
          ...prev.options,
          labels: chartData.map((order: any) => order.status),
        },
      }));
    }
  }, [chartData]);

  return (
    <div>
      <p className="title font-bold text-[var(--primary)] text-lg">{t("DashboardPage.orders")}</p>
      <div id="orders-chart">
        <Chart options={chartOptions.options} series={chartOptions.series} type="donut" height={350} />
      </div>
    </div>
  );
}
