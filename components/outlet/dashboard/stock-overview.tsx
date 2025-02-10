"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Gas database (mapping gas IDs to details)
const gasDatabase = {
  "6794c0843c70b6eec9437fea": { type: "Domestic", weight: 5, price: 1000 },
  "6794c0843c70b6eec9437feb": { type: "Domestic", weight: 12.5, price: 2500 },
  "6794c0843c70b6eec9437fec": { type: "Domestic", weight: 37.5, price: 7500 },
  "6794c0843c70b6eec9437fed": { type: "Industrial", weight: 5, price: 1000 },
  "6794c0843c70b6eec9437fee": { type: "Industrial", weight: 12.5, price: 2500 },
  "6794c0843c70b6eec9437fef": { type: "Industrial", weight: 37.5, price: 7500 },
};

export function StockOverview({ gasStock }) {
  // Map gasStock to include gas details
  const stockWithGasDetails = gasStock?.map((stock) => {
    const gasDetails = gasDatabase[stock.gas] || { type: "Unknown", weight: 0 };
    return { ...stock, type: gasDetails.type, weight: gasDetails.weight };
  });

  // Aggregate stock quantities for Industrial
  const industrialStock = stockWithGasDetails
    .filter((stock) => stock.type === "Industrial")
    .reduce((acc, stock) => {
      const weightLabel = `${stock.weight} kg`;
      if (!acc[weightLabel]) {
        acc[weightLabel] = 0;
      }
      acc[weightLabel] += stock.quantity;
      return acc;
    }, {});

  // Aggregate stock quantities for Domestic
  const domesticStock = stockWithGasDetails
    .filter((stock) => stock.type === "Domestic")
    .reduce((acc, stock) => {
      const weightLabel = `${stock.weight} kg`;
      if (!acc[weightLabel]) {
        acc[weightLabel] = 0;
      }
      acc[weightLabel] += stock.quantity;
      return acc;
    }, {});

  // Convert to chart-friendly format
  const industrialChartData = Object.keys(industrialStock).map((weight) => ({
    name: weight,
    total: industrialStock[weight],
  }));

  const domesticChartData = Object.keys(domesticStock).map((weight) => ({
    name: weight,
    total: domesticStock[weight],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Industrial Gas Chart */}
      <Card className="shadow-lg">
        <CardHeader className="pb-0">
          <CardTitle>Industrial Gas Stock</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={industrialChartData} barSize={50}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="total" fill="#007BFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Domestic Gas Chart */}
      <Card className="shadow-lg">
        <CardHeader className="pb-0">
          <CardTitle>Domestic Gas Stock</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={domesticChartData} barSize={50}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="total" fill="#28A745" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
