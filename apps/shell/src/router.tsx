import { createBrowserRouter } from "react-router-dom";
import { ShellLayout } from "./shell/shell-layout";
import { experiments } from "./experiments";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ShellLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      ...experiments.map((experiment) => ({
        path: experiment.path.slice(1),
        element: <experiment.Component />
      }))
    ]
  }
]);
