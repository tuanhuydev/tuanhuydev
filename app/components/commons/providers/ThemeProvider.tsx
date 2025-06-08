"use client";

import { sourceCodeFont } from "@app/font";
import { createTheme, ThemeProvider as MUIThemeProvider, StyledEngineProvider, THEME_ID } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { PropsWithChildren } from "react";

const palette = {
  slate400: "rgb(203, 213, 225)",
};
const MuiBaseTheme = createTheme({
  typography: {
    fontSize: 16,
    fontFamily: sourceCodeFont.style.fontFamily,
    body2: {
      fontSize: "0.875rem",
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#172733",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#4f46e5",
          contrastText: "#ffffff",
        },
        background: {
          default: "#f8fafc", // slate-50
          paper: "#ffffff", // white
        },
        text: {
          primary: "#1f2937", // slate-900
          secondary: "#6b7280", // slate-500
        },
      },
    },
    // dark: {}
  },
  zIndex: {
    drawer: 0,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: sourceCodeFont.style.fontFamily,
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        size: "small",
        fullWidth: true,
      },
      styleOverrides: {
        input: {
          padding: "0.5rem 0.75rem",
          backgroundColor: "white",
          "&:hover": {
            borderColor: palette.slate400, // slate-400
          },
          fontSize: "0.875rem",
          outline: "none",
          "&::placeholder": {
            color: "#94a3b8", // slate-400
            fontSize: "0.875rem",
            opacity: 1,
            fontWeight: 400,
          },
          "&:disabled": {
            backgroundColor: "rgb(248, 250, 252)",
            cursor: "not-allowed",
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        select: {
          backgroundColor: "white",
          borderColor: palette.slate400, // slate-400
          borderRadius: "0.375rem",
          borderWidth: "1px",
          borderStyle: "solid",
          "&:disabled": {
            backgroundColor: "rgb(248, 250, 252)",
            cursor: "not-allowed",
          },
          "&:hover": {
            borderColor: palette.slate400, // slate-400
          },
          fontSize: "0.875rem",
          lineHeight: "1rem",
          outline: "none",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          lineHeight: "1rem",
          padding: "0.5rem 0.75rem",
          "&:hover": {
            backgroundColor: "rgb(241, 245, 249)", // slate-200
          },
          "&.Mui-selected": {
            backgroundColor: "rgb(209, 213, 219)", // slate-300
            "&:hover": {
              backgroundColor: "rgb(209, 213, 219)", // slate-300
            },
          },
        },
      },
    },

    MuiDatePicker: {
      defaultProps: {
        enableAccessibleFieldDOMStructure: false,
        slotProps: {
          textField: {
            variant: "outlined",
            size: "small",
            fullWidth: true,
          },
        },
      },
    },
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: "0.25rem",
    //       fontSize: "0.875rem",
    //       borderColor: "rgb(203, 213, 225)",
    //       backgroundColor: "white",
    //       width: "100%",
    //       height: "2rem",
    //       "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    //         backgroundcolor: "rgb(203, 213, 225)",
    //         color: "rgb(203, 213, 225)", // slate-400
    //         borderColor: "rgb(203, 213, 225)",
    //       },
    //       "& input::placeholder": {
    //         fontSize: "0.875rem",
    //         color: "rgb(148, 163, 184)",
    //       },
    //       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    //         borderColor: "#172733",
    //       },
    //       "&:hover .MuiOutlinedInput-notchedOutline": {
    //         borderColor: "rgb(203, 213, 225)",
    //       },
    //       "& .MuiOutlinedInput-notchedOutline": {
    //         borderColor: "rgb(203, 213, 225)",
    //       },
    //     },
    //     input: {
    //       "&::placeholder": {
    //         color: "rgb(148 163 184)",
    //         opacity: 1,
    //         fontSize: "0.75rem",
    //         fontWeight: 400,
    //       },
    //     },
    //   },
    // },
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       textTransform: "capitalize",
    //       fontSize: "0.875rem",
    //       padding: "0.5rem 0.75rem",
    //       lineHeight: "1.25rem",
    //       borderRadius: "0.5rem",
    //     },
    //   },
    // },
  },
});

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={{ [THEME_ID]: MuiBaseTheme }}>{children}</MUIThemeProvider>
    </StyledEngineProvider>
  );
}
