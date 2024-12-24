"use client";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useState } from "react";
import { Box, Breadcrumbs, Button, ButtonBase, InputAdornment, Modal, TextField, Typography } from "@mui/material";
import ask_cancel from "@/assets/popup images/Transfer files-rafiki.svg";
import Image from "next/image";
import { JobDto } from "@/@types/dto/JobDto";
import { jobValidationSchema } from "@/@types/validators/jobValidators";
import { modalStyle } from "@/@types/styles";
import Link from "next/link";
import { fontCairo } from "@/@types/styles";
import { IJob } from "@/@types/interfaces/IJob";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { getJobById } from "@/services/loadData";
import ask_add from "@/assets/images/ask-add.gif";
import filter from "@/assets/images/edit-2.svg";
import { useAppStore } from "@/store";

interface IBranchFormTemplateProps {
  jobId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function JobFormTemplate({ jobId, isEdit, isView }: Readonly<IBranchFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [openAdd, setOpenAdd] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const handleOpenCancel = () => setOpenCancel(true);
  const handleCloseCancel = () => setOpenCancel(false);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<JobDto>({
    defaultValues: new JobDto(),
    resolver: valibotResolver(jobValidationSchema),
  });

  useEffect(() => {
    if (jobId && typeof jobId === "string") {
      getJobById(i18n.language, jobId)
        .then((res) => {
          if (res) {
            const data = new JobDto({
              ...res,
              nameAr: res.names.find((name) => name.language === "ar")?.value ?? "",
              nameEn: res.names.find((name) => name.language === "en")?.value ?? "",
            });

            reset(data);
          }
        })
        .catch(console.log);
    }
  }, [jobId]);

  async function handleCreate(jobData: JobDto) {
    try {
      const response = await fetchClient<ResultHandler<IJob>>(EndPointsEnums.job, {
        method: "POST",
        body: jobData,
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

  async function handleUpdate(jobData: JobDto) {
    try {
      const response = await fetchClient<ResultHandler<IJob>>(EndPointsEnums.job, {
        method: "PUT",
        body: jobData,
        params: {
          id: jobId,
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

  async function handleSubmitForm(jobData: JobDto) {
    if (isView) return;

    jobData.names ??= [];

    if (jobData.nameEn) {
      jobData.names.push({
        id: null,
        language: "en",
        value: jobData.nameEn,
        localizationSetsId: null,
      });
    }

    if (jobData.nameAr) {
      jobData.names.push({
        id: null,
        language: "ar",
        value: jobData.nameAr,
        localizationSetsId: null,
      });
    }

    if (isEdit) {
      await handleUpdate(jobData);
    } else {
      await handleCreate(jobData);
    }
  }

  return (
    <div className="flex-grow w-full flex flex-col p-5">
      <div className="w-full">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ ...fontCairo, marginBottom: "28px" }}>
          <Link color="inherit" href={"/jobs"} className="text-base font-bold no-underline text-[var(--primary)]">
            {t("Jobs")}
          </Link>
          {!isEdit && !isView && (
            <Typography className="text-[15px]" sx={{ color: "text.primary", ...fontCairo }}>
              {t("Add new job")}
            </Typography>
          )}
          {isEdit && (
            <Typography className="text-[15px]" sx={{ color: "text.primary", ...fontCairo }}>
              {t("Edit job")}
            </Typography>
          )}
        </Breadcrumbs>

        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="bg-[#fff] p-5 radius-[8px] mt-5">
            <h3 className="text-[#0B0311] form_title text-[16px] font-bold pb-2 border-b border-[#E4DDE9]">
              {!isEdit && !isView && <span className="text-[15px]">{t("Add new job")}</span>}
              {isEdit && <span className="text-[15px]">{t("Edit job")}</span>}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-20 mt-3">
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                  {t("Arabic job name")} <span className="text-[#f00] mx-2">*</span>
                </label>
                <TextField
                  disabled={isView || isHttpClientLoading}
                  placeholder={t("Arabic job name")}
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
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("English job name")}</label>
                <TextField
                  disabled={isView || isHttpClientLoading}
                  placeholder={t("English job name")}
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
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <div className="flex mb-2 gap-x-5 btns-wrapper">
              <button type="submit" className="add_button">
                {!isEdit && !isView && <span>{t("Add")}</span>}
                {(isEdit || isView) && <span>{t("Update info")}</span>}{" "}
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
              <Link className="add_popup_button" href={"/jobs"}>
                {t("View jobs")}
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
              <Link href={"/jobs"} className="cancel_popup_button">
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
