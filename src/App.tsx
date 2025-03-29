
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createElement } from "react"; // Import createElement to avoid React hooks issues
import Index from "./pages/Index";
import About from "./pages/About";
import Family from "./pages/Family";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Create App component without using hooks directly
const App = () => {
  return createElement(
    QueryClientProvider,
    { client: queryClient },
    createElement(
      TooltipProvider,
      null,
      createElement(Toaster, null),
      createElement(Sonner, null),
      createElement(
        BrowserRouter,
        null,
        createElement(
          Routes,
          null,
          createElement(Route, { path: "/", element: createElement(Index) }),
          createElement(Route, { path: "/about", element: createElement(About) }),
          createElement(Route, { path: "/family", element: createElement(Family) }),
          createElement(Route, { path: "*", element: createElement(NotFound) })
        )
      )
    )
  );
};

export default App;
