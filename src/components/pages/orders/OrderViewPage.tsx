"use client";

import { SearchDto } from "@/@types/dto/SearchDto";
import { IListOrderStatus, IOrder } from "@/@types/interfaces/IOrder";
import { IPagination } from "@/@types/interfaces/IPagination";
import { fontCairo } from "@/@types/styles";
import { searchValidationSchema } from "@/@types/validators/searchValidators";
import { getAllOrders, getListOrderStatus } from "@/services/loadData";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  Badge,
  Box,
  Checkbox,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Pagination,
  PaginationItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridExpandMoreIcon } from "@mui/x-data-grid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import filter from "@/assets/images/filter.svg";
import fetchClient from "@/lib/fetchClient";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import search from "@/assets/images/search-normal.svg";

const initSearchValues = new SearchDto({
  readDto: { orderStatusId: null, paymentStatus: null, userName: null, orderStatus: null },
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

const filterOptions = [
  {
    value: "1",
    name: "clinet name",
  },
  {
    value: "2",
    name: "order status",
  },
  {
    value: "3",
    name: "payment status",
  },
];

export default function OrderViewPage() {
  const { t, i18n } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [rows, setRows] = useState<IOrder[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const [listOrderStatus, setListOrderStatus] = useState<IListOrderStatus[]>([]);
  const { register, getValues, control, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(searchValidationSchema),
  });

  function fetchOrders(params: SearchDto) {
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

  function fetchListOrderStatus() {
    getListOrderStatus(i18n.language)
      .then((res) => {
        setListOrderStatus(res ?? []);
      })
      .catch(console.log);
  }

  async function updateOrderStatus(id: string, status: number) {
    try {
      const response = await fetchClient<ResultHandler<any>>(EndPointsEnums.orders + "/UpdateOrderStatus", {
        method: "PUT",
        params: {
          Id: id,
          orderStatus: status,
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        console.log("Order status updated successfully");
        fetchOrders(getValues());
        fetchListOrderStatus();
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleTabChange = (selectedTab: number): void => {
    setSelectedTab(selectedTab ?? 0);
    if (selectedTab === 0) {
      initSearchValues.readDto.orderStatusId = null;
    } else {
      initSearchValues.readDto.orderStatusId = selectedTab - 1;
    }
    fetchOrders({ ...initSearchValues });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    fetchOrders(getValues());
    fetchListOrderStatus();
    const updatedReadDto = { ...initSearchValues.readDto };
    selectedFilters.forEach((filter) => {
      if (filter === "1") updatedReadDto.userName = searchTerm;
      if (filter === "2") updatedReadDto.orderStatus = searchTerm;
      if (filter === "3") updatedReadDto.paymentStatus = searchTerm;
    });

    setValue("readDto", updatedReadDto);
  }, [searchTerm, watch("page"), watch("pageSize")]);

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
      field: "orderStatusId",
      headerName: t("order status"),
      minWidth: 200,
      sortable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "bg-[var(--tableHead)]",
      renderCell: (params) => {
        const handleChange = (event: any) => {
          updateOrderStatus(params.row.id ?? "", event);
          console.log("params:", params);
          console.log("params id:", params.row.id);
          console.log("Selected order status:", event);
          params.api.updateRows([{ ...params.row, orderStatus: event }]);
        };
        return (
          <Select
            value={params.value}
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            variant="outlined"
            IconComponent={(props) => (
              <GridExpandMoreIcon
                {...props}
                sx={{
                  background: "#195950",
                  color: "#fff !important",
                  borderRadius: "4px",
                }}
              />
            )}
            sx={{
              ...fontCairo,
              minWidth: 150,
            }}
          >
            {listOrderStatus.map((option) => (
              <MenuItem key={option.key} value={option.key}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
        );
      },
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
          <Link
            href={"/orders/" + params.row.id + "/edit"}
            className="flex items-center h-[35px] px-2 no-underline bg-[var(--primary)] text-white rounded-md cursor-pointer"
          >
            <span>{t("view")}</span>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-grow w-full flex flex-col p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[18px] font-normal text-[#195950] my-3">{t("view orders on the system")}</h1>
      </div>

      <div className="flex-grow">
        <div className="bg-white p-4 mb-6 mt-4 rounded-md w-full">
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Tabs */}
            <Tabs
              value={selectedTab}
              {...register("readDto.orderStatusId")}
              onChange={(_e, selectedTab) => {
                handleTabChange(selectedTab);
              }}
              sx={{ padding: "0px" }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                sx={{ padding: "0px 5px" }}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{
                        ...fontCairo,
                        fontSize: "16px",
                        fontWeight: selectedTab === 0 ? "bold" : "400",
                        color: selectedTab === 0 ? "var(--primary)" : "#000",
                      }}
                    >
                      {t("All clients")}
                    </Typography>
                    <Badge
                      badgeContent={pagination?.totalCount ?? 0}
                      showZero
                      sx={{
                        mx: 2,
                        "& .MuiBadge-badge": {
                          backgroundColor: selectedTab === 0 ? "var(--primary)" : "#E8EEEE",
                          color: selectedTab === 0 ? "#fff" : "#000",
                        },
                      }}
                    />
                  </Box>
                }
              />
              {listOrderStatus.map((tab, index) => (
                <Tab
                  sx={{ padding: "0px 5px" }}
                  key={index}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        sx={{
                          ...fontCairo,
                          fontSize: "16px",
                          fontWeight: selectedTab === index + 1 ? "bold" : "400",
                          color: selectedTab === index + 1 ? "var(--primary)" : "#000",
                        }}
                      >
                        {t(tab.value)}
                      </Typography>
                      <Badge
                        badgeContent={tab.count}
                        showZero
                        sx={{
                          mx: 2,
                          "& .MuiBadge-badge": {
                            backgroundColor: selectedTab === index + 1 ? "var(--primary)" : "#E8EEEE",
                            color: selectedTab === index + 1 ? "#fff" : "#000",
                          },
                        }}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>

            {/* search */}
            <div className="flex-1">
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
                className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
              />
            </div>

            {/* Filter */}
            <div className="">
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
                    sx={{ color: "text.primary", ...fontCairo, height: "48px" }}
                    input={
                      <OutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            <Image src={filter} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        }
                      />
                    }
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          ...fontCairo,
                          width: "200px",
                          "& .MuiMenuItem-root": {
                            fontSize: "14px",
                            fontWeight: "400",
                            fontFamily: "__Cairo_655793",
                            color: "var(--primary)",
                          },
                        },
                      },
                    }}
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
          </Box>

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
