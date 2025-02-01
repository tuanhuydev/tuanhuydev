export const toCapitalize = (str: string) => {
  const [firstChar, ...restChar] = str;
  return firstChar.toUpperCase().concat(restChar.join(""));
};
