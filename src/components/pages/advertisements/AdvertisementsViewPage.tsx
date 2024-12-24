"use client";

import { ResultHandler } from "@/@types/classes/ResultHandler";
import { SearchDto } from "@/@types/dto/SearchDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IPagination } from "@/@types/interfaces/IPagination";
import { searchValidationSchema } from "@/@types/validators/searchValidators";
import fetchClient from "@/lib/fetchClient";
import { getAllAdvertisements } from "@/services/loadData";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Box, Button, ButtonBase, MenuItem, Modal, Pagination, PaginationItem, Select } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiPlusCircle } from "react-icons/hi";
import { actionIconStyle, modalStyle } from "@/@types/styles";
import ask_delete from "@/assets/popup images/Inbox cleanup-rafiki.svg";
import { IAdvertisement } from "@/@types/interfaces/IAdvertisement";
import loked_off from "@/assets/images/lock-off.svg";
import edit from "@/assets/images/edit.svg";
import trash from "@/assets/images/trash.svg";
import { FiLock } from "react-icons/fi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import calender from "@/assets/images/calendar.svg";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const initSearchValues = new SearchDto({
  readDto: { from: null, to: null },
  selectColumns: ["id", "date", "image", "isActive"],
});

export default function AdvertisementsViewPage() {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [rows, setRows] = useState<IAdvertisement[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const { getValues, setValue, watch, control } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(searchValidationSchema),
  });
  const [deletedAdvertisement, setDeletedAdvertisement] = useState<IAdvertisement | null>(null);
  const handleClose = () => setDeletedAdvertisement(null);

  useEffect(() => {
    fetchAdvertisements(getValues());
  }, [watch("page"), watch("pageSize")]);

  // function handleSubmitForm(values: SearchDto) {
  //   fetchAdvertisements(values);
  // }

  function fetchAdvertisements(params: SearchDto) {
    getAllAdvertisements(i18n.language, params)
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

  async function handleDelete(id?: string) {
    if (!id) return;
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.advertisements, {
        method: "DELETE",
        params: {
          id,
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        fetchAdvertisements(getValues());
        handleClose();
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  async function handleUpdateStatus(id?: string) {
    if (!id) return;

    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.advertisements + "/UpdateStatus", {
        method: "PUT",
        params: {
          id: id,
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        handleClose();
        fetchAdvertisements(getValues());
      } else {
        console.error("Error updating status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  function resetDate() {
    setValue("readDto.from", null);
    setValue("readDto.to", null);
    fetchAdvertisements(getValues());
  }

  const columns: GridColDef<IAdvertisement>[] = [
    { field: "id", headerName: t("advertisement code"), minWidth: 150, headerAlign: "left", headerClassName: "bg-[var(--tableHead)]" },
    {
      field: "image",
      headerName: t("advertisement"),
      headerClassName: "bg-[var(--tableHead)]",
      minWidth: 150,
      flex: 1,
      sortable: true,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <img src={`http://144.126.155.112:8011/${row?.image}`} alt={t("Advertisement Image")} className="w-[147px] h-12 rounded-md" />
      ),
    },
    {
      field: "date",
      headerName: t("deadline"),
      minWidth: 250,
      sortable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
    },
    {
      field: "actions",
      headerClassName: "bg-[var(--tableHead)]",
      minWidth: 130,
      sortable: false,
      headerAlign: "right",
      align: "right",
      headerName: t("Actions"),

      renderCell: (params) => (
        <div className="flex h-full items-center gap-2">
          {params.row.isActive && (
            <ButtonBase
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(params.row.id);
              }}
              type="button"
              className="text-center action_button m-auto border-0 flex bg-transparent text-[#F54141] justify-center items-center w-8 h-8 p-2 leading-4 rounded-md cursor-pointer group"
            >
              <Image src={loked_off} width={20} height={20} alt="lock off" />
            </ButtonBase>
          )}
          {!params.row.isActive && (
            <ButtonBase
              disabled={isHttpClientLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(params.row.id);
              }}
              type="button"
              sx={{ ...actionIconStyle, background: "#F54141", color: "white" }}
            >
              <FiLock width="20" className="w-4 h-4  min-w-4 min-h-4 " />
            </ButtonBase>
          )}

          <Link
            href={"/advertisements/" + params.row.id + "/edit"}
            className="action_button flex justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200 border text-[#2FD36F] border-gray rounded-md cursor-pointer group hover:border-[var(--primary)] hover:bg-[var(--primary)]"
          >
            <Image src={edit} width={20} height={20} alt="edit" />
          </Link>

          <ButtonBase
            disabled={isHttpClientLoading}
            onClick={(e) => {
              e.stopPropagation();
              setDeletedAdvertisement(params.row);
            }}
            type="button"
            className="text-center action_button m-auto border-0 flex bg-transparent text-[#F54141] justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200  rounded-md cursor-pointer group"
          >
            <Image src={trash} width={20} height={20} alt="delete" />
          </ButtonBase>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-grow w-full flex flex-col p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[18px] font-normal text-[#195950] mb-0">{t("view advertisements in the system")}</h1>
        <Link className="main_button" href={"/advertisements/add"}>
          <HiPlusCircle className="w-6 h-6" />
          {t("add advertisement")}
        </Link>
      </div>
      <form className="flex-grow">
        <div className="bg-white p-4 mb-6 mt-4 rounded-md w-full">
          <div className="flex flex-wrap items-end gap-4">
            {/* Date From */}
            <div className="flex-grow">
              {/* <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("deadline")}</label> */}
              <Controller
                control={control}
                name="readDto.from"
                disabled={isHttpClientLoading}
                render={({ field: { value, onChange } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(value)}
                      className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                      onChange={(newValue) => {
                        onChange(newValue?.toDate() ?? null);
                        fetchAdvertisements(getValues());
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
              {/* <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("deadline")}</label> */}
              <Controller
                control={control}
                name="readDto.to"
                disabled={isHttpClientLoading}
                render={({ field: { value, onChange } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(value)}
                      className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg"
                      onChange={(newValue) => {
                        onChange(newValue?.toDate() ?? null);
                        fetchAdvertisements(getValues());
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
                  background: "var(--primary)",
                  color: "white",
                  width: "140px",
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "400",
                }}
                onClick={() => {
                  resetDate();
                }}
              >
                {t("Reset")}
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

      <Modal
        open={!!deletedAdvertisement}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div className="w-full flex justify-center">
            <Image
              src={ask_delete}
              alt="logo"
              width={400}
              height={400}
              className="text-center justify-center m-auto actions_tr"
              style={{ textAlign: "center", margin: "auto" }}
            />
          </div>

          <div className="text-center">
            <h3 className="font-bold text-[20px]">{t("delete advertisement?")}</h3>
            <p className="font-normal text-[18px] mt-2">
              {t("when you delete the ad you will lose all advertising information and turn to the deleted list")}
            </p>
          </div>

          <div className="w-full mt-5 flex gap-5">
            <Button
              disabled={isHttpClientLoading}
              className="cancel_popup_button"
              onClick={() => {
                handleDelete(deletedAdvertisement?.id);
              }}
            >
              {t("Delete")}
            </Button>
            <Button disabled={isHttpClientLoading} onClick={handleClose} className="back_popup_button">
              {t("Back")}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
