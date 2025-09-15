import React from "react";

import { connection } from "next/server";

import AdminManagementFeature from "@/features/Dashboard/AdminManagement";
import { AdminManagementStore } from "@/features/Dashboard/AdminManagement/hook";

const AdminManagement = async () => {
  await connection();
  return (
    <AdminManagementStore>
      <AdminManagementFeature />
    </AdminManagementStore>
  );
};

export default AdminManagement;
