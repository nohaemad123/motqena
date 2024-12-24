"use client";

import { SearchDto } from "@/@types/dto/SearchDto";
import { IPagination } from "@/@types/interfaces/IPagination";
import { IUserMessage } from "@/@types/interfaces/IUserMessage";
import { searchValidationSchema } from "@/@types/validators/searchValidators";
import { getAllUsersMessages } from "@/services/loadData";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { InputAdornment, MenuItem, Pagination, PaginationItem, Select, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Image from "next/image";
import message from "@/assets/images/message.svg";
import user from "@/assets/images/user.svg";
import search from "@/assets/images/search-normal.svg";

const initSearchValues = new SearchDto({
  //   readDto: {},
  selectColumns: ["id", "userName"],
});

export default function MessagesViewPage() {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();

  const [rows, setRows] = useState<IUserMessage[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const { register, handleSubmit, getValues, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(searchValidationSchema),
  });

  useEffect(() => {
    fetchUsersMessages(getValues());
  }, [watch("page"), watch("pageSize")]);

  function handleSubmitForm(values: SearchDto) {
    fetchUsersMessages(values);
  }

  function fetchUsersMessages(params: SearchDto) {
    getAllUsersMessages(i18n.language, params)
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

  const columns: GridColDef<IUserMessage>[] = [
    { field: "id", headerName: t("user code"), minWidth: 150, headerAlign: "left", headerClassName: "bg-[var(--tableHead)]" },
    {
      field: "userName",
      headerName: t("user name"),
      headerClassName: "bg-[var(--tableHead)]",
      minWidth: 150,
      flex: 1,
      sortable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center justify-start w-10">
            <Image src={user || "/default-avatar.png"} alt="user" width={30} height={30} className="rounded-full" />
          </div>
          <span>{params.row.userName}</span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: t("Actions"),
      headerClassName: "bg-[var(--tableHead)]",
      minWidth: 200,
      sortable: false,
      headerAlign: "right",
      align: "right",

      renderCell: (params) => (
        <div className="flex h-full items-center justify-end">
          <Link
            href={"/messages/" + params.row.id + "/edit"}
            className="flex items-center h-[35px] px-1 no-underline bg-[var(--primary)] text-white rounded-md cursor-pointer"
          >
            <span>{t("view conversation")}</span>
            <Image src={message} alt="" width={18} height={18} style={{ marginInlineStart: "5px" }} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-grow w-full flex flex-col p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[18px] font-normal text-[#195950] my-3">{t("View users' messages on the system")}</h1>
      </div>

      <form onSubmit={handleSubmit(handleSubmitForm)} className="flex-grow">
        <div className="bg-white p-4 mb-6 mt-4 rounded-md w-full">
          <div className="mb-6 w-full">
            <TextField
              disabled={isHttpClientLoading}
              placeholder={t("Search ...")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Image src={search} width={24} height={24} alt="filter" />
                    </InputAdornment>
                  ),
                  style: { height: "48px" },
                },
              }}
              {...register("search")}
              className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
            />
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
      </form>
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
