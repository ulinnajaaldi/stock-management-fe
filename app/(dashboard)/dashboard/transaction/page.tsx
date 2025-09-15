import React from "react";

import { connection } from "next/server";

import TransactionFeature from "@/features/Dashboard/Transaction";
import { TransactionStore } from "@/features/Dashboard/Transaction/hook";

const Transaction = async () => {
  await connection();
  return (
    <TransactionStore>
      <TransactionFeature />
    </TransactionStore>
  );
};

export default Transaction;
