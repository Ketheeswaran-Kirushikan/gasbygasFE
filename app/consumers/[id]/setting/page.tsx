"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/consumer/language-context";
import { useTheme } from "@/contexts/consumer/theme-context";
import { toast } from "sonner";
import { RootState } from "@/app/Redux/store/store";
import {
  getUserByIdThunk,
  updateUserThunk,
} from "@/app/Redux/features/userSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface FormDataState {
  userType: string;
  email: string;
  phoneNumber: string;
  image: File | string;
  firstName: string;
  lastName: string;
  NIC: string;
  companyName: string;
  registrationNumber: string;
  businessCategory: string;
  certification: string;
}

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const { id: userID } = useParams();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);

  const [formData, setFormData] = useState<FormDataState>({
    userType: "consumer",
    email: "",
    phoneNumber: "",
    image: "",
    firstName: "",
    lastName: "",
    NIC: "",
    companyName: "",
    registrationNumber: "",
    businessCategory: "",
    certification: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (userID) {
      dispatch(getUserByIdThunk(userID));
    }
  }, [userID, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        userType: user.userType,
        email: user.email,
        phoneNumber: user.phoneNumber,
        image: user.image,
        firstName: user.firstName,
        lastName: user.lastName,
        NIC: user.NIC,
        companyName: user.companyName,
        registrationNumber: user.registrationNumber,
        businessCategory: user.businessCategory,
        certification: user.certification,
      });
    }
  }, [user]);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Store the selected image file
    setFormData((prev) => ({
      ...prev,
      image: file, // Store file as a File object
    }));
  };
  
  const handleSubmit = async () => {
    try {
      const { image, ...userData } = formData; // Extract image separately
  
      // Dispatch the update user thunk with imageFile separately
      await dispatch(updateUserThunk({ id: userID, userData, imageFile: image }));
  
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const passwordPayload = {
        password: passwordData.newPassword,
      };

      await dispatch(updateUserThunk({ id: userID, userData: passwordPayload }));

      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="space-y-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card className="p-6 dark:bg-gray-800">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                <img
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : formData.image ||
                        "/placeholder.svg?height=100&width=100"
                  }
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Photo
                </Button>
              </div>

              <div className="space-y-4">
                {formData.userType === "consumer" ? (
                  <>
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                    <Label>NIC</Label>
                    <Input
                      value={formData.NIC}
                      disabled
                      className="cursor-not-allowed opacity-50"
                    />
                  </>
                ) : (
                  <>
                    <Label>Company Name</Label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                    />
                    <Label>Business Category</Label>
                    <Input
                      value={formData.businessCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessCategory: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />

                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleSubmit}
                >
                  Update Profile
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="p-6 dark:bg-gray-800">
            <h3 className="text-lg font-medium">Password Update</h3>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
            <Label>New Password</Label>
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
            <Button
              className="w-full bg-black text-white"
              onClick={handlePasswordUpdate}
            >
              Update Password
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="p-6 dark:bg-gray-800">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Dark Mode</Label>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                    <SelectItem value="si">Sinhala</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
