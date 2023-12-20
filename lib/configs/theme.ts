import { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#172733",
    borderRadius: 4,
  },
  components: {
    Input: {
      activeBorderColor: "rgb(203 213 225)",
      hoverBorderColor: "rgb(203 213 225)",
      colorBorder: "rgb(203 213 225)",
      borderRadius: 4,
      // controlOutline: 'transparent',
      // boxShadow: 'none'
    },
    Button: {
      defaultShadow: "transparent",
      primaryShadow: "transparent",
    },
    Collapse: {
      contentPadding: "12px 16px",
      headerPadding: "12px 0",
      contentBg: "#fff",
      headerBg: "#FFF",
    },
  },
};

export default theme;
