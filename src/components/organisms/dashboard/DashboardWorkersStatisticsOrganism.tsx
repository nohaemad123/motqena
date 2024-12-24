"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function DashboardWorkersStatisticsChartOrganism({ statisticsData }: { statisticsData: any }) {
  const { t } = useTranslation();
  const [activeWorkersCount, setActiveWorkersCount] = useState(0);
  const [inactiveWorkersCount, setInactiveWorkersCount] = useState(0);

  useEffect(() => {
    if (statisticsData) {
      setActiveWorkersCount(statisticsData?.filter((item: any) => item.isActive)[0]?.count);
      setInactiveWorkersCount(statisticsData?.filter((item: any) => !item.isActive)[0]?.count);
    }
  }, [statisticsData]);

  return (
    <div className="grid items-start justify-between w-full grid-cols-1 gap-4 mt-3 lg:grid-cols-2">
      {/* Active Workers */}
      <div className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm workers-item">
        <div className="flex flex-col gap-3 text">
          <p className="mb-0">
            <span className="inline-block w-2 h-2 bg-green-600 rounded-full badge"></span>
            <span className="mx-2 text-lg title text-[var(--primary)]">{t("DashboardPage.active_workers")}</span>
          </p>
          <p className="mb-0 number">
            <span className="text-black head"> {t("DashboardPage.count")}: </span>
            <span className="ms-2 text-lg data text-[var(--primary)]">{activeWorkersCount}</span>
            <span className="text ms-1 text-[var(--primary)]"> {t("DashboardPage.worker")}</span>
          </p>
        </div>
      </div>

      {/* Inactive Workers */}
      <div className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm workers-item">
        <div className="flex flex-col gap-3 text">
          <p className="mb-0">
            <span className="inline-block w-2 h-2 bg-red-600 rounded-full badge"></span>
            <span className="mx-2 text-lg title text-[var(--primary)]">{t("DashboardPage.inactive_workers")}</span>
          </p>
          <p className="mb-0 number">
            <span className="text-black head">{t("DashboardPage.count")}: </span>
            <span className="ms-2 text-lg data text-[var(--primary)]">{inactiveWorkersCount}</span>
            <span className="text ms-1 text-[var(--primary)]"> {t("DashboardPage.worker")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
