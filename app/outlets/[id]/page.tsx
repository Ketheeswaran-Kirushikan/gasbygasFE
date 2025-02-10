"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { getAllGasRequestsByOutletThunk } from "@/app/Redux/features/gasRequestSlice";
import { getOutletByIdThunk } from "@/app/Redux/features/outletSlice";
import { DashboardOverview } from "@/components/outlet/dashboard/overview";
import { StockOverview } from "@/components/outlet/dashboard/stock-overview";
import { IncomingRequests } from "@/components/outlet/dashboard/incoming-requests";

export default function Home() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const outletId = pathname.split("/")[2]; // Extract the ID from the URL

  // Fetch gas requests and outlet details when outletId is available
  useEffect(() => {
    if (outletId) {
      dispatch(getAllGasRequestsByOutletThunk(outletId));
      dispatch(getOutletByIdThunk(outletId));
    }
  }, [dispatch, outletId]);

  // Get the fetched gas requests from Redux store
  const { gasRequests, loading: gasLoading, error: gasError } = useSelector(
    (state) => state.gasRequests
  );

  // Get the fetched outlet data from Redux store
  const { outlet, loading: outletLoading, error: outletError } = useSelector(
    (state) => state.outlets
  );

  // Extract the correct gasStock array
  const gasStock = outlet?.outlet?.gasStock || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Pass gas requests & gas stock data */}
      <DashboardOverview 
        gasRequests={gasRequests} 
        gasStock={gasStock} 
        loading={gasLoading || outletLoading} 
        error={gasError || outletError} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StockOverview 
          gasStock={gasStock} 
          loading={outletLoading} 
          error={outletError} 
        />
        <IncomingRequests gasRequests={gasRequests} loading={gasLoading} error={gasError} />
      </div>
    </div>
  );
}
