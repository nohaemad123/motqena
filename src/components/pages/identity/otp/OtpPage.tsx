"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { MuiOtpInput } from "mui-one-time-password-input";
import fetchClient from "@/lib/fetchClient";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IOtp } from "@/@types/interfaces/IOtp";
import { OtpDto } from "@/@types/dto/OtpDto";
import { useAppStore } from "@/store";

export default function OtpPage() {
  const { t } = useTranslation();
  const { push, replace } = useRouter();
  const [otpError, setOtpError] = useState<string | null>(null);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<OtpDto>({
    defaultValues: new OtpDto(),
  });

  async function handleSubmitForm(data: OtpDto) {
    setOtpError(null);

    const otpReq = {
      email: useAppStore.getState().email,
      code: data.code,
    };

    if (!otpReq.email) {
      replace(`/forget-password`);
    }

    try {
      const response = await fetchClient<ResultHandler<IOtp>>(EndPointsEnums.checkOtp, {
        method: "POST",
        body: otpReq,
      });

      console.log("successful", response);

      if (response.status) {
        push(`/change-password`);
      }
    } catch (error: any) {
      setOtpError(error.message);
    }
  }

  return (
    <>
      <div className="text-center">
        <h3 className="text-[28px] font-bold text-[#195950]">{t("forget password")}</h3>
        <p className="text-[24px] font-normal w-3/4 m-auto">{t("we have sent you the code to your email, enter it to login")}</p>
      </div>
      <form className="mt-6 w-full px-4 py-6 sm:w-[490px]" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="w-full mb-3">
          <label>{t("otp")}</label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <MuiOtpInput {...field} length={4} onChange={field.onChange} value={field.value || ""} className="mt-4" />
            )}
          />
          {errors.code && <p className="text-red-500">{t(errors.code.message || "")}</p>}
        </div>

        {otpError && <p className="text-red-500">{otpError}</p>}

        <div className="w-full mt-8">
          <button className="auth-btn" type="submit">
            {t("next")}
          </button>
        </div>
      </form>
    </>
  );
}
