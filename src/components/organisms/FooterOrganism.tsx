import { useTranslation } from "react-i18next";

export default function FooterOrganism() {
  const { t } = useTranslation();

  return <div className="text-center text-[var(--primary)] font-normal">{t("All rights reserved to Mutaqana")} &copy; 2024</div>;
}
