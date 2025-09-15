import React from "react";

import { connection } from "next/server";

import ProductManagementFeature from "@/features/Dashboard/ProductManagement";
import { ProductManagementStore } from "@/features/Dashboard/ProductManagement/hook";

const ProductManagement = async () => {
  await connection();
  return (
    <ProductManagementStore>
      <ProductManagementFeature />
    </ProductManagementStore>
  );
};

export default ProductManagement;
