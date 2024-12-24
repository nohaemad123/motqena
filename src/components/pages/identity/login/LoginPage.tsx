"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { MdOutlineEmail, MdOutlineLockOpen, MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import fetchClient from "@/lib/fetchClient";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { useRouter } from "next/navigation";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { ILogin } from "@/@types/interfaces/ILogin";
import { useAppStore } from "@/store";
import { LoginDto } from "@/@types/dto/LoginDto";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { loginValidationSchema } from "@/@types/validators/loginValidator";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    defaultValues: new LoginDto(),
    resolver: valibotResolver(loginValidationSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmitForm(data: LoginDto) {
    setLoginError(null);

    try {
      const response = await fetchClient<ResultHandler<ILogin>>(EndPointsEnums.login, {
        method: "POST",
        body: data,
      });

      console.log("successful", response);

      if (response.status) {
        useAppStore.setState({ myUser: response.data });
        push(`/`);
      }
    } catch (error: any) {
      setLoginError(error.message);
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
        {/* Email */}
        <div className="w-full mb-3">
          <label>{t("email")}</label>
          <div className="relative">
            <MdOutlineEmail className="absolute ms-4 top-[56%] text-xl text-[#808080CC] z-50 transform -translate-y-1/2" />
            <TextField type="email" {...register("email")} className="w-full custom-field pe-6" placeholder={t("email")} />
          </div>
          {errors.email && <p className="text-red-500">{t(errors.email.message || "")}</p>}
        </div>

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

        <div className="flex justify-end items-center my-4">
          {/* Forget password */}
          <div className="">
            <Link href="/forget-password" className="no-underline text-black">
              {t("forget password?")}
            </Link>
          </div>
        </div>

        {loginError && <p className="text-red-500">{loginError}</p>}

        {/* Login button */}
        <div className="w-full mt-8">
          <button className="auth-btn" type="submit">
            {t("login")}
          </button>
        </div>
      </form>
    </>
  );
}
