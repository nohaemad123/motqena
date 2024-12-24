"use client";

import { useTranslation } from "react-i18next";
import LanguageChangerAtom from "../atom/LanguageChangerAtom";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      {t("Home Page")}
      <LanguageChangerAtom />
    </div>
  );
}
