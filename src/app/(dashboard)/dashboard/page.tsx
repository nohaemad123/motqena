import { useMemo } from "react";
import dynamic from "next/dynamic";

export default function Page() {
  const DashboardViewPage = useMemo(
    () =>
      dynamic(() => import("@/components/pages/dashboard/DashboardViewPage"), {
        ssr: false,
      }),
    [],
  );
  return <DashboardViewPage />;
}
