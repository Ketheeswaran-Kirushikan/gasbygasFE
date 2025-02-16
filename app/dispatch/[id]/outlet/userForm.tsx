"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// **Validation Schema**
const phoneRegex = /^[0-9]{10}$/;

// Function to generate a random password
const generatePassword = () => Math.random().toString(36).slice(-10);

const outletSchema = z.object({
  outletName: z.string().min(2, "Outlet name is required"),
  outletAddress: z.string().min(2, "Address is required"),
  registrationNumber: z.string().min(2, "Registration number is required"),
  emailAddress: z.string().email("Invalid email address"),
  password: z.string().optional(),
});

interface OutletFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function OutletForm({ onCancel, onSubmit, initialData }: OutletFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(outletSchema),
    defaultValues: {
      ...initialData,
      password: initialData?.password || generatePassword(), // Generate password if not provided
    },
  });

  const handleFormSubmit = async (data: any) => {
    try {
      onSubmit(data);
      onCancel();
      toast.success("Outlet successfully added!");
    } catch (error) {
      console.error("Form Submission Error:", error);
      toast.error("Failed to submit form.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Outlet Name */}
        <div className="space-y-2">
          <Label>Outlet Name</Label>
          <Input {...register("outletName")} />
          {errors.outletName && <p className="text-red-500 text-sm">{errors.outletName.message as string}</p>}
        </div>

        {/* Outlet Address */}
        <div className="space-y-2">
          <Label>Outlet Address</Label>
          <Input {...register("outletAddress")} />
          {errors.outletAddress && <p className="text-red-500 text-sm">{errors.outletAddress.message as string}</p>}
        </div>

        {/* Registration Number */}
        <div className="space-y-2">
          <Label>Registration Number</Label>
          <Input {...register("registrationNumber")} />
          {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber.message as string}</p>}
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input type="email" {...register("emailAddress")} />
          {errors.emailAddress && <p className="text-red-500 text-sm">{errors.emailAddress.message as string}</p>}
        </div>

        {/* Password (Auto-Generated) */}
        <div className="space-y-2">
          <Label>Password (Auto-Generated)</Label>
          <Input {...register("password")} readOnly className="bg-gray-100" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Outlet</Button>
      </div>
    </form>
  );
}