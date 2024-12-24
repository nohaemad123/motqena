"use client";

import LanguageChangerAtom from "@/components/atom/LanguageChangerAtom";
import { Dispatch, SetStateAction } from "react";
import { FiBell } from "react-icons/fi";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { HiOutlineCog, HiOutlineUserCircle } from "react-icons/hi";
import { HiOutlineLogout } from "react-icons/hi";
import Image from "next/image";
import header_img from "@/assets/images/header-img.png";
import { FiChevronDown } from "react-icons/fi";
import { MdMenu } from "react-icons/md";

interface IHeaderOrganismProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function HeaderOrganism({ setOpen }: Readonly<IHeaderOrganismProps>) {
  const [anchorMenuEl, setAnchorMenuEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorMenuEl);
  const { myUser } = useAppStore();
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorMenuEl(null);
  };
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 h-20 px-6 bg-white flex justify-between items-center z-50">
      <div className="flex gap-3 items-center">
        <div>
          <IconButton
            className="bg-transparent border-none mt-1 text-[var(--primary)]"
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            <MdMenu className=" w-[30px] h-[30px]" />
          </IconButton>
        </div>
        <div className="relative">
          <Button
            id="basic-button"
            aria-controls={openMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            onClick={handleMenuClick}
            className="text-start mt-[20px] p-0 w-full border-0 hover:bg-white"
          >
            <div className="flex items-center gap-5">
              <Image src={header_img} alt="logo" width={55} height={55} className="rounded-2xl" />
              <div className="flex flex-col items-start">
                <span className="text-[16px] font-bold text-[var(--primary)] m-0">{t("motqana company")}</span>
                <span className="text-[14px] font-normal text-black m-0">{t("admin")}</span>
              </div>
              <FiChevronDown className="w-[24px] h-[24px] text-[var(--primary)]" />
            </div>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorMenuEl}
            open={openMenu}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem className="block" sx={{ borderBottom: "1px solid #ddd" }}>
              <h4 className="mt-1.5 text-md font-medium">{t("Signed in as")}</h4>
              <span className="mt-1.5 text-md font-medium">{myUser?.username}</span>
            </MenuItem>
            <MenuItem className="p-4 py-3 text-[16px] text-[#1e293b] border-b border-[#E8EEEE80]">
              <LanguageChangerAtom />
            </MenuItem>
            <MenuItem className="p-4 py-3 text-[16px] text-[#1e293b]">
              <span>
                <HiOutlineUserCircle className="w-[20px] h-[20px]" height={20} /> {t("Profile")}
              </span>
            </MenuItem>
            <MenuItem className="p-4 py-3 text-[16px] text-[#1e293b]">
              <span>
                <HiOutlineCog size={20} className="w-[20px] h-[20px]" /> {t("Settings")}
              </span>
            </MenuItem>
            <MenuItem className="p-4 py-3 text-[16px] text-[#1e293b]">
              <span>
                <HiOutlineLogout size={20} className="w-[20px] h-[20px]" /> {t("Sign out")}
              </span>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <div className="icons flex gap-2">
          <div>
            <IconButton
              sx={{ borderRadius: "16px", background: "transparent", border: "1px solid #E8EEEE ", width: "48px", height: "48px" }}
            >
              <FiBell className="text-[var(--primary)] w-[32px]" />
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  );
}
