import { QUERY_KEYS } from "./queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useMobileSidebar = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SHOW_MOBILE_HAMBURGER],
    queryFn: () => false,
    initialData: false,
  });
};
