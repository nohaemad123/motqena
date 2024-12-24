"use client";

import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import logo from "@/assets/images/logo-colored.svg";
import Image from "next/image";
import Link from "next/link";
import { SidebarLink, activeLink } from "@/@types/styles";
import main from "@/assets/images/main.svg";
import branches from "@/assets/images/branches.svg";
import workers from "@/assets/images/workers.svg";
import users from "@/assets/images/users.svg";
import orders from "@/assets/images/orders.svg";
import messages from "@/assets/images/messages.svg";
import permissions from "@/assets/images/permissions.svg";
import services_type from "@/assets/images/services-type.svg";
import services_system from "@/assets/images/services-system.svg";
import shifts from "@/assets/images/shifts.svg";
import nationalities from "@/assets/images/nationalities.svg";
import jobs from "@/assets/images/jobs.svg";
import ad from "@/assets/images/ad.svg";
import document from "@/assets/images/document.svg";
import document_report from "@/assets/images/receive-square.svg";
import { usePathname } from "next/navigation";
import { classNameGen } from "@/lib/cn";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useState } from "react";

export default function SidebarContentOrganism() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const pathnameArr = pathname.split("/").filter((x) => x);
  const [openTab, setOpenTab] = useState(0);

  const isActive = (route: string) => pathnameArr[0] === route;
  const listButtonStyle = (route: string) => (isActive(route) ? activeLink : SidebarLink);

  const handleOpenTab = (tab: number) => {
    setOpenTab((prev) => (prev === tab ? 0 : tab));
  };

  return (
    <div className="py-3 max-w-[300px] w-full">
      <div className="text-center">
        <Image src={logo} alt="logo" width={130} height={80} />
      </div>
      <hr className="my-3 border-0 h-[1px] bg-[#E8EEEE]" />
      <List className="space-y-2 w-[280px]">
        <ListItemButton
          className="gap-2.5"
          LinkComponent={Link}
          href={`/dashboard`}
          sx={pathname === "/dashboard" ? activeLink : SidebarLink}
        >
          <Image src={main} alt="logo" width={24} className={classNameGen(pathname === "/dashboard" && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("Dashboard")}</ListItemText>
        </ListItemButton>
        <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/branches`} sx={listButtonStyle(`branches`)}>
          <Image src={branches} alt="logo" width={24} className={classNameGen(isActive(`branches`) && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("Branches")}</ListItemText>
        </ListItemButton>
        <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/jobs`} sx={listButtonStyle(`jobs`)}>
          <Image src={jobs} alt="logo" width={24} className={classNameGen(isActive(`jobs`) && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("Jobs")}</ListItemText>
        </ListItemButton>
        <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/workers`} sx={listButtonStyle(`workers`)}>
          <Image src={workers} alt="logo" width={24} className={classNameGen(isActive(`workers`) && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("Workers")}</ListItemText>
        </ListItemButton>
        <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/nationality`} sx={listButtonStyle(`nationality`)}>
          <Image src={nationalities} alt="logo" width={24} className={classNameGen(isActive(`nationality`) && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("Nationalities")}</ListItemText>
        </ListItemButton>

        <ListItemButton className="gap-2.5" sx={listButtonStyle(`services`)} onClick={() => handleOpenTab(3)}>
          <Image src={services_type} alt="logo" width={24} />
          <ListItemText>{t("services")}</ListItemText>
          {openTab === 3 ? <HiChevronUp className="w-5 h-5" /> : <HiChevronDown className="w-5 h-5" />}
        </ListItemButton>
        <Collapse in={openTab === 3} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              className="gap-2.5"
              LinkComponent={Link}
              href={`/systems-services`}
              sx={listButtonStyle(`systems-services`)}
            >
              <Image src={services_system} alt="logo" width={24} className={classNameGen(isActive(`systems-services`) && "invert")} />
              <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("System Services")}</ListItemText>
            </ListItemButton>
            <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/services-types`} sx={listButtonStyle(`services-types`)}>
              <Image src={services_type} alt="logo" width={24} className={classNameGen(isActive(`services-types`) && "invert")} />
              <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("Services types")}</ListItemText>
            </ListItemButton>
            <ListItemButton
              className="gap-2.5"
              LinkComponent={Link}
              href={`/provided-services`}
              sx={listButtonStyle(`provided-services`)}
            >
              <Image src={services_type} alt="logo" width={24} className={classNameGen(isActive(`provided-services`) && "invert")} />
              <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("Provided services")}</ListItemText>
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/shifts`} sx={listButtonStyle(`shifts`)}>
          <Image src={shifts} alt="logo" width={24} className={classNameGen(isActive(`shifts`) && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("Shifts")}</ListItemText>
        </ListItemButton>
        <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/orders`} sx={listButtonStyle(`orders`)}>
          <Image src={orders} alt="logo" width={24} className={classNameGen(isActive(`orders`) && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("orders")}</ListItemText>
        </ListItemButton>
        <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/advertisements`} sx={listButtonStyle(`advertisements`)}>
          <Image src={ad} alt="logo" width={24} className={classNameGen(isActive(`advertisements`) && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("advertisements")}</ListItemText>
        </ListItemButton>
        <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/messages`} sx={listButtonStyle(`messages`)}>
          <Image src={messages} alt="logo" width={24} className={classNameGen(isActive(`messages`) && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("messages")}</ListItemText>
        </ListItemButton>
        <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/users`} sx={listButtonStyle(`users`)}>
          <Image src={users} alt="logo" width={24} className={classNameGen(isActive(`users`) && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("users")}</ListItemText>
        </ListItemButton>
        <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/users-permissions`} sx={listButtonStyle(`users-permissions`)}>
          <Image src={permissions} alt="logo" width={24} className={classNameGen(isActive(`users-permissions`) && "invert")} />
          <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("users permissions")}</ListItemText>
        </ListItemButton>

        <ListItemButton className="gap-2.5" sx={listButtonStyle(`reports`)} onClick={() => handleOpenTab(2)}>
          <Image src={document} alt="logo" width={24} />
          <ListItemText>{t("reports")}</ListItemText>
          {openTab === 2 ? <HiChevronUp className="w-5 h-5" /> : <HiChevronDown className="w-5 h-5" />}
        </ListItemButton>
        <Collapse in={openTab === 2} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton className="gap-2.5" LinkComponent={Link} href={`/orders-reports`} sx={listButtonStyle(`orders-reports`)}>
              <Image src={document_report} alt="logo" width={24} className={classNameGen(isActive(`orders-reports`) && "invert")} />
              <ListItemText sx={{ fontSize: "18px", margin: "4px 0" }}>{t("orders-reports")}</ListItemText>
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </div>
  );
}
