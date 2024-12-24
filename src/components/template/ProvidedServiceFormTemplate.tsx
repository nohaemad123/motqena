"use client";

import { IProvidedServiceDto, ProvidedServiceDto, ProvidedServiceRow } from "@/@types/dto/ProvidedServiceDto";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ask_cancel from "@/assets/popup images/Transfer files-rafiki.svg";
import Image from "next/image";
import Link from "next/link";
import { modalStyle, SerProvTableHeadCell } from "@/@types/styles";
import { fontCairo } from "@/@types/styles";
import { IServicesSystems } from "@/@types/interfaces/IServicesSystems";
import { IBranch } from "@/@types/interfaces/IBranch";
import { INationality } from "@/@types/interfaces/INationality";
import {
  getAllBranches,
  getAllNationalities,
  getAllServiceTypes,
  getAllSystemOfService,
  getProvidedServiceById,
} from "@/services/loadData";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { IProvidedService, IProvidedServiceDetails } from "@/@types/interfaces/IProvidedService";
import ask_add from "@/assets/images/ask-add.gif";
import star from "@/assets/images/star.svg";
import { IServiceType } from "@/@types/interfaces/IServiceType";
import trash from "@/assets/images/trash.svg";
import { ProvidedServiceValidationSchema } from "@/@types/validators/ProvidedServiceValidatos";
import { useAppStore } from "@/store";
import { getTranslatedName } from "@/@types/stables";

interface IProvidedServiceIdFormTemplateProps {
  providedServiceId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function ProvidedServiceFormTemplate({
  providedServiceId,
  isEdit,
  isView,
}: Readonly<IProvidedServiceIdFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [openAdd, setOpenAdd] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const handleOpenCancel = () => setOpenCancel(true);
  const handleCloseCancel = () => setOpenCancel(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [showSystemServicePriceObj, setShowSystemServicePriceObj] = useState<{ [id: string]: IServicesSystems | undefined }>({});
  const [systemServices, setSystemService] = useState<IServicesSystems[]>([]);
  const [typeOfServices, setTypeOfService] = useState<IServiceType[]>([]);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [nationalities, setNationalities] = useState<INationality[]>([]);

  const {
    watch,
    reset,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<ProvidedServiceDto>({
    defaultValues: new ProvidedServiceDto({ details: [new ProvidedServiceRow()] }),
    resolver: valibotResolver(ProvidedServiceValidationSchema),
  });

  useEffect(() => {
    if (providedServiceId && typeof providedServiceId === "string") {
      getProvidedServiceById(i18n.language, providedServiceId)
        .then((res) => {
          if (res) {
            reset(res);
            getTypeOfService(res.serviceSystem);
          }
        })
        .catch(console.log);
    }

    getAllBranches(i18n.language).then((res) => {
      console.log(res);
      setBranches(res?.listData ?? []);
    });

    getAllSystemOfService(i18n.language).then((res) => {
      const data = res?.listData ?? [];
      setSystemService(data);

      const obj: { [id: string]: IServicesSystems } = {};
      for (const element of data) {
        if (element.id) {
          obj[element.id] = element;
        }
      }

      setShowSystemServicePriceObj(obj);
    });

    getAllNationalities(i18n.language).then((res) => {
      console.log(res);
      setNationalities(res?.listData ?? []);
    });
  }, [providedServiceId]);

  function handleAddRow() {
    const providedService = getValues("details");
    providedService.push(new ProvidedServiceRow());
    setValue("details", providedService);
  }

  function getTypeOfService(systemService: string) {
    getAllServiceTypes(i18n.language, { readDto: { systemOfServiceId: systemService } }).then((res) => {
      setTypeOfService(res?.listData ?? []);
    });
  }

  function handleDeleteRow(rowId: string) {
    const providedService = getValues("details").filter((x) => x.rowId !== rowId);
    setValue("details", providedService);
  }

  async function handleCreate(branchData: any) {
    try {
      const response = await fetchClient<ResultHandler<IProvidedService>>(EndPointsEnums.providedService, {
        method: "POST",
        body: branchData,
      });

      if (response.status) {
        handleOpenAdd();
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate() {
    handleOpenAdd();
  }

  async function handleSubmitForm() {
    const serviceData: IProvidedServiceDto = getValues();

    const provided_service_data = {
      systemOfServiceId: serviceData.systemOfServiceId,
      typeOfServiceId: serviceData.typeOfServiceId,
      isActive: serviceData.isActive ? serviceData.isActive : true,
      details: serviceData.details?.map((detailItem: IProvidedServiceDetails) => {
        return {
          branchId: detailItem.branchId,
          descount: detailItem.descount,
          externalFees: detailItem.externalFees,
          hourPrice: detailItem.hourPrice,
          dayPrice: detailItem.dayPrice,
          monthPrice: detailItem.monthPrice,
          governmentFees: detailItem.governmentFees,
          internalFees: detailItem.internalFees,
          tax: detailItem.tax,
          workerCount: detailItem.workerCount,
          nationalityId: detailItem.nationalityId,
        };
      }),
    };

    if (isView) return;

    if (isEdit) {
      await handleUpdate();
    } else {
      await handleCreate(provided_service_data);
    }
  }

  return (
    <div className="flex-grow w-full flex flex-col p-5">
      <div className="w-full">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ ...fontCairo, marginBottom: "28px" }}>
          <Link color="inherit" href={"/provided-services"} className="text-base font-bold no-underline text-[var(--primary)]">
            {t("Provided services")}
          </Link>
          {!isEdit && !isView && (
            <Typography className="text-[15px]" sx={{ color: "text.primary", ...fontCairo }}>
              {t("Add new service")}
            </Typography>
          )}
          {isEdit && (
            <Typography className="text-[15px]" sx={{ color: "text.primary", ...fontCairo }}>
              {t("Edit service")}
            </Typography>
          )}
        </Breadcrumbs>

        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="bg-[#fff] p-5 radius-[8px] mt-5">
            <h3 className="text-[#0B0311] form_title text-[16px] font-bold pb-2 border-b border-[#E4DDE9]">
              {!isEdit && !isView && <span className="text-[15px]">{t("Add new service")}</span>}
              {isEdit && <span className="text-[15px]">{t("Edit service")}</span>}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-10 mt-3 mb-10">
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                  {t("Choose service system")} <span className="text-[#f00] mx-2">*</span>
                </label>
                {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}

                <Controller
                  control={control}
                  name="systemOfServiceId"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                      value={value}
                      displayEmpty
                      disabled={isView || isHttpClientLoading}
                      onChange={(e) => {
                        onChange(e.target.value);
                        getTypeOfService(e.target.value);
                        setValue("typeOfServiceId", "");
                      }}
                      sx={{ ...fontCairo, height: "48px" }}
                      input={
                        <OutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <Image src={star} width={24} height={24} alt="filter" />
                            </InputAdornment>
                          }
                        />
                      }
                    >
                      <MenuItem value={""} disabled>
                        {t("Choose service system")}
                      </MenuItem>
                      {systemServices.map((ss) => (
                        <MenuItem key={ss.id} value={ss.id}>
                          {getTranslatedName(ss.names, i18n.language) || ss.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                {errors.systemOfServiceId?.message && <small className="text-[#f00]">{t(errors.systemOfServiceId.message)}</small>}
              </div>
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                  {t("Choose service type")} <span className="text-[#f00] mx-2">*</span>
                </label>
                <Controller
                  control={control}
                  name="typeOfServiceId"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                      value={value}
                      disabled={isView || isHttpClientLoading}
                      displayEmpty
                      onChange={(e) => {
                        onChange(e.target.value);
                      }}
                      sx={{ ...fontCairo, height: "48px" }}
                      input={
                        <OutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <Image src={star} width={24} height={24} alt="filter" />
                            </InputAdornment>
                          }
                        />
                      }
                    >
                      <MenuItem value={""} disabled>
                        {t("Choose service type")}
                      </MenuItem>
                      {typeOfServices.map((ss) => (
                        <MenuItem key={ss.id} value={ss.id}>
                          {getTranslatedName(ss.names, i18n.language) || ss.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                {errors.typeOfServiceId?.message && <small className="text-[#f00]">{t(errors.typeOfServiceId.message)}</small>}
              </div>
            </div>

            <Table sx={{ minWidth: 650 }} aria-label="product prices table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...SerProvTableHeadCell }} className="bg-[var(--tableHead)]">
                    #
                  </TableCell>
                  <TableCell sx={{ ...SerProvTableHeadCell, minWidth: 150 }} align="left" className="bg-[var(--tableHead)]">
                    {t("Branch")} <span className="text-[#f00] mx-2">*</span>
                  </TableCell>
                  <TableCell align="left" className="bg-[var(--tableHead)]" sx={{ ...SerProvTableHeadCell, minWidth: 150 }}>
                    {t("Nationality")} <span className="text-[#f00] mx-2">*</span>
                  </TableCell>
                  {/* <TableCell className="bg-[var(--tableHead)]" align="left">
                      {t("Workers count")}
                    </TableCell> */}
                  {showSystemServicePriceObj[watch("systemOfServiceId")]?.showPrice && (
                    <>
                      <TableCell className="bg-[var(--tableHead)]" align="left" sx={{ ...SerProvTableHeadCell, minWidth: 100 }}>
                        {t("hourlyPrice")}
                        {/* <span className="text-[#f00] mx-2">*</span> */}
                      </TableCell>
                      <TableCell className="bg-[var(--tableHead)]" align="left" sx={{ ...SerProvTableHeadCell, minWidth: 100 }}>
                        {t("dailyPrice")}
                        {/* <span className="text-[#f00] mx-2">*</span> */}
                      </TableCell>
                      <TableCell className="bg-[var(--tableHead)]" align="left" sx={{ ...SerProvTableHeadCell, minWidth: 100 }}>
                        {t("monthlyPrice")}
                        {/* <span className="text-[#f00] mx-2">*</span> */}
                      </TableCell>
                    </>
                  )}
                  {showSystemServicePriceObj[watch("systemOfServiceId")]?.showDiscount && (
                    <TableCell className="bg-[var(--tableHead)]" align="left" sx={{ ...SerProvTableHeadCell, minWidth: 100 }}>
                      {t("discount")} <span className="text-[#f00] mx-2">*</span>
                    </TableCell>
                  )}
                  {showSystemServicePriceObj[watch("systemOfServiceId")]?.showExternalFees && (
                    <TableCell className="bg-[var(--tableHead)]" align="left" sx={{ ...SerProvTableHeadCell }}>
                      {t("Extended fees")} <span className="text-[#f00] mx-2">*</span>
                    </TableCell>
                  )}
                  {showSystemServicePriceObj[watch("systemOfServiceId")]?.showInternalFees && (
                    <TableCell className="bg-[var(--tableHead)]" align="left" sx={{ ...SerProvTableHeadCell }}>
                      {t("Internal fees")} <span className="text-[#f00] mx-2">*</span>
                    </TableCell>
                  )}
                  {showSystemServicePriceObj[watch("systemOfServiceId")]?.showGovernmentFees && (
                    <TableCell className="bg-[var(--tableHead)]" align="left" sx={{ ...SerProvTableHeadCell }}>
                      {t("Governmant fees")} <span className="text-[#f00] mx-2">*</span>
                    </TableCell>
                  )}
                  <TableCell align="left" className="bg-[var(--tableHead)]" sx={{ ...SerProvTableHeadCell, minWidth: 100 }}>
                    {t("Tax")}
                  </TableCell>
                  <TableCell align="left" className="bg-[var(--tableHead)]" sx={{ ...SerProvTableHeadCell, minWidth: 150 }}>
                    {t("Final value")}
                  </TableCell>
                  <TableCell align="left" className="bg-[var(--tableHead)]" sx={{ ...SerProvTableHeadCell }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {watch("details")?.map((row, index, details) => (
                  <TableRow key={row.rowId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">
                      <Select
                        size="small"
                        displayEmpty
                        value={row.branchId}
                        disabled={isView || isHttpClientLoading}
                        onChange={(e) =>
                          setValue(
                            "details",
                            details.map((x) => (x.rowId === row.rowId ? { ...x, branchId: e.target.value } : x)),
                          )
                        }
                        placeholder={t("Country")}
                        fullWidth
                      >
                        <MenuItem value={""} disabled>
                          {t("Choose branch")}
                        </MenuItem>
                        {branches.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {getTranslatedName(item.names, i18n.language) || item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 200 }}>
                      <Select
                        size="small"
                        displayEmpty
                        value={row.nationalityId}
                        disabled={isView || isHttpClientLoading}
                        onChange={(e) =>
                          setValue(
                            "details",
                            details.map((x) => (x.rowId === row.rowId ? { ...x, nationalityId: e.target.value } : x)),
                          )
                        }
                        placeholder={t("Country")}
                        fullWidth
                      >
                        <MenuItem value={""} disabled>
                          {t("Choose nationality")}
                        </MenuItem>
                        {nationalities.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {getTranslatedName(item.names, i18n.language) || item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    {/* <TableCell align="left">
                      <TextField
                        size="small"
                        type="number"
                        name="details.workerCount"
                        value={row.workerCount}
                        onChange={(e) =>
                          setValue(
                            "details",
                            details.map((x) => (x.rowId === row.rowId ? { ...x, workerCount: +e.target.value } : x)),
                          )
                        }
                      />
                    </TableCell> */}
                    {showSystemServicePriceObj[watch("systemOfServiceId")]?.showPrice && (
                      <>
                        <TableCell align="left">
                          <TextField
                            size="small"
                            type="number"
                            disabled={isView || isHttpClientLoading}
                            value={row.hourPrice}
                            placeholder={t("hourlyPrice")}
                            onChange={(e) =>
                              setValue(
                                "details",
                                details.map((x) =>
                                  x.rowId === row.rowId ? { ...x, hourPrice: +e.target.value, dayPrice: 0, monthPrice: 0 } : x,
                                ),
                              )
                            }
                          />
                        </TableCell>
                        <TableCell align="left">
                          <TextField
                            size="small"
                            type="number"
                            disabled={isView || isHttpClientLoading}
                            value={row.dayPrice}
                            placeholder={t("dailyPrice")}
                            onChange={(e) =>
                              setValue(
                                "details",
                                details.map((x) =>
                                  x.rowId === row.rowId ? { ...x, dayPrice: +e.target.value, hourPrice: 0, monthPrice: 0 } : x,
                                ),
                              )
                            }
                          />
                        </TableCell>
                        <TableCell align="left">
                          <TextField
                            size="small"
                            type="number"
                            disabled={isView || isHttpClientLoading}
                            value={row.monthPrice}
                            placeholder={t("hourlyPrice")}
                            onChange={(e) =>
                              setValue(
                                "details",
                                details.map((x) =>
                                  x.rowId === row.rowId ? { ...x, monthPrice: +e.target.value, hourPrice: 0, dayPrice: 0 } : x,
                                ),
                              )
                            }
                          />
                        </TableCell>
                      </>
                    )}
                    {showSystemServicePriceObj[watch("systemOfServiceId")]?.showDiscount && (
                      <TableCell align="left">
                        <TextField
                          size="small"
                          type="number"
                          value={row.descount}
                          disabled={isView || isHttpClientLoading}
                          onChange={(e) =>
                            setValue(
                              "details",
                              details.map((x) => (x.rowId === row.rowId ? { ...x, descount: +e.target.value } : x)),
                            )
                          }
                        />
                      </TableCell>
                    )}
                    {showSystemServicePriceObj[watch("systemOfServiceId")]?.showExternalFees && (
                      <TableCell align="left">
                        <TextField
                          size="small"
                          type="number"
                          value={row.externalFees}
                          disabled={isView || isHttpClientLoading}
                          onChange={(e) =>
                            setValue(
                              "details",
                              details.map((x) => (x.rowId === row.rowId ? { ...x, externalFees: +e.target.value } : x)),
                            )
                          }
                        />
                      </TableCell>
                    )}
                    {showSystemServicePriceObj[watch("systemOfServiceId")]?.showInternalFees && (
                      <TableCell align="left">
                        <TextField
                          size="small"
                          type="number"
                          value={row.internalFees}
                          disabled={isView || isHttpClientLoading}
                          onChange={(e) =>
                            setValue(
                              "details",
                              details.map((x) => (x.rowId === row.rowId ? { ...x, internalFees: +e.target.value } : x)),
                            )
                          }
                        />
                      </TableCell>
                    )}
                    {showSystemServicePriceObj[watch("systemOfServiceId")]?.showGovernmentFees && (
                      <TableCell align="left">
                        <TextField
                          size="small"
                          type="number"
                          value={row.governmentFees}
                          disabled={isView || isHttpClientLoading}
                          onChange={(e) =>
                            setValue(
                              "details",
                              details.map((x) => (x.rowId === row.rowId ? { ...x, governmentFees: +e.target.value } : x)),
                            )
                          }
                        />
                      </TableCell>
                    )}
                    <TableCell align="left">
                      <TextField
                        size="small"
                        type="number"
                        value={row.tax}
                        disabled={isView || isHttpClientLoading}
                        onChange={(e) =>
                          setValue(
                            "details",
                            details.map((x) => (x.rowId === row.rowId ? { ...x, tax: +e.target.value } : x)),
                          )
                        }
                      />
                    </TableCell>
                    <TableCell align="left">
                      <TextField
                        size="small"
                        disabled={isView || isHttpClientLoading}
                        type="number"
                        name="details.total"
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                        value={
                          watch("systemOfServiceId") === "1"
                            ? (row.hourPrice > 0 ? row.hourPrice : row.dayPrice > 0 ? row.dayPrice : row.monthPrice) +
                              row.tax -
                              row.descount
                            : row.externalFees + row.internalFees + row.governmentFees + row.tax
                        }
                      />
                    </TableCell>
                    <TableCell align="left">
                      {index !== 0 && (
                        <ButtonBase
                          onClick={() => handleDeleteRow(row.rowId)}
                          type="button"
                          className="text-center action_button m-auto border-0 flex bg-transparent text-[#F54141] justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200  rounded-md cursor-pointer group"
                        >
                          <Image src={trash} width={20} height={20} alt="lock off" />
                        </ButtonBase>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div>
              <Button variant="contained" className="px-4 capitalize flex gap-2" onClick={handleAddRow}>
                {t("Add")}
              </Button>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <div className="flex mb-2 gap-x-5 btns-wrapper">
              <button type="submit" className="add_button">
                {!isEdit && !isView && <span>{t("Add")}</span>}
                {(isEdit || isView) && <span>{t("Update info")}</span>}
              </button>

              <button type="button" onClick={handleOpenCancel} className="cancel_btn">
                {t("Cancel")}
              </button>
            </div>
          </div>
        </form>

        <Modal open={openAdd} onClose={handleCloseAdd} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" className="mb-10" variant="h6" component="h2">
              <ButtonBase className="close_modal" onClick={handleCloseAdd}>
                X
              </ButtonBase>
            </Typography>
            <Image
              src={ask_add}
              alt="logo"
              width={400}
              height={400}
              className="text-center justify-center m-auto actions_tr"
              style={{ textAlign: "center", margin: "0 auto", display: "block" }}
            />

            <div className="text-center">
              <h3 className="font-bold text-[20px]">{t("Congratulations")}</h3>
              <p className="font-normal text-[18px] mt-2">
                {!isEdit && !isView && <span>{t("The operation was completed successfully")}</span>}
                {(isEdit || isView) && <span>{t("The operation was updated successfully")}</span>}
              </p>{" "}
            </div>

            <div className="flex w-full mt-5">
              <Link className="add_popup_button" href={"/provided-services"}>
                {t("View provided services")}
              </Link>
            </div>
          </Box>
        </Modal>

        <Modal
          open={openCancel}
          onClose={handleCloseCancel}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" className="mb-10" variant="h6" component="h2">
              <ButtonBase className="close_modal" onClick={handleCloseCancel}>
                X
              </ButtonBase>
            </Typography>
            <Image
              src={ask_cancel}
              alt="logo"
              width={400}
              height={400}
              className="text-center justify-center m-auto actions_tr"
              style={{ textAlign: "center", margin: "auto" }}
            />

            <div className="text-center">
              <h3 className="font-bold text-[20px]">{t("Are you sure to cancel?")}</h3>
              <p className="font-normal text-[18px] mt-2">{t("When you click Cancel you will lose all information")}</p>
            </div>

            <div className="w-full mt-5 flex gap-5">
              <Link href={"/provided-services"} className="cancel_popup_button">
                {t("Cancel")}
              </Link>
              <Button onClick={handleCloseCancel} className="back_popup_button">
                {t("Back")}
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
