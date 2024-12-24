import { ILayout } from "@/@types/interfaces/ILayout";
import AuthHeaderOrganism from "@/components/organisms/auth/AuthHeaderOrganism";
import React from "react";
import logo from "@/assets/images/logo.svg";
import shape from "@/assets/images/login.svg";
import Image from "next/image";

export default function Layout({ children }: Readonly<ILayout>) {
  return (
    <>
      <AuthHeaderOrganism />
      <div className="flex md:flex-nowrap flex-wrap justify-center items-center h-screen bg-white">
        <div className="flex flex-col justify-center items-center w-full md:w-1/2">{children}</div>
        {/* Image */}
        <div className="w-full relative overflow-hidden md:w-1/2 h-full bg-[#FAFCFC]">
          {/* <div className="blob flex"> */}
          <Image src={shape} alt="login" className="blob" width={280} height={160} />
          {/* </div> */}
          <div className="text-animation flex flex-col justify-center items-center">
            <Image src={logo} alt="login" width={280} height={160} />
            <div className="text-center mt-5 mx-16">
              <h3 className="text-[28px] font-bold text-white">مرحباً بك في متقنة لتقديم الخدمات</h3>
              <p className="text-2xl mt-2 font-normal text-white text-center">
                الحل الأمثل لجميع احتياجاتك الخدمية. نقدم لك خدمات سريعة، موثوقة، وسهلة الاستخدام لضمان راحتك ورضاك
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
