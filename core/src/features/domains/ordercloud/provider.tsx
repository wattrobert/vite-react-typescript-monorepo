import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Auth, Configuration, Tokens } from "ordercloud-javascript-sdk";
import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import LoginModal from "../../auth/components/LoginModal";
import { OrderCloudContext } from "./context";
import { IOrderCloudProvider } from "./models/IOrderCloudProvider";
import { asyncStoragePersister, queryClient } from "./query";
import { isAnonToken } from "./utils";

const OrderCloudProvider: FC<PropsWithChildren<IOrderCloudProvider>> = ({
  children,
  baseApiUrl,
  clientId,
  scope,
  customScope,
  allowAnonymous,
}) => {
  useEffect(() => {
    Configuration.Set({
      cookieOptions: {
        prefix: clientId
      },
      baseApiUrl,
      clientID: clientId,
    });
  }, [baseApiUrl, clientId]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loginDisclosure = useDisclosure();

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setIsLoggedIn(false);
    Tokens.RemoveAccessToken();
    Tokens.RemoveRefreshToken();
    queryClient.clear();
  }, []);

  const handleLogin = useCallback(
    async (accessToken: string, refreshToken?: string) => {
      Tokens.SetAccessToken(accessToken);
      if (refreshToken) {
        Tokens.SetRefreshToken(refreshToken);
      }
      setIsAuthenticated(true);
      setIsLoggedIn(true);
      queryClient.clear();
      loginDisclosure.onClose();
    },
    [loginDisclosure]
  );

  const verifyToken = useCallback(async () => {
    const token = await Tokens.GetValidToken();

    if (token) {
      const isAnon = isAnonToken(token);
      if (isAnon && !allowAnonymous) {
        handleLogout();
        loginDisclosure.onOpen();
        return;
      }
      setIsAuthenticated(true);
      if (!isAnon) setIsLoggedIn(true);
      return;
    }

    if (!allowAnonymous) {
      loginDisclosure.onOpen();
      return;
    }

    const { access_token, refresh_token } = await Auth.Anonymous(
      clientId,
      scope,
      customScope
    );
    Tokens.SetAccessToken(access_token);
    Tokens.SetRefreshToken(refresh_token);
    setIsAuthenticated(true);
    setIsLoggedIn(false);
  }, [
    allowAnonymous,
    clientId,
    scope,
    customScope,
    handleLogout,
    loginDisclosure,
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      verifyToken();
    }
  }, [isAuthenticated, verifyToken]);

  const ordercloudContext = useMemo(() => {
    return {
      baseApiUrl,
      clientId,
      scope,
      customScope,
      allowAnonymous,
      isAuthenticated,
      isLoggedIn,
      logout: handleLogout,
      login: loginDisclosure.onOpen,
    };
  }, [
    allowAnonymous,
    baseApiUrl,
    clientId,
    customScope,
    handleLogout,
    isAuthenticated,
    isLoggedIn,
    loginDisclosure.onOpen,
    scope,
  ]);

  return (
    <ChakraProvider>
      <OrderCloudContext.Provider value={ordercloudContext}>
        <LoginModal disclosure={loginDisclosure} onLogin={handleLogin} />
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          {children}
        </PersistQueryClientProvider>
      </OrderCloudContext.Provider>
    </ChakraProvider>
  );
};

export default OrderCloudProvider;
