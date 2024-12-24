"use client";

import { createTheme } from "@mui/material/styles";

export const ltrTheme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#195950",
    },
  },
});

export const rtlTheme = createTheme({
  cssVariables: true,
  direction: "rtl",
  palette: {
    primary: {
      main: "#195950",
    },
  },
});
