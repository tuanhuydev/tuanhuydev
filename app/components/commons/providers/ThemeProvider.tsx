"use client";

import { useTheme } from "@app/_utils/useTheme";
import { sourceCodeFont } from "@app/font";
import { createTheme, ThemeProvider as MUIThemeProvider, StyledEngineProvider, THEME_ID } from "@mui/material/styles";
import { useColorScheme } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { PropsWithChildren, useEffect } from "react";

const MuiBaseTheme = createTheme({
  shape: {
    borderRadius: 6,
  },
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
    dark: {
      palette: {
        primary: {
          main: "#f8fafc", // Light text for dark mode
          contrastText: "#1f2937",
        },
        secondary: {
          main: "#6366f1", // Brighter indigo for dark mode
          contrastText: "#ffffff",
        },
        background: {
          default: "#0f172a", // slate-900
          paper: "#1e293b", // slate-800
        },
        text: {
          primary: "#f1f5f9", // slate-100
          secondary: "#94a3b8", // slate-400
        },
        divider: "#334155", // slate-700
        action: {
          hover: "#334155", // slate-700
          selected: "#475569", // slate-600
          disabled: "#64748b", // slate-500
          disabledBackground: "#334155", // slate-700
        },
      },
    },
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
    MuiSvgIcon: {
      defaultProps: {
        fontSize: "small", // Default icon size
        sx: {
          fontSize: "1.125rem", // 16px
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "capitalize",
          fontSize: "0.875rem",
          padding: "0.5rem 0.75rem",
          lineHeight: "1.25rem",
          borderRadius: 6,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
      },
    },
    MuiInputBase: {
      defaultProps: {
        size: "small",
        fullWidth: true,
      },
      styleOverrides: {
        input: ({ theme }) => ({
          padding: "0.5rem 0.75rem",
          fontSize: "0.875rem",
          outline: "none",
          "&::placeholder": {
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
            opacity: 1,
            fontWeight: 400,
          },
          "&:disabled": {
            cursor: "not-allowed",
          },
        }),
      },
    },

    MuiSelect: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        select: ({ theme }) => ({
          borderRadius: 6,
          fontSize: "0.875rem",
          lineHeight: "1rem",
          outline: "none",
          "&:disabled": {
            cursor: "not-allowed",
          },
        }),
      },
    },

    // Enforce 6px radius across surfaces
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 6,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.secondary,
          },
        }),
        notchedOutline: {
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: "0.875rem",
          "&.Mui-focused": {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 6,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 6,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 6,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: "0.875rem",
          lineHeight: "1rem",
          padding: "0.5rem 0.75rem",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
            "&:hover": {
              backgroundColor: theme.palette.action.selected,
            },
          },
        }),
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
  },
});

// Component to sync MUI theme with your custom theme system
function ThemeSyncer() {
  const { darkMode } = useTheme();
  const { setMode } = useColorScheme();

  useEffect(() => {
    setMode(darkMode ? "dark" : "light");
  }, [darkMode, setMode]);

  return null;
}

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={{ [THEME_ID]: MuiBaseTheme }}>
        <ThemeSyncer />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
