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
      hoverBg: "rgb(203 213 225)",
    },
    Button: {
      defaultShadow: "transparent",
      primaryShadow: "transparent",
      colorLink: "@colorPrimary",
      colorLinkHover: "@colorPrimary",
      colorLinkActive: "@colorPrimary",
    },
    Collapse: {
      contentPadding: "12px 16px",
      headerPadding: "12px 0",
      contentBg: "#FFF",
      headerBg: "#FFF",
    },
    Select: {
      optionSelectedBg: "rgb(241 245 249)",
    },
  },
};

export default theme;
