import React from "react";
import logo from "@/assets/images/logo.svg";

export default function splashScreenTemplate() {
  return (
    <div className="splash-screen">
      <img src={logo.src} alt="logo" />
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );
}
