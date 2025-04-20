
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabs from "@/components/admin/AdminTabs";

const AdminSettings = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <AppLayout initialSidebarOpen={true}>
        <div className="w-full container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdminHeader />
          <AdminTabs />
        </div>
      </AppLayout>
    </div>
  );
};

export default AdminSettings;
