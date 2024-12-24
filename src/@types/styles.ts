import { SxProps } from "@mui/material";

export const buttonStyle: SxProps = {
  backgroundColor: "var(--primary)",
};

export const linkStyle: SxProps = {
  fontSize: "18px",
  fontWeight: "400",
};

export const actionIconStyle: SxProps = {
  textAlign: "center",
  margin: "auto",
  border: 0,
  display: "flex",
  justifyContent: "center",
  width: "8px",
  height: "8px",
  padding: 2,
  lineHeight: "16px",
  borderRadius: "6px",
  cursor: "pointer",
};

export const fontCairo: SxProps = {
  fontFamily: "__Cairo_655793",
};

export const modalStyle: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30vw",
  backgroundColor: "white",
  minWidth: "520px",
  boxShadow: 24,
  padding: "16px",
  borderRadius: "16px",
  animation: "slideUp 0.3s ease-out",
  "@keyframes slideUp": {
    "0%": {
      transform: "translate(-50%, 100%)",
      opacity: 0,
    },
    "100%": {
      transform: "translate(-50%, -50%)",
      opacity: 1,
    },
  },
};

export const activeLink: SxProps = {
  background: "linear-gradient(45deg, #195950, #56B948)",
  borderRadius: "0 16px 16px 0",
  color: "white",
};

export const printBtn: SxProps = {
  backgroundColor: "#195950",
  borderRadius: "8px",
  color: "white",
  fontSize: "16px",
  fontWeight: "400",
  width: "70px",
  height: "35px",
};

export const SidebarLink: SxProps = {
  "&:hover": {
    backgroundColor: "#E8EEEE",
    color: "#195950",
    borderRadius: "0 16px 16px 0",
    // "img": {
    //   filter: "invert(1)",
    // },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: "3px",
      background: "linear-gradient(45deg, #195950, #56B948)",
    },
  },
};

export const searchInput: SxProps = {
  background: "#F7F8FA",
  border: "1px solid #E8EEEE4D",
};

export const dataTable: SxProps = {
  "&.${tableCellClasses.head}`": {
    background: "#000",
  },
  "&:nth-of-type(odd)": {
    background: "#F7F8FA99",
  },
};

export const table: SxProps = {
  border: "1px solid #E8EEEE",
  borderRadius: "8px",
};

export const SerProvTableHeadCell: SxProps = {
  ...fontCairo,
  fontSize: "12px",
  fontWeight: "400",
  // padding: "0",
  color: "black",
  height: "44px",
};
export const tableHeadCell: SxProps = {
  ...fontCairo,
  fontSize: "16px",
  fontWeight: "400",
  padding: "0",
  color: "black",
};

export const tableBodyCell: SxProps = {
  ...fontCairo,
  fontSize: "16px",
  fontWeight: "400",
  color: "var(--primary)",
  border: "1px solid #E8EEEE",
  "&:nth-of-type(first-child), &:nth-of-type(last-child)": {
    borderRight: "none",
    borderLeft: "none",
  },
};

export const mainButton: SxProps = {
  ...fontCairo,
  background: "linear-gradient(90deg, #195950 0 %, #56b948 100 %)",
  borderRadius: "8px",
  fontSize: "18px",
  color: "#fff",
  fontWeight: "700",
  width: "200px",
};
