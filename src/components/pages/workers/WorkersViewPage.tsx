"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SearchDto } from "@/@types/dto/SearchDto";
import { searchValidationSchema } from "@/@types/validators/searchValidators";
import { IPagination } from "@/@types/interfaces/IPagination";
import { useAppStore } from "@/store";
import {
  Box,
  Button,
  ButtonBase,
  Checkbox,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Pagination,
  PaginationItem,
  Select,
  TextField,
} from "@mui/material";
import { FiLock } from "react-icons/fi";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import ask_delete from "@/assets/popup images/Inbox cleanup-rafiki.svg";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiPlusCircle } from "react-icons/hi";
import { actionIconStyle, modalStyle } from "@/@types/styles";
import { IWorker } from "@/@types/interfaces/IWorker";
import { getAllWorkers } from "@/services/loadData";
import search from "@/assets/images/search-normal.svg";
import locked_off from "@/assets/images/lock-off.svg";
import edit from "@/assets/images/edit.svg";
import trash from "@/assets/images/trash.svg";
import filter_search from "@/assets/images/filter-search.svg";
import importFile from "@/assets/images/import.svg";
import exportFile from "@/assets/images/upload.svg";
import fetchGeneral from "@/lib/fetchGeneral";
import environment from "@/environment";

const initSearchValues = new SearchDto({
  readDto: { id: null, name: null, yearsOfExperience: null, nationalityId: null, serviceProvided: null },
  selectColumns: [
    "id",
    "name",
    "jobName",
    "age",
    "serviceProvided",
    "typeOfService",
    "nationalityName",
    "yearsOfExperience",
    "isActive",
    "workerTypeOfServices",
  ],
});

const filterOptions = [
  {
    value: "1",
    name: "Worker code",
  },
  {
    value: "2",
    name: "Worker name",
  },
  {
    value: "3",
    name: "Number of Years experience",
  },
  {
    value: "4",
    name: "Nationality",
  },
  {
    value: "5",
    name: "Provided service",
  },
];

export default function WorkersViewPage() {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();

  const [rows, setRows] = useState<IWorker[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const { register, getValues, setValue, watch, control } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(searchValidationSchema),
  });
  const [deletedBranch, setDeletedBranch] = useState<IWorker | null>(null);
  const handleClose = () => setDeletedBranch(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | undefined>();

  useEffect(() => {
    fetchBranches(getValues());
    const updatedReadDto = { ...initSearchValues.readDto };
    selectedFilters.forEach((filter) => {
      if (filter === "1") updatedReadDto.id = searchTerm;
      if (filter === "2") updatedReadDto.name = searchTerm;
      if (filter === "3") updatedReadDto.yearsOfExperience = searchTerm;
      if (filter === "4") updatedReadDto.nationalityId = searchTerm;
      if (filter === "5") updatedReadDto.serviceProvided = searchTerm;
    });
    setValue("readDto", updatedReadDto);
  }, [searchTerm, filterOptions, watch("page"), watch("pageSize")]);

  const downloadSample = async () => {
    try {
      const response = await fetch(environment.apiHost + "/api/" + EndPointsEnums.exportEmptyExcel, {
        method: "GET",
        headers: {
          accept: "*/*",
          "Accept-Language": i18n.language,
        },
      });

      // Convert the response to a Blob
      const blob = await response.blob();

      // Extract the file name from the Content-Disposition header
      const contentDisposition = response.headers.get("content-disposition");
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/["']/g, "") || "Workers.xlsx"
        : "Workers.xlsx";

      // Create a URL for the Blob and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a); // Append to the DOM
      a.click();
      a.remove(); // Remove after download
      window.URL.revokeObjectURL(url); // Clean up the URL
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch(environment.apiHost + "/api/" + EndPointsEnums.exportExcelFile, {
        method: "GET",
        headers: {
          accept: "*/*",
          "Accept-Language": i18n.language,
        },
      });

      // Convert the response to a Blob
      const blob = await response.blob();

      // Extract the file name from the Content-Disposition header
      const contentDisposition = response.headers.get("content-disposition");
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/["']/g, "") || "Workers.xlsx"
        : "Workers.xlsx";

      // Create a URL for the Blob and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a); // Append to the DOM
      a.click();
      a.remove(); // Remove after download
      window.URL.revokeObjectURL(url); // Clean up the URL
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  function fetchBranches(params: SearchDto) {
    getAllWorkers(i18n.language, params)
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

  async function handleDelete(id?: string) {
    if (!id) return;
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.worker, {
        method: "DELETE",
        params: {
          id,
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        fetchBranches(getValues());
        handleClose();
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      handleClose();
      console.error("Error deleting user:", error);
    }
  }

  async function handleUpdateStatus(id?: string) {
    if (!id) return;

    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.worker + "/UpdateStatus", {
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
        handleClose();
        console.error("Error deleting user");
      }
    } catch (error) {
      handleClose();
      console.error("Error deleting user:", error);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // setImagePreview(URL.createObjectURL(file));
      importExportFile(file);
    }

    fileRef.current = file;
  };

  async function importExportFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetchGeneral(EndPointsEnums.importExcelFile, {
        method: "POST",
        body: formData,
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      const res = await response.json();
      if (res.status) {
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const columns: GridColDef<IWorker>[] = [
    { field: "index", headerName: t("Worker code"), minWidth: 150, headerClassName: "bg-[var(--tableHead)]", headerAlign: "left" },
    // { field: "name", headerName: t("Branch code"), minWidth: 150, sortable: true },
    {
      field: "name",
      headerName: t("Worker name"),
      minWidth: 150,
      flex: 1,
      sortable: true,
      headerClassName: "bg-[var(--tableHead)]",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "age",
      headerName: t("Age"),
      minWidth: 150,
      flex: 1,
      sortable: true,
      headerClassName: "bg-[var(--tableHead)]",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "yearsOfExperience",
      headerName: t("Years of experience"),
      sortable: true,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
    },
    {
      field: "jobName",
      headerName: t("Job"),
      sortable: true,
      minWidth: 250,
      headerClassName: "bg-[var(--tableHead)]",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "nationalityName",
      headerName: t("Nationality"),
      sortable: true,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
    },
    {
      field: "workerTypeOfServices",
      headerName: t("Provided service"),
      sortable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
      minWidth: 250,
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
              className="text-center action_button m-auto border-0 flex bg-transparent text-[#F54141] justify-center items-center w-8 h-8 p-2 leading-4 rounded-md cursor-pointer group"
            >
              <Image src={locked_off} width={20} height={20} alt="lock off" />
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
            href={"/workers/" + params.row.id + "/edit"}
            className="action_button flex justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200 border text-[#2FD36F] border-gray rounded-md cursor-pointer group hover:border-[var(--primary)] hover:bg-[var(--primary)]"
          >
            <Image src={edit} width={20} height={20} alt="lock off" />
          </Link>

          <ButtonBase
            disabled={isHttpClientLoading}
            onClick={(e) => {
              e.stopPropagation();
              setDeletedBranch(params.row);
            }}
            type="button"
            className="text-center action_button m-auto border-0 flex bg-transparent text-[#F54141] justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200  rounded-md cursor-pointer group"
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
        <h1 className="text-[18px] font-normal text-[#195950] mb-0">{t("View the worker in the system")}</h1>
        <div className="flex gap-x-5">
          <Button className=" export_button" onClick={downloadSample}>
            <Image src={importFile} width={24} height={24} alt="export" />
            {t("Download sample")}
          </Button>
          <div className="relative">
            <Button className="export_button" onClick={handleButtonClick}>
              <Image src={importFile} width={24} height={24} alt="import" />
              {t("Import file")}
            </Button>
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
              // style={{ top: 0, position: "absolute" }}
              style={{ visibility: "hidden", top: 0, position: "absolute" }}
              onChange={handleFileChange}
            />
          </div>
          <Button className=" export_button" onClick={exportData}>
            <Image src={exportFile} width={24} height={24} alt="export" />
            {t("Export file")}
          </Button>
          <Link className="main_button" href={"/workers/add"}>
            <HiPlusCircle className="w-6 h-6" />
            {t("Add worker")}
          </Link>
        </div>
      </div>
      <div className="flex-grow">
        <div className=" bg-white p-4 mb-6 mt-4 rounded-md w-full">
          <div className="mb-6 w-full flex gap-x-5">
            <TextField
              placeholder={t("Search ...")}
              onKeyUp={(e: any) => setSearchTerm(e.target.value ?? "")}
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
              className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
            />
            <Controller
              name="readDto.filter"
              control={control}
              render={({ field: { value = [], onChange } }) => (
                <Select
                  value={value}
                  multiple
                  name="readDto.filter"
                  className="min-w-[50px] custom-field-modules"
                  onChange={(e) => {
                    const selectedValues = e.target.value;
                    setSelectedFilters(selectedValues);
                    onChange(selectedValues);
                  }}
                  input={
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position="start">
                          <Image src={filter_search} width={24} height={24} alt="filter" />
                        </InputAdornment>
                      }
                    />
                  }
                  placeholder={t("Choose Nationality")}
                >
                  {filterOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Checkbox checked={value.includes(opt.value)} />
                      {t(opt.name)}
                    </MenuItem>
                  ))}
                </Select>
              )}
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
          {/* <div className="absolute bottom-5 left-2/4 -translate-x-2/4 w-full px-9"> */}
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
            <h3 className="font-bold text-[20px]">{t("Delete worker?")}</h3>
            <p className="font-normal text-[18px] mt-2">
              {t(
                "When you delete the worker, you will lose all the worker information and it will be transferred to the deleted list",
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
