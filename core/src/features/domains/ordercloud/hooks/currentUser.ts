import { Me, MeUser, OrderCloudError, RequiredDeep } from "ordercloud-javascript-sdk";
import { queryClient, useAuthMutation, useAuthQuery } from "../query";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

export function useCurrentUser():UseQueryResult<RequiredDeep<MeUser>, OrderCloudError> {
  return useAuthQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await Me.Get(),
    retry: false,
    refetchOnMount:false,
  });
}

export function useMutateCurrentUser():UseMutationResult<RequiredDeep<MeUser>, unknown, Partial<MeUser>, unknown> {
    return useAuthMutation({
        mutationKey: ["currentUser"],
        mutationFn: async (userData:Partial<MeUser>) => await Me.Patch(userData),
        onSuccess: (data) => {
            queryClient.setQueryData(["currentUser"], data)
        },
    })
}