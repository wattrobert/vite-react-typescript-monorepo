import { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Orders, Profile } from "@wattrobert/core-ui";

const basename = import.meta.env.VITE_APP_CONFIG_BASE;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Profile />
      },
      {
        path: "/orders",
        element: <Orders direction="Outgoing"/>
      }
    ],
  },
], {basename});

const AppRouter: FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;