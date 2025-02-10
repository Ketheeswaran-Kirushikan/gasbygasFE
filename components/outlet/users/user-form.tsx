"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// **Validation Schema**
const phoneRegex = /^[0-9]{10}$/;
const nicRegex = /^[0-9]{9}[vVxX]|[0-9]{12}$/;

// Function to generate random password
const generatePassword = () => Math.random().toString(36).slice(-10);

const consumerSchema = z.object({
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(phoneRegex, "Phone number must be 10 digits"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  NIC: z.string().regex(nicRegex, "Invalid NIC format"),
  password: z.string().optional(), // Automatically generated
  userType: z.literal("consumer"), // Always "consumer"
});

interface UserFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function UserForm({ onCancel, onSubmit, initialData }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(consumerSchema),
    defaultValues: {
      ...initialData,
      password: initialData?.password || generatePassword(), // Generate password if not provided
      userType: "consumer", // Set userType to "consumer" by default
    },
  });

  const handleFormSubmit = async (data: any) => {
    try {
      onSubmit(data);
      onCancel();
    } catch (error) {
      console.error("Form Submission Error:", error);

      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input {...register("firstName")} />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message as string}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input {...register("lastName")} />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message as string}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message as string}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Label>Mobile Number</Label>
          <Input {...register("phoneNumber")} placeholder="0123456789" />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message as string}</p>
          )}
        </div>

        {/* NIC */}
        <div className="space-y-2">
          <Label>NIC</Label>
          <Input {...register("NIC")} />
          {errors.NIC && (
            <p className="text-red-500 text-sm">{errors.NIC.message as string}</p>
          )}
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
        <Button type="submit">Add Consumer</Button>
      </div>
    </form>
  );
}
