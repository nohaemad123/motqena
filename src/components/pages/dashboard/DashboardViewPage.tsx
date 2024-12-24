"use client";

import { IHomeData } from "@/@types/interfaces/IHomeData";
import DashboardCompaniesChartOrganism from "@/components/organisms/dashboard/DashboardCompaniesChartOrganism";
import DashboardOrdersChartOrganism from "@/components/organisms/dashboard/DashboardOrdersChartOrganism";
import DashboardServicesChartOrganism from "@/components/organisms/dashboard/DashboardServicesChartOrganism";
import DashboardStatisticsOrganism from "@/components/organisms/dashboard/DashboardStatisticsOrganism";
import DashboardWorkersChartOrganism from "@/components/organisms/dashboard/DashboardWorkersChartOrganism";
import DashboardWorkersStatisticsChartOrganism from "@/components/organisms/dashboard/DashboardWorkersStatisticsOrganism";
import { getHomeData } from "@/services/loadData";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function DashboardViewPage() {
  const { i18n } = useTranslation();
  const [homeData, setHomeData] = useState<IHomeData>({} as IHomeData);

  function fetchHomeData() {
    getHomeData(i18n.language)
      .then((res: any) => {
        setHomeData(res.data);
      })
      .catch(console.log);
  }

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <>
      {homeData && (
        <div className="flex-grow w-full flex flex-col p-5">
          <DashboardStatisticsOrganism statistics={homeData} />
          <div className="charts-wrapper grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
            {homeData.companiesPerMonth?.length ? (
              <div className="branches-chart-wrapper bg-white shadow-sm rounded-lg p-5 col-span-1">
                <DashboardCompaniesChartOrganism chartData={homeData.companiesPerMonth} />
              </div>
            ) : null}
            {homeData.ordersByStatus?.length ? (
              <div className="orders-chart-wrapper bg-white shadow-sm rounded-lg p-5 col-span-1">
                <DashboardOrdersChartOrganism chartData={homeData.ordersByStatus} />
              </div>
            ) : null}
            {homeData?.workersPerMonth?.length || homeData?.workersPerActivity?.length ? (
              <div className="workers-chart-wrapper col-span-1">
                {homeData?.workersPerMonth?.length ? (
                  <div className="chart-wrapper bg-white shadow-sm rounded-lg p-5">
                    <DashboardWorkersChartOrganism chartData={homeData.workersPerMonth} />
                  </div>
                ) : null}
                {homeData?.workersPerActivity?.length ? (
                  <div className="workers-statistics-wrapper mt-4">
                    <DashboardWorkersStatisticsChartOrganism statisticsData={homeData.workersPerActivity} />
                  </div>
                ) : null}
              </div>
            ) : null}
            {homeData.servicePricePerMonth?.length ? (
              <div className="services-chart-wrapper bg-white shadow-sm rounded-lg p-5 col-span-1">
                <DashboardServicesChartOrganism chartData={homeData.servicePricePerMonth} />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
