"use client";

import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApexOptions } from "apexcharts";

export default function DashboardWorkersChartOrganism({ chartData }: { chartData: any }) {
  const { t } = useTranslation();
  const [chartOptions, setChartOptions] = useState({
    series: [],
    options: {
      chart: {
        type: "area",
        height: 250,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          type: "vertical",
          gradientToColors: ["#56B948"], // End color of the gradient
          opacityFrom: 0.7, // Starting opacity
          opacityTo: 0.3, // Ending opacity
          stops: [0, 90, 100], // Gradient transition points
        },
      },
      stroke: {
        curve: "smooth",
        colors: ["#195950"],
        dashArray: 5,
      },
      labels: [], // Placeholder for date labels
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        opposite: true,
      },
      legend: {
        horizontalAlign: "left",
      },
    } as ApexOptions,
  });

  useEffect(() => {
    if (chartData) {
      setChartOptions((prev: any) => ({
        ...prev,
        series: [
          {
            name: "عامل", // Worker (in Arabic)
            data: chartData.map((worker: any) => worker?.count),
          },
        ],
        options: {
          ...prev.options,
          labels: [
            "1 Jan 2017",
            "1 Feb 2017",
            "1 Mar 2017",
            "1 Apr 2017",
            "1 May 2017",
            "1 Jun 2017",
            "1 Jul 2017",
            "1 Aug 2017",
            "1 Sep 2017",
            "1 Oct 2017",
            "1 Nov 2017",
            "1 Dec 2017",
          ],
        },
      }));
    }
  }, [chartData]);

  return (
    <div>
      <p className="title font-bold text-[var(--primary)] text-lg">{t("DashboardPage.workers")}</p>
      <div id="chart">
        <Chart options={chartOptions.options} series={chartOptions.series} type="area" height={250} />
      </div>
    </div>
  );
}
