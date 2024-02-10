import { createContext } from "react";
import { IOrderCloudContext } from "./models/IOrderCloudContext";

const INITIAL_ORDERCLOUD_CONTEXT:IOrderCloudContext = {
    isAuthenticated: false,
    isLoggedIn: false,
    logout: () => {},
    login: () => {},
    
  baseApiUrl: 'https://api.ordercloud.io/v1',
  clientId: '',
  scope: [],
  customScope: [],
  allowAnonymous: false
}

export const OrderCloudContext = createContext<IOrderCloudContext>(INITIAL_ORDERCLOUD_CONTEXT);
