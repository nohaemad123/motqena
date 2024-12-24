"use client";

import { ILayout } from "@/@types/interfaces/ILayout";
import { ltrTheme, rtlTheme } from "@/lib/theme";
import { ThemeProvider } from "@mui/material";
import { useTranslation } from "react-i18next";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import { useEffect } from "react";
import { useAppStore } from "@/store";
import { SnackbarProvider } from "notistack";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const cacheLtr = createCache({
  key: "mui",
  stylisPlugins: [prefixer],
});
export default function AppLayout({ children }: Readonly<ILayout>) {
  const { i18n } = useTranslation();

  useEffect(() => {
    useAppStore.setState({ isHttpClientLoading: false });
  }, []);

  return (
    <CacheProvider value={i18n.dir(i18n.language) === "rtl" ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={i18n.dir(i18n.language) === "rtl" ? rtlTheme : ltrTheme}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
