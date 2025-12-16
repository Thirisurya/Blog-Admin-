import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { BlogList } from "./pages/BlogList";
import { BlogEditor } from "./pages/BlogEditor";
import { Trash } from "./pages/Trash";
import { Layout } from "./components/layout/Layout";
import NotFound from "./pages/NotFound";
import { BlogProvider } from "./contexts/BlogContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BlogProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blogs" element={<Layout><BlogList /></Layout>} />
            <Route path="/blogs/new" element={<Layout><BlogEditor /></Layout>} />
            <Route path="/blogs/:id" element={<Layout><BlogEditor /></Layout>} />
            <Route path="/trash" element={<Layout><Trash /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BlogProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
