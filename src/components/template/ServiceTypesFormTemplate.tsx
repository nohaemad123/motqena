"use client";

import { ServiceTypeDto } from "@/@types/dto/ServiceTypeDto";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ask_cancel from "@/assets/popup images/Transfer files-rafiki.svg";
import Image from "next/image";
import Link from "next/link";
import { modalStyle } from "@/@types/styles";
import { serviceTypeValidationSchema } from "@/@types/validators/serviceTypeValidators";
import { fontCairo } from "@/@types/styles";
import { IServicesSystems } from "@/@types/interfaces/IServicesSystems";
import { IShift } from "@/@types/interfaces/IShift";
import { getAllShifts, getAllSystemOfService, getServiceTypeById } from "@/services/loadData";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import fetchClient from "@/lib/fetchClient";
import ask_add from "@/assets/images/ask-add.gif";
import filter from "@/assets/images/edit-2.svg";
import star from "@/assets/images/star.svg";
import clock from "@/assets/images/clock.svg";
import { useAppStore } from "@/store";
import { getTranslatedName } from "@/@types/stables";

interface IServiceTypeIdFormTemplateProps {
  serviceTypeId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function ServiceTypeFormTemplate({ serviceTypeId, isEdit, isView }: Readonly<IServiceTypeIdFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [openAdd, setOpenAdd] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const handleOpenCancel = () => setOpenCancel(true);
  const handleCloseCancel = () => setOpenCancel(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [systemServices, setSystemService] = useState<IServicesSystems[]>([]);
  const [shifts, setShift] = useState<IShift[]>([]);
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceTypeDto>({
    defaultValues: new ServiceTypeDto(),
    resolver: valibotResolver(serviceTypeValidationSchema),
  });

  useEffect(() => {
    if (serviceTypeId && typeof serviceTypeId === "string") {
      getServiceTypeById(i18n.language, serviceTypeId)
        .then((res) => {
          if (res) {
            const data = new ServiceTypeDto({
              ...res,
              nameAr: res.names.find((name) => name.language === "ar")?.value ?? "",
              nameEn: res.names.find((name) => name.language === "en")?.value ?? "",
            });

            reset(data);
          }
        })
        .catch(console.log);
    }

    getAllSystemOfService(i18n.language).then((res) => {
      console.log(res);
      setSystemService(res?.listData ?? []);
    });

    getAllShifts(i18n.language).then((res) => {
      console.log(res);
      setShift(res?.listData ?? []);
    });
  }, [serviceTypeId]);

  async function handleCreate(serviceTypeData: ServiceTypeDto) {
    try {
      const response = await fetchClient<ResultHandler<IServicesSystems>>(EndPointsEnums.serviceType, {
        method: "POST",
        body: serviceTypeData,
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        handleOpenAdd();
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(serviceTypeData: ServiceTypeDto) {
    try {
      const response = await fetchClient<ResultHandler<IServicesSystems>>(EndPointsEnums.serviceType, {
        method: "PUT",
        body: serviceTypeData,
        params: {
          id: serviceTypeId,
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        handleOpenAdd();
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleSubmitForm(serviceTypeData: ServiceTypeDto) {
    if (isView) return;

    serviceTypeData.names ??= [];

    if (serviceTypeData.nameEn) {
      serviceTypeData.names.push({
        id: null,
        language: "en",
        value: serviceTypeData.nameEn,
        localizationSetsId: null,
      });
    }

    if (serviceTypeData.nameAr) {
      serviceTypeData.names.push({
        id: null,
        language: "ar",
        value: serviceTypeData.nameAr,
        localizationSetsId: null,
      });
    }

    if (isEdit) {
      await handleUpdate(serviceTypeData);
    } else {
      await handleCreate(serviceTypeData);
    }
  }

  return (
    <div className="flex-grow w-full flex mt-[18px] flex-col p-5">
      <div className="w-full">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ ...fontCairo, marginBottom: "28px" }}>
          <Link color="inherit" href={"/services-types"} className="text-base font-bold no-underline text-[var(--primary)]">
            {t("Services types")}
          </Link>
          {!isEdit && !isView && (
            <Typography className="text-[15px]" sx={{ color: "text.primary", ...fontCairo }}>
              {t("Add new service type")}
            </Typography>
          )}
          {isEdit && (
            <Typography className="text-[15px]" sx={{ color: "text.primary", ...fontCairo }}>
              {t("Edit service type")}
            </Typography>
          )}
        </Breadcrumbs>

        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="bg-[#fff] p-5 radius-[8px] mt-5">
            <h3 className="text-[#0B0311] form_title text-[16px] font-bold pb-2 border-b border-[#E4DDE9]">
              {!isEdit && !isView && <span className="text-[15px]">{t("Add new service type")}</span>}
              {isEdit && <span className="text-[15px]">{t("Edit service type")}</span>}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-20 mt-3">
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                  {t("Arabic service name")} <span className="text-[#f00] mx-2">*</span>
                </label>
                <TextField
                  disabled={isView || isHttpClientLoading}
                  placeholder={t("Arabic service name")}
                  {...register("nameAr")}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image src={filter} width={24} height={24} alt="filter" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                />
                {errors.nameAr?.message && <small className="text-[#f00]">{t(errors.nameAr.message)}</small>}
              </div>
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("English service name")}</label>
                <TextField
                  disabled={isView || isHttpClientLoading}
                  placeholder={t("English service name")}
                  {...register("nameEn")}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image src={filter} width={24} height={24} alt="filter" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                />
                {errors.nameEn?.message && <small className="text-[#f00]">{t(errors.nameEn.message)}</small>}
              </div>
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                  {t("Choose service system")} <span className="text-[#f00] mx-2">*</span>
                </label>
                <Controller
                  control={control}
                  name="systemOfServiceId"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      displayEmpty
                      disabled={isView || isHttpClientLoading}
                      className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                      value={value}
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
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("Choose shift")}</label>
                <Controller
                  control={control}
                  name="shiftId"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      disabled={isView || isHttpClientLoading}
                      className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                      value={value}
                      displayEmpty
                      onChange={(e) => {
                        onChange(e.target.value);
                      }}
                      sx={{ ...fontCairo, height: "48px" }}
                      input={
                        <OutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <Image src={clock} width={24} height={24} alt="filter" />
                            </InputAdornment>
                          }
                        />
                      }
                    >
                      <MenuItem value={""} disabled>
                        {t("Choose shift")}
                      </MenuItem>
                      {shifts.map((shift) => (
                        <MenuItem key={shift.id} value={shift.id}>
                          {shift.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                {errors.shiftId?.message && <small className="text-[#f00]">{t(errors.shiftId.message)}</small>}
              </div>

              <div className="mb-5">
                <div>
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap" id="demo-radio-buttons-group-label">
                    {t("Thie service requires a woman in the house")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="womenIsRequired"
                    render={({ field: { value, onChange } }) => (
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={true}
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value === "true");
                          console.log(typeof e.target.value);
                        }}
                        name="womenIsRequired"
                        sx={{ display: "flex", flexDirection: "row", mt: "16px", gap: "25px" }}
                      >
                        <FormControlLabel disabled={isView || isHttpClientLoading} value={true} control={<Radio />} label={t("Yes")} />
                        <FormControlLabel disabled={isView || isHttpClientLoading} value={false} control={<Radio />} label={t("No")} />
                      </RadioGroup>
                    )}
                  />
                </div>
                {errors.womenIsRequired?.message && <small className="text-[#f00]">{t(errors.womenIsRequired.message)}</small>}
              </div>
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
              </p>
            </div>

            <div className="flex w-full mt-5">
              <Link className="add_popup_button" href={"/services-types"}>
                {t("View services types")}
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
              <Link href={"/services-types"} className="cancel_popup_button">
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
