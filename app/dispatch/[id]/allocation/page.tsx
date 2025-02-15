"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Redux/store/store";
import { getAllGasesThunk, createGasThunk, updateGasThunk } from "@/app/Redux/features/gasSlice";
import { addGasStockThunk } from "@/app/Redux/features/dispatchSlice";

import { Layout } from "@/components/dispatch/layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";

interface GasStock {
  type: string;
  weight: string;
  price: string;
  quantity: string;
  individualPrice: string;
}

export default function StockManagement() {
  const dispatch: AppDispatch = useDispatch();
  const { gases, loading, error } = useSelector((state: RootState) => state.gas);

  const { id: dispatchId } = useParams(); // Replace with actual dispatch ID

  const [searchTerm, setSearchTerm] = useState("");
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [newStock, setNewStock] = useState<GasStock>({
    type: "",
    weight: "",
    price: "",
    quantity: "",
    individualPrice: "",
  });

  useEffect(() => {
    dispatch(getAllGasesThunk());
  }, [dispatch]);

  const filteredStock = gases?.filter(
    (item) =>
      item?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item?.weight || "").includes(searchTerm) ||
      String(item?.price || "").includes(searchTerm)
  );

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStock.type || !newStock.weight || !newStock.quantity || !newStock.individualPrice) {
      toast.warn("Please fill in all fields.");
      return;
    }

    try {
      // ✅ 1. Create Gas Entry in Gas Collection
      const gasResponse = await dispatch(
        createGasThunk({
          type: newStock.type,
          weight: parseFloat(newStock.weight),
          price: parseFloat(newStock.individualPrice), // Send individualPrice as price
        })
      ).unwrap();

      // ✅ 2. Add Gas Stock Entry to Dispatch Collection
      await dispatch(
        addGasStockThunk({
          dispatchId,
          gasStockData: {
            gasType: newStock.type,
            weight: parseFloat(newStock.weight),
            quantity: parseInt(newStock.quantity),
            price: parseFloat(newStock.individualPrice) * parseInt(newStock.quantity), // Calculate total price
            individualPrice: parseFloat(newStock.individualPrice),
          },
        })
      ).unwrap();
      setNewStock({ type: "", weight: "", price: "", quantity: "", individualPrice: "" });
      setIsStockDialogOpen(false);
    } catch (error) {
    }
  };

  // ✅ Handle Toggle Active/Inactive Status
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await dispatch(updateGasThunk({ id, gasData: { isActive: !currentStatus } })).unwrap();
      
    } catch (error) {
    }
  };

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row items-start sm:items-center justify-between">
          <h1 className="text-2xl font-semibold">Gas Management</h1>
          <div className="flex items-center space-x-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gas types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[200px] text-sm"
            />
            <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gas Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Gas Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleStockSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label>Type</label>
                    <Input
                      type="text"
                      placeholder="Enter gas type (e.g., Domestic, Industrial)"
                      value={newStock.type}
                      onChange={(e) => setNewStock({ ...newStock, type: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Weight (KG)</label>
                    <Input
                      type="number"
                      value={newStock.weight}
                      onChange={(e) => setNewStock({ ...newStock, weight: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Quantity</label>
                    <Input
                      type="number"
                      value={newStock.quantity}
                      onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Individual Price (LKR)</label>
                    <Input
                      type="number"
                      value={newStock.individualPrice}
                      onChange={(e) => setNewStock({ ...newStock, individualPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="submit">Add Gas Type</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center">Loading gas stock...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Weight (KG)</TableHead>
                  <TableHead>Price (LKR)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.weight}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.isActive}
                          onChange={() => handleToggleStatus(item._id, item.isActive)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </label>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}