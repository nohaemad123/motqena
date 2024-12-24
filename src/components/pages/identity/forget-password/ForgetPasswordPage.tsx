"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { MdOutlineEmail } from "react-icons/md";
import { valibotResolver } from "@hookform/resolvers/valibot";
import fetchClient from "@/lib/fetchClient";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { ForgetPasswordDto } from "@/@types/dto/ForgetPasswordDto";
import { forgetPasswordValidationSchema } from "@/@types/validators/forgetPasswordValidator";
import { IForgetPassword } from "@/@types/interfaces/IForgetPassword";
import { useAppStore } from "@/store";

export default function ForgetPasswordPage() {
  const { t } = useTranslation();
  const { push } = useRouter();
  const [forgotPassError, setForgotPassError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordDto>({
    defaultValues: new ForgetPasswordDto(),
    resolver: valibotResolver(forgetPasswordValidationSchema),
  });

  async function handleSubmitForm(data: ForgetPasswordDto) {
    setForgotPassError(null);

    try {
      const response = await fetchClient<ResultHandler<IForgetPassword>>(EndPointsEnums.forgetPassword, {
        method: "POST",
        body: data,
      });

      console.log("successful", response);

      if (response.status) {
        useAppStore.setState((state) => ({ ...state, email: data.email }));
        push(`/otp`);
      }
    } catch (error: any) {
      setForgotPassError(error.message);
    }
  }

  return (
    <>
      <div className="text-center">
        <h3 className="text-[28px] font-bold text-[#195950]">{t("forget password")}</h3>
        <p className="text-[24px] font-normal">{t("please fill your details to login to your account")}</p>
      </div>
      {/* Form */}
      <form className="mt-6 w-full px-4 py-6 sm:w-[490px]" onSubmit={handleSubmit(handleSubmitForm)}>
        {/* Email */}
        <div className="w-full mb-3">
          <label>{t("email")}</label>
          <div className="relative">
            <MdOutlineEmail className="absolute ms-4 top-[56%] text-xl text-[#808080CC] z-50 transform -translate-y-1/2" />
            <TextField type="email" {...register("email")} className="w-full custom-field pe-6" placeholder={t("email")} />
          </div>
          {errors.email && <p className="text-red-500">{t(errors.email.message || "")}</p>}
        </div>

        {forgotPassError && <p className="text-red-500">{forgotPassError}</p>}

        {/* Button */}
        <div className="w-full mt-8">
          <button className="auth-btn" type="submit">
            {t("next")}
          </button>
        </div>
      </form>
    </>
  );
}
