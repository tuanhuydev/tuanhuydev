import { QueryKey, useQuery } from "@tanstack/react-query";

export const useMobileSidebar = () => {
  return useQuery({
    queryKey: ["showMobileHamburger" as unknown as QueryKey],
    initialData: false,
  });
};
