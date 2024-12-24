"use client";

import { UserDto } from "@/@types/dto/UserDto";
import { userValidationSchema } from "@/@types/validators/userValidators";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { getAllBranches, getAllRoles, getUserById } from "@/services/loadData";
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
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ask_add from "@/assets/images/ask-add.gif";
import ask_cancel from "@/assets/images/ask_cancel.svg";
import { fontCairo, modalStyle } from "@/@types/styles";
import { SlLock } from "react-icons/sl";
import { IBranch } from "@/@types/interfaces/IBranch";
import { IRole } from "@/@types/interfaces/IRole";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import fetchClient from "@/lib/fetchClient";
import { IUser } from "@/@types/interfaces/IUser";
import filter from "@/assets/images/edit-2.svg";
import mobile from "@/assets/images/mobile.svg";
import message from "@/assets/images/message.svg";
import card from "@/assets/images/personalcard.svg";
import buildings from "@/assets/images/buildings.svg";
import profile from "@/assets/images/profile-user.svg";
import { getTranslatedName } from "@/@types/stables";
import { useRouter } from "next/navigation";

interface IUserFormTemplateProps {
  userId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function UsersFormTemplate({ userId, isEdit, isView }: Readonly<IUserFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const [openAdd, setOpenAdd] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const handleOpenCancel = () => setOpenCancel(true);
  const handleCloseCancel = () => setOpenCancel(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>({
    defaultValues: new UserDto(),
    resolver: valibotResolver(userValidationSchema),
  });

  useEffect(() => {
    if (userId && typeof userId === "string") {
      getUserById(i18n.language, userId)
        .then((res) => {
          if (res) {
            const data = new UserDto({
              ...res,
            });
            reset(data);
          }
        })
        .catch(console.log);
    }
    getAllBranches(i18n.language)
      .then((res) => {
        if (res) {
          setBranches(res?.listData ?? []);
        }
      })
      .catch(console.log);
    getAllRoles(i18n.language)
      .then((res) => {
        if (res) {
          setRoles(res?.listData ?? []);
        }
      })
      .catch(console.log);
  }, [userId]);

  async function handleCreate(userData: UserDto) {
    console.log(userData);
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.user, {
        method: "POST",
        body: userData,
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        handleOpenAdd();
      } else {
        console.error("Error Updating user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  async function handleUpdate(userData: UserDto) {
    console.log(userData);
    try {
      const response = await fetchClient<ResultHandler<IUser>>(EndPointsEnums.user, {
        method: "PUT",
        body: userData,
        params: {
          id: userId,
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        handleOpenAdd();
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleSubmitForm(userData: UserDto) {
    if (isView) return;

    if (isEdit) {
      await handleUpdate(userData);
    } else {
      await handleCreate(userData);
    }
  }

  function handleClearForm() {
    reset(new UserDto());
    handleCloseCancel();
    push("/users");
  }

  return (
    <div className="w-full">
      <div className="w-full p-8 py-0 pb-0">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ ...fontCairo, marginBottom: "28px" }}>
          <Link color="inherit" href={"/users"} className="text-base font-bold no-underline text-[var(--primary)]">
            {t("users")}
          </Link>
          {!isEdit && !isView && (
            <Typography className="text-[15px]" sx={{ ...fontCairo, color: "text.primary" }}>
              {t("add new user")}
            </Typography>
          )}
          {isEdit && (
            <Typography className="text-[15px]" sx={{ ...fontCairo, color: "text.primary" }}>
              {t("edit user")}
            </Typography>
          )}
        </Breadcrumbs>

        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="bg-[#fff] p-5 radius-[8px] mt-5">
            <h3 className="text-[#0B0311] form_title text-[16px] font-bold pb-2 border-b border-[#E4DDE9]">
              {!isEdit && !isView && <span className="text-[15px]">{t("add new user")}</span>}
              {isEdit && <span className="text-[15px]">{t("edit user")}</span>}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-20 mt-3">
              {/*  name */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("user name")}*</label>
                <TextField
                  placeholder={t("user name")}
                  {...register("name")}
                  sx={{ color: "text.primary", ...fontCairo }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image src={filter} width={24} height={24} alt="filter" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                />
                {errors.name?.message && <small className="text-[#f00]">{t(errors.name.message)}</small>}
              </div>

              {/* jop number */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("jop number")}*</label>
                <TextField
                  placeholder={t("jop number")}
                  {...register("jobNumber")}
                  sx={{ color: "text.primary", ...fontCairo }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image src={card} width={24} height={24} alt="filter" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                />
                {errors.jobNumber?.message && <small className="text-[#f00]">{t(errors.jobNumber.message)}</small>}
              </div>

              {/* phone */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("phone")}*</label>
                <TextField
                  placeholder={t("phone")}
                  {...register("phoneNumber")}
                  sx={{ color: "text.primary", ...fontCairo }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image src={mobile} width={24} height={24} alt="filter" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                />
                {errors.phoneNumber?.message && <small className="text-[#f00]">{t(errors.phoneNumber.message)}</small>}
              </div>

              {/* address */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("address")}</label>
                <TextField
                  placeholder={t("address")}
                  {...register("address")}
                  sx={{ color: "text.primary", ...fontCairo }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image src={filter} width={24} height={24} alt="filter" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                />
                {errors.address?.message && <small className="text-[#f00]">{t(errors.address.message)}</small>}
              </div>

              {/* roles */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("user permission")}*</label>
                <Controller
                  control={control}
                  name="roles"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      displayEmpty
                      value={value}
                      onChange={(e) => {
                        onChange([e.target.value]);
                      }}
                      sx={{ height: "48px", ...fontCairo }}
                      input={
                        <OutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <Image src={profile} width={24} height={24} alt="filter" />
                            </InputAdornment>
                          }
                        />
                      }
                      className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                    >
                      <MenuItem value={""} disabled>
                        {t("users permissions")}
                      </MenuItem>
                      {roles.map((x) => (
                        <MenuItem key={x.id} value={x.name}>
                          {x.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.roles?.message && <small className="text-[#f00]">{t(errors.roles.message)}</small>}
              </div>

              {/* email */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("email")}*</label>
                <TextField
                  placeholder={t("email")}
                  {...register("email")}
                  sx={{ height: "48px", ...fontCairo }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image src={message} width={24} height={24} alt="filter" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                />
                {errors.email?.message && <small className="text-[#f00]">{t(errors.email.message)}</small>}
              </div>

              {/* branch */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("branch name")}*</label>
                <Controller
                  control={control}
                  name="branches"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      displayEmpty
                      value={value}
                      onChange={(e) => {
                        onChange([e.target.value]);
                      }}
                      sx={{ height: "48px", ...fontCairo }}
                      input={
                        <OutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <Image src={buildings} width={24} height={24} alt="filter" />
                            </InputAdornment>
                          }
                        />
                      }
                      className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                    >
                      <MenuItem value={""} disabled>
                        {t("Choose branche")}
                      </MenuItem>
                      {branches.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {getTranslatedName(x.names, i18n.language) || x.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.branches?.message && <small className="text-[#f00]">{t(errors.branches.message)}</small>}
              </div>

              {/* password */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("password")}*</label>
                <TextField
                  placeholder={t("password")}
                  {...register("password")}
                  sx={fontCairo}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SlLock className="text-[#808080CC] w-[24px] h-[24px]" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                />
                {errors.password?.message && <small className="text-[#f00]">{t(errors.password.message)}</small>}
              </div>

              {/* confirm password */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("confirm password")}*</label>
                <TextField
                  placeholder={t("confirm password")}
                  {...register("confirmPassword")}
                  sx={{ color: "text.primary", ...fontCairo }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SlLock className="text-[#808080CC] w-[24px] h-[24px]" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                />
                {errors.confirmPassword?.message && <small className="text-[#f00]">{t(errors.confirmPassword.message)}</small>}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <div className="flex mb-2 gap-x-5 btns-wrapper">
              <button type="submit" className="add_button">
                {!isEdit && !isView && <span>{t("Add")}</span>}
                {(isEdit || isView) && <span>{t("update data")}</span>}
              </button>

              <button type="button" onClick={handleOpenCancel} className="cancel_btn">
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
                <p className="font-normal text-[18px] mt-2">
                  {!isEdit && !isView && <span>{t("The operation was completed successfully")}</span>}
                  {(isEdit || isView) && <span>{t("The operation was updated successfully")}</span>}
                </p>
              </p>
            </div>

            <div className="flex w-full mt-5">
              <Link className="add_popup_button" href={"/users"}>
                {t("view users")}
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
              <Button className="cancel_popup_button" onClick={handleClearForm}>
                {t("Cancel")}
              </Button>
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
