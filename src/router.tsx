import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./index.css";
import MainPage from "./ui/pages/main";
import App from "./App";
import LoginPage from "./ui/pages/login";

const defaultRouter: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    id: "app",
    path: "/",
    element: <App />,
    loader: App.loader,
    children: [
      {
        path: "",
        element: <MainPage />,
      },
    ],
  },
];

const AppRouter = () => {
  return <RouterProvider router={createBrowserRouter(defaultRouter)} />;
};

export default AppRouter;
