"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersThunk } from "@/app/Redux/features/userSlice";
import { RootState } from "@/app/Redux/store/store";
import { getOutletByIdThunk } from "@/app/Redux/features/outletSlice";
import { createGasRequestThunk } from "@/app/Redux/features/gasRequestSlice";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

interface DeliveryRequestFormProps {
  onCancel: () => void;
}

export function DeliveryRequestForm({ onCancel }: DeliveryRequestFormProps) {
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.user);
  const { outlet } = useSelector((state: RootState) => state.outlets);
  const { id: outletId } = useParams();

  // 🛠️ Form States
  const [gasType, setGasType] = useState("");
  const [gasWeight, setGasWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [userDetails, setUserDetails] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [handoverEmptyCylinder, setHandoverEmptyCylinder] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    dispatch(getAllUsersThunk());
    dispatch(getOutletByIdThunk(outletId));
  }, [dispatch, outletId]);

  useEffect(() => {
    if (outlet?.outlet?.gasStock) {
      const selectedGas = outlet.outlet.gasStock.find(
        (gas) => gas.gasType === gasType && gas.weight === gasWeight
      );
      if (selectedGas) {
        setTotalPrice(selectedGas.individualPrice * quantity);
      }
    }
  }, [gasType, gasWeight, quantity, outlet]);

  // 🛠️ Handle Submit Request
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    if (!gasType || !gasWeight || !quantity || !userDetails || !paymentOption) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const requestData = {
      gasType,
      gasWeight,
      quantity,
      userDetails,
      paymentOption,
      handoverEmptyCylinder,
      price: totalPrice,
      outletDetails: outletId,
    };

    try {
      console.log("Submitting Request Data:", requestData);
      await dispatch(createGasRequestThunk(requestData)).unwrap();
      onCancel();
    } catch (error) {
      console.error("Request submission failed:", error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* User Selection */}
        <div className="space-y-2">
          <Label>Select User</Label>
          <Select onValueChange={setUserDetails} value={userDetails}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.allUsers?.length > 0 ? (
                users.allUsers
                  .filter((user) => user.NIC) // ✅ Ensure NIC exists
                  .map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.firstName} - {user.NIC}
                    </SelectItem>
                  ))
              ) : (
                <SelectItem disabled>No users found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Gas Type */}
        <div className="space-y-2">
          <Label>Gas Type</Label>
          <Select onValueChange={setGasType} value={gasType}>
            <SelectTrigger>
              <SelectValue placeholder="Select gas type" />
            </SelectTrigger>
            <SelectContent>
              {outlet?.outlet?.gasStock ? (
                [...new Set(outlet.outlet.gasStock.map((gas) => gas.gasType))].map(
                  (type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  )
                )
              ) : (
                <SelectItem disabled>No gas types found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Gas Weight */}
        <div className="space-y-2">
          <Label>Gas Weight</Label>
          <Select onValueChange={(value) => setGasWeight(Number(value))} value={gasWeight}>
            <SelectTrigger>
              <SelectValue placeholder="Select gas weight" />
            </SelectTrigger>
            <SelectContent>
              {outlet?.outlet?.gasStock
                ?.filter((gas) => gas.gasType === gasType)
                .map((gas) => (
                  <SelectItem key={gas.weight} value={gas.weight}>
                    {gas.weight} KG
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label>Quantity Needed</Label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        {/* Payment Option */}
        <div className="space-y-2">
          <Label>Payment Option</Label>
          <Select onValueChange={setPaymentOption} value={paymentOption}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash payment">Cash Payment</SelectItem>
              <SelectItem value="online payment">Online Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Handover Empty Cylinder */}
        <div className="space-y-2">
          <Label>Handover Empty Cylinder</Label>
          <input
            type="checkbox"
            checked={handoverEmptyCylinder}
            onChange={(e) => setHandoverEmptyCylinder(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label>Total Price</Label>
          <Input
            type="text"
            value={`LKR ${totalPrice.toLocaleString()}`}
            readOnly
            className="font-semibold bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <DialogClose asChild>
          <Button type="submit">Submit</Button>
        </DialogClose>
      </div>
    </form>
  );
}
