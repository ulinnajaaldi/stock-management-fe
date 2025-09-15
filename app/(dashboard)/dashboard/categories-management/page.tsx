import React from "react";

import { connection } from "next/server";

import CategoriesManagementFeature from "@/features/Dashboard/CategoriesManagement";
import { CategoriesManagementStore } from "@/features/Dashboard/CategoriesManagement/hook";

const CategoriesManagement = async () => {
  await connection();
  return (
    <CategoriesManagementStore>
      <CategoriesManagementFeature />
    </CategoriesManagementStore>
  );
};

export default CategoriesManagement;
