"use client";

import { fontCairo, modalStyle } from "@/@types/styles";
import { Box, Breadcrumbs, Button, ButtonBase, InputAdornment, Modal, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ask_add from "@/assets/images/ask-add.gif";
import ask_cancel from "@/assets/images/ask_cancel.svg";
import upload from "@/assets/images/ad-icon.svg";
import calender from "@/assets/images/calendar.svg";
import { AdvertisementDto } from "@/@types/dto/AdvertisementDto";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { advertisementValidationSchema } from "@/@types/validators/advertisementValidators";
import { getAdvertisementById } from "@/services/loadData";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import environment from "@/environment";
import fetchGeneral from "@/lib/fetchGeneral";

interface IUserFormTemplateProps {
  advertisementId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function AdvertisementsFormTemplate({ advertisementId, isEdit, isView }: Readonly<IUserFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const [openAdd, setOpenAdd] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [fileName, setFileName] = useState("");
  const [imgError, setImgError] = useState("");
  const { isHttpClientLoading } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleOpenCancel = () => setOpenCancel(true);
  const handleCloseCancel = () => setOpenCancel(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const {
    register,
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<AdvertisementDto>({
    defaultValues: new AdvertisementDto(),
    resolver: valibotResolver(advertisementValidationSchema),
  });

  async function handleCreate(adData: AdvertisementDto) {
    const formData = new FormData();
    formData.append("isActive", adData.isActive.toString());
    formData.append("Date", new Date(adData.date).toISOString());

    if (fileInputRef.current?.files?.[0]) {
      formData.append("ImageFile", fileInputRef.current.files[0]);
    }

    if (!fileName) {
      setImgError("Please upload an image");
      return;
    }
    setImgError("");

    try {
      const response = await fetchGeneral(EndPointsEnums.advertisements, {
        method: "POST",
        body: formData,
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      console.log(response);

      if (response.ok) {
        handleOpenAdd();
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(adData: AdvertisementDto) {
    const formData = new FormData();
    formData.append("isActive", adData.isActive.toString());

    formData.append("Date", new Date(adData.date).toISOString());

    if (fileInputRef.current?.files?.[0]) {
      formData.append("ImageFile", fileInputRef.current.files[0]);
    }

    try {
      const response = await fetchGeneral(EndPointsEnums.advertisements, {
        method: "PUT",
        params: { id: advertisementId },
        body: formData,
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.ok) {
        handleOpenAdd();
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleSubmitForm(adData: AdvertisementDto) {
    if (isView) return;

    if (isEdit) {
      await handleUpdate(adData);
    } else {
      await handleCreate(adData);
    }
  }

  function handleClearForm() {
    reset(new AdvertisementDto());
    push("/advertisements");
    handleCloseCancel();
  }

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (advertisementId && typeof advertisementId === "string") {
      getAdvertisementById(i18n.language, advertisementId)
        .then((res) => {
          if (res) {
            const data = new AdvertisementDto({
              ...res,
              date: new Date(res.date),
              ImageFile: `${environment.apiHost}/${res.image}`,
            });
            reset(data);
            setImagePreview(data.ImageFile);
          }
        })
        .catch(console.log);
    }
  }, [advertisementId, setValue, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImgError("");
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full Add_user_section">
      <div className="w-full p-8 py-0 pb-0">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ ...fontCairo, marginBottom: "28px" }}>
          <Link color="inherit" href={"/advertisements"} className="text-base font-bold no-underline text-[var(--primary)]">
            {t("advertisements")}
          </Link>
          {!isEdit && !isView && (
            <Typography className="text-[15px]" sx={{ ...fontCairo, color: "text.primary" }}>
              {t("add new advertisement")}
            </Typography>
          )}
          {isEdit && (
            <Typography className="text-[15px]" sx={{ ...fontCairo, color: "text.primary" }}>
              {t("edit advertisement")}
            </Typography>
          )}
        </Breadcrumbs>

        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="bg-[#fff] p-5 radius-[8px] mt-5">
            <h3 className="text-[#0B0311] form_title text-[16px] font-bold pb-2 border-b border-[#E4DDE9]">
              {!isEdit && !isView && <span className="text-[15px]">{t("add new advertisement")}</span>}
              {isEdit && <span className="text-[15px]">{t("edit advertisement")}</span>}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-20 mt-3">
              {/* Date */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("deadline")} *</label>
                <Controller
                  control={control}
                  name="date"
                  disabled={isHttpClientLoading}
                  render={({ field: { value, onChange } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={dayjs(value)}
                        className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg"
                        onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                        slots={{
                          openPickerIcon: () => <Image src={calender} alt="" className="w-[24px] h-[24px]" />,
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
                {errors.date?.message && <small className="text-[#f00]">{t(errors.date.message || "")}</small>}
              </div>

              {/* Image upload and preview */}
              <div className="mb-5 mt-9">
                <div className="flex flex-col" onClick={handleButtonClick}>
                  <div className="bg-[#f7f8fa] w-full relative h-[210px] flex flex-col items-center justify-center rounded-lg">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Selected image" className="w-full h-[210px] object-cover" />
                    ) : (
                      <div className="absolute flex flex-col items-center cursor-pointer justify-center">
                        <div className="bg-white w-[55px] h-[55px] flex justify-center items-center border-2 border-solid border-[#E8EEEE] rounded-full">
                          <InputAdornment position="start" sx={{ margin: "0px" }}>
                            <Image src={upload} alt="" onClick={handleButtonClick} className="w-[24px] h-[24px]" />
                          </InputAdornment>
                        </div>
                        <span className="text-[16px] font-normal text-[var(--primary)]">{t("choose image")}</span>
                      </div>
                    )}
                  </div>

                  <input
                    disabled={isHttpClientLoading}
                    {...register("ImageFile")}
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  {fileName && <p className="text-center">{fileName}</p>}
                </div>
                {imgError && <small className="text-[#f00]">{t(imgError)}</small>}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <div className="flex mb-2 gap-x-5 btns-wrapper">
              <button type="submit" className="add_button" disabled={isHttpClientLoading}>
                {!isEdit && !isView && <span>{t("Add")}</span>}
                {(isEdit || isView) && <span>{t("update data")}</span>}
              </button>

              <button type="button" onClick={handleOpenCancel} className="cancel_btn" disabled={isHttpClientLoading}>
                {t("Cancel")}
              </button>
            </div>
          </div>
        </form>

        {/* add modal */}
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
              <Link className="add_popup_button" href={"/advertisements"}>
                {t("view advertisements")}
              </Link>
            </div>
          </Box>
        </Modal>

        {/* cancel modal */}
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
              style={{ textAlign: "center", margin: "0 auto", display: "block" }}
            />

            <div className="text-center">
              <h3 className="font-bold text-[20px]">{t("Are you sure to cancel?")}</h3>
              <p className="font-normal text-[18px] mt-2">{t("When you click Cancel you will lose all information")}</p>
            </div>

            <div className="w-full mt-5 flex gap-5">
              <Button className="cancel_popup_button" onClick={handleClearForm} disabled={isHttpClientLoading}>
                {t("Cancel")}
              </Button>
              <Button onClick={handleCloseCancel} disabled={isHttpClientLoading} className="back_popup_button">
                {t("Back")}
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
