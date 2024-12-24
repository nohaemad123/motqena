"use client";

import { SearchDto } from "@/@types/dto/SearchDto";
import { IPagination } from "@/@types/interfaces/IPagination";
import { IUserPermissions } from "@/@types/interfaces/IUserPermissions";
import { getAllUsersPermissions } from "@/services/loadData";
import { MenuItem, Pagination, PaginationItem, Select } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import edit from "@/assets/images/edit.svg";
import Image from "next/image";

const initSearchValues = new SearchDto({
  // readDto: {},
  selectColumns: ["id", "name", "role"],
});

export default function UsersPermissionsViewPage() {
  const { t, i18n } = useTranslation();
  const { setValue, watch, getValues } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
  });
  const [rows, setRows] = useState<IUserPermissions[]>([]);
  const [pagination, setPagination] = useState<IPagination>();

  useEffect(() => {
    UsersPermissions(getValues());
  }, [watch("page"), watch("pageSize")]);

  function UsersPermissions(params: SearchDto) {
    getAllUsersPermissions(i18n.language, params)
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

  const columns: GridColDef<IUserPermissions>[] = [
    { field: "id", headerName: t("user code"), minWidth: 150, headerAlign: "left", headerClassName: "bg-[var(--tableHead)]" },
    {
      field: "name",
      headerName: t("user permission"),
      headerClassName: "bg-[var(--tableHead)]",
      minWidth: 150,
      flex: 1,
      sortable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerClassName: "bg-[var(--tableHead)]",
      minWidth: 130,
      sortable: false,
      filterable: false,
      headerAlign: "right",
      align: "right",
      headerName: t("Actions"),

      renderCell: (params) => (
        <div className="flex h-full justify-end items-center gap-2">
          <Link
            href={"/users-permissions/" + params.row.id + "/edit"}
            className="action_button flex justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200 border text-[#2FD36F] border-gray rounded-md cursor-pointer"
          >
            <Image src={edit} width={20} height={20} alt="edit" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-grow w-full flex flex-col p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[18px] font-normal text-[#195950] my-3">{t("View users' Permissions on the system")}</h1>
      </div>
      <div className="flex-grow">
        <div className="bg-white p-4 mb-6 mt-4 rounded-md w-full">
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
