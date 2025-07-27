import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./index.css";
import MainPage from "./ui/pages/main";

const defaultRouter: RouteObject[] = [
  {
    path: "/",
    element: <MainPage />,
  },
];

const AppRouter = () => {
  return <RouterProvider router={createBrowserRouter(defaultRouter)} />;
};

export default AppRouter;
