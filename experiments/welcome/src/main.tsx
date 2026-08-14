import "@playground/ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WelcomePage } from "./welcome-page";
import { standaloneStore } from "./standalone-store";

const router = createBrowserRouter([
  {
    path: "*",
    element: <WelcomePage />
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={standaloneStore}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
