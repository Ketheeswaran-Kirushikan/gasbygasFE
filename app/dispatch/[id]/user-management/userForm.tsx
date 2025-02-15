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
const nicRegex = /^[0-9]{9}[vVxX]|[0-9]{12}$/;

// Function to generate a random password
const generatePassword = () => Math.random().toString(36).slice(-10);

const userSchema = z.discriminatedUnion("userType", [
  z.object({
    userType: z.literal("consumer"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().regex(phoneRegex, "Phone number must be 10 digits"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    NIC: z.string().regex(nicRegex, "Invalid NIC format"),
    password: z.string().optional(), // Auto-generated
  }),
  z.object({
    userType: z.literal("businessIndustry"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().regex(phoneRegex, "Phone number must be 10 digits"),
    companyName: z.string().min(2, "Company name is required"),
    registrationNumber: z.string().min(2, "Registration number is required"),
    businessCategory: z.string().min(2, "Business category is required"),
    password: z.string().optional(), // Auto-generated
  }),
]);

interface UserFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function UserForm({ onCancel, onSubmit, initialData }: UserFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      ...initialData,
      password: initialData?.password || generatePassword(), // Generate password if not provided
      userType: initialData?.userType || "consumer", // Default to "consumer"
    },
  });

  const userType = watch("userType"); // Watch the userType field

  const handleFormSubmit = async (data: any) => {
    try {
      onSubmit(data);
      onCancel();
      toast.success("User successfully added!");
    } catch (error) {
      console.error("Form Submission Error:", error);
      toast.error("Failed to submit form.");
    }
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* User Type Selector */}
        <div className="space-y-2">
          <Label>User Type</Label>
          <Controller
            name="userType"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset dependent fields when switching user types
                  setValue("password", generatePassword());
                  setValue("email", "");
                  setValue("phoneNumber", "");
                  if (value === "consumer") {
                    setValue("firstName", "");
                    setValue("lastName", "");
                    setValue("NIC", "");
                  } else {
                    setValue("companyName", "");
                    setValue("registrationNumber", "");
                    setValue("businessCategory", "");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="businessIndustry">Business/Industry</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Common Fields */}
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input {...register("phoneNumber")} placeholder="0123456789" />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message as string}</p>}
        </div>

        {/* Conditional Fields */}
        {userType === "consumer" ? (
          <>
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input {...register("firstName")} />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input {...register("lastName")} />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label>NIC</Label>
              <Input {...register("NIC")} />
              {errors.NIC && <p className="text-red-500 text-sm">{errors.NIC.message as string}</p>}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input {...register("companyName")} />
              {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label>Registration Number</Label>
              <Input {...register("registrationNumber")} />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm">{errors.registrationNumber.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Business Category</Label>
              <Input {...register("businessCategory")} />
              {errors.businessCategory && (
                <p className="text-red-500 text-sm">{errors.businessCategory.message as string}</p>
              )}
            </div>
          </>
        )}

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
        <Button type="submit">Add User</Button>
      </div>
    </form>
  );
}
