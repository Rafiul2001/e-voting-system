import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import VoterList from "./pages/VoterList.tsx";
import CandidateList from "./pages/CandidateList.tsx";
import ElectionList from "./pages/ElectionList.tsx";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/voter-list",
        Component: VoterList,
      },
      {
        path: "/candidate-list",
        Component: CandidateList,
      },
      {
        path: "/election-list",
        Component: ElectionList,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
