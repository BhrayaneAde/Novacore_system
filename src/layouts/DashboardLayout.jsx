import React from "react";
import Sidebar from "../pages/Dashboard/components/Sidebar";
import Header from "../pages/Dashboard/components/Header";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Header />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
