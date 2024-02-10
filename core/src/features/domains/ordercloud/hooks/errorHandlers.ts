import { useToast } from "@chakra-ui/react";
import { OrderCloudError } from "ordercloud-javascript-sdk";
import { useCallback } from "react";
import useOrderCloudContext from "./useOrderCloudContext";

export const useDefaultErrorHandler = () => {
  const toast = useToast();
  const { logout } = useOrderCloudContext();

  return useCallback(
    (error: OrderCloudError) => {
      if (error.status === 401) {
        logout();
        return;
      }
      if (!toast.isActive(error.errorCode)) {
        toast({ id: error.errorCode, title: error.status === 403 ? 'Permission denied' : error.message, status: "error" });
      }
    },
    [toast, logout]
  );
};
