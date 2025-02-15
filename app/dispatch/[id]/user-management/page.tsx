"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Layout } from "@/components/dispatch/layout";
import { AppDispatch } from "@/app/Redux/store/store";
import { getAllUsersThunk } from "@/app/Redux/features/userSlice";
import { getAllOutletsThunk } from "@/app/Redux/features/outletSlice";
import { UserManagement } from "./userTable";

export default function UserManagementPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllUsersThunk());
    dispatch(getAllOutletsThunk());
  }, [dispatch]);

  return (
    <Layout>
      <UserManagement />
    </Layout>
  );
}
