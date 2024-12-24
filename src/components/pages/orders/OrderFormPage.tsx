"use client";

import { IOrder } from "@/@types/interfaces/IOrder";
import { fontCairo, table, tableBodyCell, tableHeadCell } from "@/@types/styles";
import { getOrderbyId } from "@/services/loadData";
import { Breadcrumbs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface IOrderFormTemplateProps {
  orderId?: string;
}

export default function OrderFormPage({ orderId }: Readonly<IOrderFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const [orderRes, setOrderRes] = React.useState<IOrder>();

  useEffect(() => {
    if (orderId && typeof orderId === "string") {
      getOrderbyId(i18n.language, orderId)
        .then((res) => {
          console.log(res);
          setOrderRes(res);
        })
        .catch(console.log);
    }
  }, [orderId]);

  return (
    <div className="flex-grow w-full flex flex-col p-5">
      <div className="w-full">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ ...fontCairo, marginBottom: "28px" }}>
          <Link color="inherit" href={"/orders"} className="text-base font-bold no-underline text-[var(--primary)]">
            {t("orders")}
          </Link>

          <Typography className="text-[15px] font-normal" sx={{ ...fontCairo, color: "text.primary" }}>
            {t("view order")}
          </Typography>
        </Breadcrumbs>

        <div className="p-5 bg-white">
          <h3 className="text-[15px] font-normal pb-2 border-x-0 border-t-0 border-b border-solid border-b-[#E4DDE9]">
            <span className="text-[15px]">{t("view order")}</span>
          </h3>

          {/* service details */}
          <div>
            <Typography
              variant="h6"
              sx={{ ...fontCairo, color: "var(--primary)", fontSize: "16px", fontWeight: "bold", margin: "28px 0 15px" }}
            >
              {t("service details")}
            </Typography>
            <TableContainer sx={table}>
              <Table>
                <TableHead sx={{ backgroundColor: "#E8EEEE", height: "32px" }}>
                  <TableRow>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("code")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("Nationality")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("contract duration")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("start date of service")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("branch name")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("City")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.code}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.nationalityName}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.agreementDuration}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.createdOn}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.branchName}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.cityName}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* worker details */}
          <div>
            <Typography
              variant="h6"
              sx={{ ...fontCairo, color: "var(--primary)", fontSize: "16px", fontWeight: "bold", margin: "28px 0 15px" }}
            >
              {t("worker details")}
            </Typography>
            <TableContainer sx={table}>
              <Table>
                <TableHead sx={{ backgroundColor: "#E8EEEE", height: "32px" }}>
                  <TableRow>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("name")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("gender")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("age")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("experience")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("religion")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("gender")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("work")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("language")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("skills")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.workerName}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.workerNationalityName}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.workerAge}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.workerYearsOfExperience}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.workerReligion}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.workerGender}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.workerJobName}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.workerLanguage}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.workerSkills}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* invoice details */}
          <div>
            <Typography
              variant="h6"
              sx={{ ...fontCairo, color: "var(--primary)", fontSize: "16px", fontWeight: "bold", margin: "28px 0 15px" }}
            >
              {t("invoice details")}
            </Typography>
            <TableContainer sx={table}>
              <Table>
                <TableHead sx={{ backgroundColor: "#E8EEEE", height: "32px" }}>
                  <TableRow>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("service type")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("value")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("discount")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("tax")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("total")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.serviceName}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.price}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.descount}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.tax}%
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.total} {t("SAR")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" sx={tableBodyCell}>
                      {t("salary")}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.price}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.descount}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.tax}%
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.total} {t("SAR")}
                    </TableCell>
                  </TableRow>
                  {orderRes?.workerOperatingFees === 0 ? null : (
                    <TableRow>
                      <TableCell align="center" sx={tableBodyCell}>
                        {t("operating fees")}
                      </TableCell>
                      <TableCell align="center" sx={tableBodyCell}>
                        {orderRes?.price}
                      </TableCell>
                      <TableCell align="center" sx={tableBodyCell}>
                        {orderRes?.descount}
                      </TableCell>
                      <TableCell align="center" sx={tableBodyCell}>
                        {orderRes?.tax}%
                      </TableCell>
                      <TableCell align="center" sx={tableBodyCell}>
                        {orderRes?.total} {t("SAR")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* client details */}
          <div>
            <Typography
              variant="h6"
              sx={{ ...fontCairo, color: "var(--primary)", fontSize: "16px", fontWeight: "bold", margin: "28px 0 15px" }}
            >
              {t("client details")}
            </Typography>
            <TableContainer sx={table}>
              <Table>
                <TableHead sx={{ backgroundColor: "#E8EEEE", height: "32px" }}>
                  <TableRow>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("name")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("phone")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("address")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.userName}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.userPhone}
                    </TableCell>
                    <TableCell align="center" sx={tableBodyCell}>
                      {orderRes?.userAddress}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
