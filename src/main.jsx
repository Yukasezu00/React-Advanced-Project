import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { EventsPage } from "./pages/EventsPage";
import { EventPage } from "./pages/EventPage";
import { AddEventPage } from "./pages/AddEventPage";

import { CategoriesProvider } from "./contexts/CategoriesContext";
import { UsersProvider } from "./contexts/UsersContext";
import theme from "./theme"; // 👈 toegevoegd

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <EventsPage /> },
      { path: "/event/:eventId", element: <EventPage /> },
      { path: "/add", element: <AddEventPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      {" "}
      {/* 👈 theme toegevoegd hier */}
      <UsersProvider>
        <CategoriesProvider>
          <RouterProvider router={router} />
        </CategoriesProvider>
      </UsersProvider>
    </ChakraProvider>
  </React.StrictMode>
);
