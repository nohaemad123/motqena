"use client";

import { BranchDto } from "@/@types/dto/BranchDto";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { branchValidationSchema } from "@/@types/validators/branchValidators";
import { useEffect, useMemo, useState } from "react";
import { Box, Breadcrumbs, Button, ButtonBase, InputAdornment, Modal, TextField, Typography } from "@mui/material";
// import { HiOutlineSearch } from "react-icons/hi";
import ask_cancel from "@/assets/popup images/Transfer files-rafiki.svg";
import Image from "next/image";
import Link from "next/link";
import { modalStyle } from "@/@types/styles";
import { fontCairo } from "@/@types/styles";
import filter from "@/assets/images/edit-2.svg";
import location from "@/assets/images/location.svg";
import mobile from "@/assets/images/mobile.svg";
import message from "@/assets/images/message.svg";
import ask_add from "@/assets/images/ask-add.gif";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IJob } from "@/@types/interfaces/IJob";
import fetchClient from "@/lib/fetchClient";
import { getBranchById } from "@/services/loadData";
import dynamic from "next/dynamic";
import { useAppStore } from "@/store";
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// import "leaflet-defaulticon-compatibility";

interface IBranchFormTemplateProps {
  branchId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "35vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
};

export default function BranchFormTemplate({ branchId, isEdit, isView }: Readonly<IBranchFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [openLocateMap, setOpenLocateMap] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const handleOpenLocateMap = () => setOpenLocateMap(true);
  const handleCloseLocateMap = () => setOpenLocateMap(false);
  const handleOpenCancel = () => setOpenCancel(true);
  const handleCloseCancel = () => setOpenCancel(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const {
    register,
    reset,
    // watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchDto>({
    defaultValues: new BranchDto(),
    resolver: valibotResolver(branchValidationSchema),
  });

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/organisms/Map"), {
        // loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );

  // const MapClickHandler = () => {
  //   useMapEvents({
  //     click(e) {
  //       console.log(e.latlng.lat);
  //       setValue("longitude", e.latlng.lng);
  //       setValue("latitude", e.latlng.lat);
  //     },
  //   });
  //   return null;
  // };

  useEffect(() => {
    if (branchId && typeof branchId === "string") {
      getBranchById(i18n.language, branchId)
        .then((res) => {
          if (res) {
            const data = new BranchDto({
              ...res,
              nameAr: res.names.find((name) => name.language === "ar")?.value ?? "",
              nameEn: res.names.find((name) => name.language === "en")?.value ?? "",
            });

            reset(data);
          }
        })
        .catch(console.log);
    }
  }, [branchId]);

  async function handleCreate(branchData: BranchDto) {
    try {
      const response = await fetchClient<ResultHandler<IJob>>(EndPointsEnums.branch, {
        method: "POST",
        body: branchData,
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

  async function handleUpdate(branchData: BranchDto) {
    try {
      const response = await fetchClient<ResultHandler<IJob>>(EndPointsEnums.branch, {
        method: "PUT",
        body: branchData,
        params: {
          id: branchId,
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

  async function handleSubmitForm(branchData: BranchDto) {
    if (isView) return;
    branchData.names ??= [];

    if (branchData.nameEn) {
      branchData.names.push({
        id: null,
        language: "en",
        value: branchData.nameEn,
        localizationSetsId: null,
      });
    }

    if (branchData.nameAr) {
      branchData.names.push({
        id: null,
        language: "ar",
        value: branchData.nameAr,
        localizationSetsId: null,
      });
    }
    if (isEdit) {
      await handleUpdate(branchData);
    } else {
      await handleCreate(branchData);
    }
  }

  // function handleClearForm() {
  //   reset(new BranchDto());
  //   handleCloseCancel();
  // }

  return (
    <>
      <div className="flex-grow w-full flex flex-col p-5">
        <div className="w-full">
          <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ ...fontCairo, marginBottom: "28px" }}>
            <Link color="inherit" href={"/branches"} className="text-base font-bold no-underline text-[var(--primary)]">
              {t("Branches")}
            </Link>
            {!isEdit && !isView && (
              <Typography className="text-[15px]" sx={{ color: "text.primary", ...fontCairo }}>
                {t("Add new branch")}
              </Typography>
            )}
            {isEdit && (
              <Typography className="text-[15px]" sx={{ color: "text.primary", ...fontCairo }}>
                {t("Edit branch")}
              </Typography>
            )}
          </Breadcrumbs>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="bg-[#fff] p-5 radius-[8px] mt-5">
              <h3 className="text-[#0B0311] form_title text-[16px] font-bold pb-2 border-b border-[#E4DDE9]">
                {!isEdit && !isView && <span className="text-[15px]">{t("Add new branch")}</span>}
                {isEdit && <span className="text-[15px]">{t("Edit branch")}</span>}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-5 mt-3">
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Arabic branch name")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Arabic branch name")}
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
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("English branch name")}</label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("English branch name")}
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
                  {errors.nameEn?.message && <small className="text-[#f00] ">{t(errors.nameEn.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("City name")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("City name")}
                    {...register("cityName")}
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
                  {errors.cityName?.message && <small className="text-[#f00]">{t(errors.cityName.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Neighborhood name")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Neighborhood name")}
                    {...register("neighborhood")}
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
                  {errors.neighborhood?.message && <small className="text-[#f00]">{t(errors.neighborhood.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Phone number")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Phone number")}
                    {...register("phone")}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={mobile} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                  />
                  {errors.phone?.message && <small className="text-[#f00]">{t(errors.phone.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Email")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Email")}
                    {...register("email")}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={message} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                  />
                  {errors.email?.message && <small className="text-[#f00]">{t(errors.email.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Choose location")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <div className="relative flex bg-[#f7f8fa] p-0 mt-2 rounded-[8px] border border-[#E8EEEE99]">
                    <TextField
                      disabled={isView || isHttpClientLoading}
                      placeholder={t("Choose location")}
                      {...register("locationTitle")}
                      slotProps={{
                        input: {
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <Image src={location} width={24} height={24} alt="filter" />
                            </InputAdornment>
                          ),
                        },
                      }}
                      className=" w-[80%] 
    text-ellipsis ps-5 mt-0  text-lg font-secondary text-secondary border-0"
                    />
                    <Button type="button" onClick={handleOpenLocateMap} className="modal_button">
                      {t("Locate")}
                    </Button>
                  </div>

                  {/* {errors.locationTitle?.message && <small className="text-[#f00] block">{t(errors.locationTitle.message)}</small>} */}
                  {errors.locationTitle?.message && <small className="text-[#f00] block">{t(errors.locationTitle.message)}</small>}
                  {/* {errors.latitude?.message && <small className="text-[#f00] block">{t(errors.latitude.message)}</small>} */}
                </div>
              </div>
            </div>
            <Modal
              open={openLocateMap}
              onClose={handleCloseLocateMap}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="transition-modal-title" className="mb-10" variant="h6" component="h2">
                  <ButtonBase type="button" className="close_modal" onClick={handleCloseLocateMap}>
                    X
                  </ButtonBase>
                  <span className="mx-4">{t("Locate address")}</span>
                </Typography>

                <Map
                  setValue={setValue}
                  latitude={getValues("latitude")}
                  longitude={getValues("longitude")}
                  locationTitle={getValues("locationTitle")}
                  handleCloseLocateMap={handleCloseLocateMap}
                />
                {/* <MapContainer center={[21.42251, 39.826168]} className="mt-[25px]" zoom={13} scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapClickHandler />
                  {watch("latitude") !== null && watch("longitude") !== null && (
                    <Marker position={[watch("latitude")!, watch("longitude")!]}>
                    </Marker>
                  )}
                </MapContainer> */}

                {/* <p className="mt-5 ">
                  <span className="text-primary text-[16px] font-bold">{t("Address")} :</span>
                  <span className="mx-2">جامعة عين شمس / مصر الجديدة</span>
                </p> */}
              </Box>
            </Modal>

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

          <Modal
            open={openAdd}
            onClose={handleCloseAdd}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
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
                <Link className="add_popup_button" href={"/branches"}>
                  {t("View branches")}
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
                <Link href={"/branches"} className="cancel_popup_button">
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
    </>
  );
}
