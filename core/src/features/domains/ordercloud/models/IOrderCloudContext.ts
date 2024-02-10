import { ApiRole } from "ordercloud-javascript-sdk";

export interface IOrderCloudContext {
  /**
   * Signifies when a valid token is available.
   * This will block all auth queries by default, mutation interaction will
   * be blocked by the login modal.
   */
  isAuthenticated: boolean;
  /**
   * Signifies when an authenticated user is registered.
   */
  isLoggedIn: boolean;
  /**
   * Clears all tokens from the OrderCloud JS SDK and conditionally will
   * get a new anonymous token based on allowAnonymous
   */
  logout: () => void;
  /**
   * Opens up the login modal
   */
  login: () => void;

  baseApiUrl: string;
  clientId: string;
  scope: ApiRole[];
  customScope: string[];
  allowAnonymous: boolean;
}
