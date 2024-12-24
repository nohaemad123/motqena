"use client";

import { useTranslation } from "react-i18next";
import BgImage from "@/assets/images/statistics-card-bg-shape.png";
import CompanyIcon from "@/assets/images/company-icon.svg";
import OrdersIcon from "@/assets/images/orders-icon.svg";
import WorkersIcon from "@/assets/images/workers-icon.svg";
import ServicesIcon from "@/assets/images/services-pricing-icon.svg";
import ArrowIcon from "@/assets/images/arrow-icon.svg";
import Image from "next/image";
import { Button } from "@mui/material";
import Link from "next/link";
import { IHomeData } from "@/@types/interfaces/IHomeData";

export default function DashboardStatisticsOrganism({ statistics }: { statistics: IHomeData }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const cardsData = [
    {
      id: 1,
      icon: CompanyIcon,
      title: t("DashboardPage.companies"),
      count: statistics.companiesCount,
      text: t("DashboardPage.companies_count"),
      link: "/Companies",
    },
    {
      id: 2,
      icon: WorkersIcon,
      title: t("DashboardPage.workers"),
      count: statistics.workersCount,
      text: t("DashboardPage.workers_count"),
      link: "/Workers",
    },
    {
      id: 3,
      icon: OrdersIcon,
      title: t("DashboardPage.orders"),
      count: statistics.ordersCount,
      text: t("DashboardPage.orders_count"),
      link: "/Orders",
    },
    {
      id: 4,
      icon: ServicesIcon,
      title: t("DashboardPage.services_pricing"),
      count: statistics.servicePriceCount,
      text: t("DashboardPage.services_pricing_count"),
      link: "/Services-Pricing",
    },
  ].filter((item) => item.count != null);

  return (
    <div
      className={`grid w-full grid-cols-1 gap-2  
              ${
                cardsData.length == 1
                  ? "lg:grid-cols-1"
                  : cardsData.length == 2
                    ? "lg:grid-cols-2"
                    : cardsData.length == 3
                      ? "lg:grid-cols-3"
                      : "lg:grid-cols-4"
              }

            `}
    >
      {cardsData.map((card) => (
        <div key={card.id} className="card relative bg-white shadow-sm p-4 overflow-hidden h-auto rounded-lg">
          <Image src={BgImage} alt="statistics-card-bg-shape" width="120" height="100" className="absolute start-0 top-0 h-full" />
          <div className="top-wrapper flex items-center justify-start">
            <div className="icon_wrapper bg-green-gradient rounded-md w-10 h-10 p-4 flex justify-center items-center">
              <Image src={card.icon} width={24} height={24} alt={card.title} />
            </div>
            <span className="title text[#195950] text-lg font-semibold ms-2">{card.title}</span>
          </div>
          <div className="count flex items-center justify-between py-3">
            <span className="text[#195950]">{card.text}</span>
            <span className="text-md bg-green-gradient p-1 px-2 rounded-[20px] block text-white">{card.count}</span>
          </div>
          <Button className="w-full text-center bg-green-gradient rounded-[20px] !mt-2 block">
            <Link href={card.link} className="no-underline text-white flex items-center justify-center gap-2">
              <span>{t("DashboardPage.ViewAll")}</span>
              <Image
                src={ArrowIcon}
                alt="arrow-icon"
                width={24}
                height={24}
                className={`${currentLanguage === "en" ? "scale-x-[-1]" : ""}`}
              />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
