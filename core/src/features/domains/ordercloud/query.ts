import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  QueryClient,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  keepPreviousData,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { OrderCloudError } from "ordercloud-javascript-sdk";
import { useMemo } from "react";
import { useDefaultErrorHandler } from "./hooks/errorHandlers";
import useOrderCloudContext from "./hooks/useOrderCloudContext";
import { defaultRetryFn } from "./utils";
import { Persister } from "@tanstack/react-query-persist-client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: defaultRetryFn,
    },
  },
});

export const asyncStoragePersister:Persister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export function useAuthQuery<
  TQueryFnData = unknown,
  TError = OrderCloudError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  onError?: (error: OrderCloudError) => void
): UseQueryResult<TData, TError> {
  const defaultErrorHandler = useDefaultErrorHandler();
  const { isAuthenticated } = useOrderCloudContext();

  const authQueryOptions: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  > = useMemo(() => {
    return {
      enabled: isAuthenticated,
      placeholderData: isAuthenticated ? keepPreviousData : undefined,
    };
  }, [isAuthenticated]);

  const query = useQuery({ ...options, ...authQueryOptions });

  if (query.error) {
    if (typeof onError === "function") {
      onError(query.error as unknown as OrderCloudError);
    }
    //this should only ever be used with the OrderCloud JS SDK if used properly
    defaultErrorHandler(query.error as unknown as OrderCloudError);
  }

  return query;
}

export function useAuthMutation<
  TData = unknown,
  TError = unknown,
  TVariables = TData,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const defaultErrorHandler = useDefaultErrorHandler();
  //   const { isAuthenticated } = useContext(OrderCloudContext);

  const authMutationOptions: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  > = useMemo(() => {
    return {
      onError: (error: TError) =>
        options.onError
          ? options.onError
          : defaultErrorHandler(error as OrderCloudError),
    };
  }, [defaultErrorHandler, options.onError]);

  return useMutation({ ...options, ...authMutationOptions });
}
