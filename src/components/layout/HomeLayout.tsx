"use client";

import { ILayout } from "@/@types/interfaces/ILayout";
import FooterOrganism from "@/components/organisms/FooterOrganism";
import HeaderOrganism from "@/components/organisms/HeaderOrganism";
import SidebarOrganism from "@/components/organisms/SidebarOrganism";
import { useState } from "react";

export default function HomeLayout({ children }: Readonly<ILayout>) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <div className="flex h-full">
      <SidebarOrganism open={isDrawerOpen} setOpen={setIsDrawerOpen} />
      <div className="flex-grow h-full overflow-y-auto flex flex-col">
        <HeaderOrganism setOpen={setIsDrawerOpen} />
        {children}
        <FooterOrganism />
      </div>
    </div>
  );
}
