"use client";

import { IBranch } from "@/@types/interfaces/IBranch";
import { valibotResolver } from "@hookform/resolvers/valibot";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SearchDto } from "@/@types/dto/SearchDto";
import { searchValidationSchema } from "@/@types/validators/searchValidators";
import { IPagination } from "@/@types/interfaces/IPagination";
import { useAppStore } from "@/store";
import {
  Box,
  Button,
  ButtonBase,
  InputAdornment,
  MenuItem,
  Modal,
  Pagination,
  PaginationItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { FiLock } from "react-icons/fi";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import ask_delete from "@/assets/popup images/Inbox cleanup-rafiki.svg";
import { HiChevronDoubleRight, HiPlusCircle } from "react-icons/hi";
import { actionIconStyle, modalStyle } from "@/@types/styles";
import { HiChevronDoubleLeft } from "react-icons/hi2";
// import search from "@/assets/images/search.svg";
import search from "@/assets/images/search-normal.svg";
import loked_off from "@/assets/images/lock-off.svg";
import edit from "@/assets/images/edit.svg";
import trash from "@/assets/images/trash.svg";
import { getAllBranches } from "@/services/loadData";

const initSearchValues = new SearchDto({
  selectColumns: ["id", "name", "cityName", "neighborhood", "isActive"],
});

export default function BranchesViewPage() {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [rows, setRows] = useState<IBranch[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const { register, handleSubmit, getValues, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(searchValidationSchema),
  });
  const [deletedBranch, setDeletedBranch] = useState<IBranch | null>(null);
  const handleClose = () => setDeletedBranch(null);

  useEffect(() => {
    fetchBranches(getValues());
  }, [watch("page"), watch("pageSize")]);

  function handleSubmitForm(values: SearchDto) {
    fetchBranches(values);
  }

  function fetchBranches(params: SearchDto) {
    getAllBranches(i18n.language, params)
      .then((res) => {
        const indexedRows =
          res?.listData?.map((row, index) => ({
            ...row,
            index: index + 1,
          })) ?? [];
        setRows(indexedRows);
        setPagination(res?.paginationData);
        if (res) {
          setValue("page", res.paginationData.currentPage);
          setValue("pageSize", res.paginationData.pageSize);
        }
      })
      .catch(console.log);
  }

  async function handleUpdateStatus(id?: string) {
    if (!id) return;

    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.branch + "/UpdateStatus", {
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
        fetchBranches(getValues());
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      handleClose();
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.branch, {
        method: "DELETE",
        params: {
          id,
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        handleClose();
        fetchBranches(getValues());
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      handleClose();
    }
  }

  const columns: GridColDef<IBranch>[] = [
    {
      field: "index",
      headerName: t("Branch code"),
      minWidth: 150,
      headerClassName: "bg-[var(--tableHead)]",
      headerAlign: "left",
    },
    {
      field: "name",
      headerName: t("Branch name"),
      minWidth: 150,
      flex: 1,
      sortable: true,
      headerClassName: "bg-[var(--tableHead)]",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cityName",
      headerName: t("City"),
      minWidth: 150,
      sortable: true,
      headerClassName: "bg-[var(--tableHead)]",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "neighborhood",
      headerName: t("Neighborhood"),
      sortable: true,
      headerClassName: "bg-[var(--tableHead)]",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      minWidth: 130,
      headerClassName: "bg-[var(--tableHead)]",
      sortable: false,
      headerName: t("Actions"),
      headerAlign: "right",
      align: "right",
      renderCell: (params) => (
        <div className="flex h-full items-center gap-2">
          {params.row.isActive && (
            <ButtonBase
              disabled={isHttpClientLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(params.row.id);
              }}
              type="button"
              className="action_button text-[#F54141]"
            >
              <Image src={loked_off} width={20} height={20} alt="lock on" />
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
              <FiLock className="w-4 h-4 min-w-4 min-h-4" />
            </ButtonBase>
          )}

          <Link href={"/branches/" + params.row.id + "/edit"} className="action_button text-[#2FD36F]">
            <Image src={edit} width={20} height={20} alt="edit" />
          </Link>

          <ButtonBase
            disabled={isHttpClientLoading}
            onClick={(e) => {
              e.stopPropagation();
              setDeletedBranch(params.row);
            }}
            type="button"
            className="action_button"
          >
            <Image src={trash} width={20} height={20} alt="lock off" />
          </ButtonBase>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-grow w-full flex flex-col p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[18px] font-normal text-[#195950] mb-0">{t("View branches in the system")}</h1>
        <Link className="main_button" href={"/branches/add"}>
          <HiPlusCircle className="w-6 h-6" />
          {t("Add branch")}
        </Link>
      </div>
      <div className="flex-grow">
        <div className=" bg-white p-4 mb-6 mt-4 rounded-md w-full">
          <div className="mb-6 w-full">
            <TextField
              onKeyUp={handleSubmit(handleSubmitForm)}
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
            getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "" : "bg-[var(--tableRow)]")}
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
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
              color: "#195950",
              border: "none",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              fontSize: "16px",
              fontWeight: "bold",
            },
            "& .Mui-selected": {
              background: "linear-gradient(180deg, #195950 100%, #56B948 100%)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              fontSize: "12px",
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
        open={!!deletedBranch}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div className="w-full flex justify-center">
            <Typography id="transition-modal-title" className="mb-10" variant="h6" component="h2">
              <ButtonBase className="close_modal" onClick={handleClose}>
                X
              </ButtonBase>
            </Typography>
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
            <h3 className="font-bold text-[20px]">{t("Delete branch?")}</h3>
            <p className="font-normal text-[18px] mt-2">
              {t(
                "When you delete the branch, you will lose all the branch information and it will be transferred to the deleted list",
              )}
            </p>
          </div>

          <div className="w-full mt-5 flex gap-5">
            <Button
              className="cancel_popup_button"
              onClick={() => {
                handleDelete(deletedBranch?.id);
              }}
            >
              {t("Delete")}
            </Button>
            <Button onClick={handleClose} className="back_popup_button">
              {t("Back")}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
