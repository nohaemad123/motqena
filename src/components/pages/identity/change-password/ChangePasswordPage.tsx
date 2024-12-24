"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Modal, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { MdOutlineLockOpen, MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import auth_confirm from "@/assets/images/auth_confirm.svg";
import Link from "next/link";
import fetchClient from "@/lib/fetchClient";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { ResetPasswordDto } from "@/@types/dto/ResetPasswordDto";
import { IResetPassword } from "@/@types/interfaces/IResetPassword";
import { resetPasswordValidationSchema } from "@/@types/validators/resetPasswordValidator";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const { t, i18n } = useTranslation();
  const { replace } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<ResetPasswordDto>({
    defaultValues: new ResetPasswordDto(),
    resolver: valibotResolver(resetPasswordValidationSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30vw",
    bgcolor: "background.paper",
    borderRaduis: 8,
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  async function handleSubmitForm(data: ResetPasswordDto) {
    console.log(data);

    setOtpError(null);

    const resetPasswordReq = {
      email: useAppStore.getState().email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    console.log(resetPasswordReq);
    if (!resetPasswordReq.email) {
      replace(`/forget-password`);
    }

    try {
      const response = await fetchClient<ResultHandler<IResetPassword>>(EndPointsEnums.resetPassword, {
        method: "POST",
        body: resetPasswordReq,
      });

      console.log("successful", response);

      if (response.status) {
        handleOpen();
      }
    } catch (error: any) {
      setOtpError(error.message);
    }
  }

  return (
    <>
      <div className="text-center">
        <h3 className="text-[28px] font-bold text-[#195950]">{t("login")}</h3>
        <p className="text-[24px] font-normal">{t("please fill your details to login to your account")}</p>
      </div>
      {/* Form */}
      <form className="mt-6 w-full px-4 py-6 sm:w-[490px]" onSubmit={handleSubmit(handleSubmitForm)}>
        {/* Password */}
        <div className="w-full mb-3">
          <label>{t("password")}</label>
          <div className="relative">
            <div className="relative">
              <MdOutlineLockOpen
                className="absolute ms-4 top-[56%] text-xl text-[#808080CC] z-50 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
              />
              <TextField
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full custom-field p-2"
                placeholder={t("password")}
              />
            </div>
            <button
              onClick={togglePasswordVisibility}
              type="button"
              className={`absolute ${i18n.dir() === "rtl" ? "left-5" : "right-5"} top-[62%] transform -translate-y-1/2 text-[23px] text-[#808080CC] bg-transparent border-0`}
            >
              {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
            </button>
          </div>
          {errors.password && <p className="text-red-500">{t(errors.password.message || "")}</p>}
        </div>

        {/* confirm password */}
        <div className="w-full mb-3">
          <label>{t("confirm password")}</label>
          <div className="relative">
            <div className="relative">
              <MdOutlineLockOpen
                className="absolute ms-4 top-[56%] text-xl text-[#808080CC] z-50 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
              />
              <TextField
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="w-full custom-field p-2"
                placeholder={t("confirm password")}
              />
            </div>
            <button
              onClick={togglePasswordVisibility}
              type="button"
              className={`absolute ${i18n.dir() === "rtl" ? "left-5" : "right-5"} top-[62%] transform -translate-y-1/2 text-[23px] text-[#808080CC] bg-transparent border-0`}
            >
              {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500">{t(errors.confirmPassword.message || "")}</p>}
        </div>

        {otpError && <p className="text-red-500">{otpError}</p>}

        {/* Button */}
        <div className="w-full mt-8">
          <button className="auth-btn" type="submit">
            {t("confirm")}
          </button>
        </div>
      </form>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Image
            src={auth_confirm.src}
            alt="logo"
            width={400}
            height={400}
            className="text-center justify-center m-auto w-full"
            style={{ textAlign: "center", margin: "auto" }}
          />

          <div className="text-center">
            <h3 className="font-bold text-[22px] text-[#195950]">{t("congratulations")}</h3>
            <p className="font-normal text-[18px] mt-2">{t("the password has been successfully changed. Sign in")}</p>
          </div>

          <div className="w-full mt-5">
            <Link href="/login" className="auth-btn text-white">
              {t("login")}
            </Link>
          </div>
        </Box>
      </Modal>
    </>
  );
}
