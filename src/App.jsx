import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProjectDetail from "@/components/pages/ProjectDetail";
import Layout from "@/components/organisms/Layout";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import Dashboard from "@/components/pages/Dashboard";
import PlaceholderPage from "@/components/pages/PlaceholderPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="resources" element={<PlaceholderPage title="Resources" description="Manage team members, equipment, and materials" icon="Users" features={["Team management", "Equipment tracking", "Material inventory", "Resource scheduling"]} />} />
            <Route path="financials" element={<PlaceholderPage title="Financials" description="Track budgets, expenses, and financial reporting" icon="DollarSign" features={["Budget tracking", "Expense management", "Invoice generation", "Financial reports"]} />} />
            <Route path="reports" element={<PlaceholderPage title="Reports" description="Generate insights and analytics for your projects" icon="BarChart3" features={["Project analytics", "Progress reports", "Budget analysis", "Performance metrics"]} />} />
          </Route>
        </Routes>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;