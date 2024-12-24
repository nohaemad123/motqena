"use client";

import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApexOptions } from "apexcharts";

export default function DashboardCompaniesChartOrganism({ chartData }: { chartData: any }) {
  const { t } = useTranslation();
  const [chartOptions, setChartOptions] = useState({
    series: [],
    options: {
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      colors: [
        "#56B948",
        "#195950",
        "#56B948",
        "#195950",
        "#56B948",
        "#195950",
        "#56B948",
        "#195950",
        "#56B948",
        "#195950",
        "#56B948",
        "#195950",
      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
          borderRadius: 15,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      yaxis: {
        opposite: true,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#333",
            fontSize: "14px",
          },
        },
      },
    } as ApexOptions,
  });

  useEffect(() => {
    if (chartData) {
      setChartOptions((prev: any) => ({
        ...prev,
        series: [
          {
            name: "الشركات",
            data: chartData.map((company: any) => company.count),
          },
        ],
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: chartData.map((company: any) => company.month),
          },
        },
      }));
    }
  }, [chartData]);

  return (
    <div>
      <p className="title font-bold text-[var(--primary)] text-lg">{t("DashboardPage.companies")}</p>
      <Chart options={chartOptions.options} series={chartOptions.series} type="bar" height={350} />
    </div>
  );
}