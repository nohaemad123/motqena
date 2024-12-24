"use client";

import { SearchDto } from "@/@types/dto/SearchDto";
import { IPagination } from "@/@types/interfaces/IPagination";
import { useAppStore } from "@/store";
import { Button, MenuItem, Pagination, PaginationItem, Select } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import calender from "@/assets/images/calendar.svg";
import { getAllOrders } from "@/services/loadData";
import { IOrder } from "@/@types/interfaces/IOrder";
import { printBtn } from "@/@types/styles";
import fetchClient from "@/lib/fetchClient";
import { EndPointsEnums } from "@/@types/enums/endPoints";

const initSearchValues = new SearchDto({
  readDto: { from: null, to: null },
  selectColumns: [
    "id",
    "code",
    "userName",
    "createdOn",
    "lastUpdatedOn",
    "orderStatusId",
    "paymentStatus",
    "total",
    "orderStatus",
    "userName",
    "paymentStatus",
  ],
});

export default function OrdersReportsPage() {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [rows, setRows] = useState<IOrder[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const { getValues, control, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
  });

  function fetchOrdersReports(params: SearchDto) {
    getAllOrders(i18n.language, params)
      .then((res) => {
        setRows(res?.listData ?? []);
        setPagination(res?.paginationData);
        if (res) {
          setValue("page", res.paginationData.currentPage);
          setValue("pageSize", res.paginationData.pageSize);
        }
      })
      .catch(console.log);
  }

  function openPdfInNewTab(base64Data: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Open Blob in new tab
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  }

  async function print(id: string) {
    try {
      const response = await fetchClient<any>(EndPointsEnums.orderReport + "/" + id, {
        method: "GET",
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      openPdfInNewTab(response?.stringBase64);

      if (response.status) {
        console.log("report order printed successfully");
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrdersReports(getValues());
  }, []);

  const columns: GridColDef<IOrder>[] = [
    { field: "id", headerName: t("order code"), minWidth: 130, headerAlign: "left", headerClassName: "bg-[var(--tableHead)]" },
    {
      field: "userName",
      headerName: t("user name"),
      flex: 1,
      sortable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
    },
    {
      field: "createdOn",
      headerName: t("order date"),
      minWidth: 150,
      sortable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
    },
    {
      field: "lastUpdatedOn",
      headerName: t("edit date"),
      minWidth: 150,
      sortable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
    },
    {
      field: "orderStatus",
      headerName: t("order status"),
      minWidth: 150,
      sortable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
    },
    {
      field: "paymentStatus",
      headerName: t("payment status"),
      minWidth: 150,
      sortable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
    },
    {
      field: "total",
      headerName: t("total"),
      minWidth: 150,
      sortable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
    },
    {
      field: "actions",
      headerName: t("Actions"),
      minWidth: 100,
      sortable: false,
      headerAlign: "right",
      headerClassName: "bg-[var(--tableHead)]",
      align: "right",

      renderCell: (params) => (
        <div className="flex h-full items-center justify-end">
          <Button onClick={() => print(params.row.id)} sx={printBtn}>
            <span>{t("print")}</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-grow w-full flex flex-col p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[18px] font-normal text-[#195950] my-3">{t("view orders reports on the system")}</h1>
      </div>

      <div className="flex-grow">
        <div className="bg-white p-4 mb-6 mt-4 rounded-md w-full">
          <div className="flex flex-wrap items-end gap-4">
            {/* Date From */}
            <div className="flex-grow">
              <Controller
                control={control}
                name="readDto.from"
                render={({ field: { value, onChange } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(value)}
                      className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                      onChange={(newValue) => {
                        onChange(newValue?.toDate() ?? null);
                      }}
                      slots={{
                        openPickerIcon: () => <Image src={calender} alt="" className="w-[24px] h-[24px]" />,
                      }}
                      sx={{
                        ".muirtl-1t5wmfw-MuiInputAdornment-root": {
                          position: "absolute",
                        },
                        ".MuiInputBase-input": {
                          color: "#808080CC",
                          paddingInlineStart: "50px",
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>

            {/* Date to */}
            <div className="flex-grow">
              <Controller
                control={control}
                name="readDto.to"
                render={({ field: { value, onChange } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(value)}
                      className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg"
                      onChange={(newValue) => {
                        onChange(newValue?.toDate() ?? null);
                      }}
                      slots={{
                        openPickerIcon: () => <Image src={calender} alt="" className="w-[24px] h-[24px]" />,
                      }}
                      sx={{
                        ".muirtl-1t5wmfw-MuiInputAdornment-root": {
                          position: "absolute",
                        },
                        ".MuiInputBase-input": {
                          color: "#808080CC",
                          paddingInlineStart: "50px",
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>

            <div>
              <Button
                disabled={isHttpClientLoading}
                sx={{
                  background: "linear-gradient(45deg, #195950, #56B948)",
                  color: "white",
                  minWidth: "200px",
                  height: "48px",
                  fontSize: "18px",
                  fontWeight: "700",
                  borderRadius: "8px",
                }}
                onClick={() => {
                  fetchOrdersReports(getValues());
                }}
              >
                {t("show order report")}
              </Button>
            </div>
          </div>

          <div className="bg-[#E8EEEE80] h-[2px] mt-5 w-full mb-5"></div>

          <DataGrid
            sx={{ height: "auto" }}
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
            getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "" : "bg-[var(--tableRow)]")}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 justify-items-center items-center gap-3 text-[14px] font-bold text-[#195950] px-1">
        <div className="justify-self-start">
          {t("show")}
          <Select
            size="small"
            value={watch("pageSize")}
            onChange={(val) => {
              setValue("page", 1);
              setValue("pageSize", +val.target.value);
            }}
            sx={{ background: "#E8EEEE", margin: "0 10px", borderRadius: "16px" }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
          {t("in page")}
        </div>
        <Pagination
          page={watch("page")}
          onChange={(_, page) => {
            setValue("page", page);
          }}
          count={pagination?.totalPages}
          size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              background: "#fff",
              color: "#195950",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              fontSize: "16px",
              fontWeight: "400",
              margin: "0 4px",
            },
            "& .Mui-selected": {
              background: "linear-gradient(180deg, #195950 100%, #56B948 100%)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              fontSize: "16px",
              fontWeight: "bold",
            },
          }}
          renderItem={(item) => <PaginationItem slots={{ previous: HiChevronDoubleLeft, next: HiChevronDoubleRight }} {...item} />}
        />
        <div className="justify-self-end">
          {t("total")} {pagination?.totalPages} {t("page")}
        </div>
      </div>
    </div>
  );
}
