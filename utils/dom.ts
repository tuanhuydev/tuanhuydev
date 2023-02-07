export const reflectTheme = (theme: string) => {
  const htmlElement = document.querySelector("html");
  if (htmlElement) {
    htmlElement.setAttribute("class", theme);
  }
  document.firstElementChild?.setAttribute("data-theme", theme);
  
};
