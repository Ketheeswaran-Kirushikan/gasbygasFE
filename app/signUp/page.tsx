"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUserThunk } from "@/app/Redux/features/userSlice";
import { toast } from "react-toastify";

export function SignupModal({
  isOpen,
  onClose,
  onLoginOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoginOpen: () => void;
}) {
  const dispatch = useDispatch();

  const initialConsumerForm = {
    firstName: "",
    lastName: "",
    NIC: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const initialBusinessForm = {
    companyName: "",
    registrationNumber: "",
    businessCategory: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [tab, setTab] = useState("consumer"); // Tab for user type
  const [consumerForm, setConsumerForm] = useState(initialConsumerForm);
  const [businessForm, setBusinessForm] = useState(initialBusinessForm);

  const handleConsumerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConsumerForm({ ...consumerForm, [name]: value });
  };

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessForm({ ...businessForm, [name]: value });
  };

  const handleSignup = async () => {
    let userData = {};

    if (tab === "consumer") {
      if (consumerForm.password !== consumerForm.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      userData = {
        userType: "consumer",
        firstName: consumerForm.firstName,
        lastName: consumerForm.lastName,
        NIC: consumerForm.NIC,
        phoneNumber: consumerForm.phoneNumber,
        email: consumerForm.email,
        password: consumerForm.password,
      };
    } else if (tab === "businessIndustry") {
      if (businessForm.password !== businessForm.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      userData = {
        userType: "businessIndustry",
        companyName: businessForm.companyName,
        registrationNumber: businessForm.registrationNumber,
        businessCategory: businessForm.businessCategory,
        phoneNumber: businessForm.phoneNumber,
        email: businessForm.email,
        password: businessForm.password,
      };
    }

    try {
      await dispatch(createUserThunk({ userData })).unwrap();

      // Reset forms and close modal
      setConsumerForm(initialConsumerForm);
      setBusinessForm(initialBusinessForm);
      onClose();
    } catch (error) {
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      backdrop="opaque"
      classNames={{
        body: "py-6 px-4",
        backdrop: "bg-black/60 backdrop-opacity-50",
        base: "border-[#3E3636] bg-[#3E3636] text-[#F5EDED] rounded-lg max-w-sm w-[90%]",
        header: "border-b-[1px] border-[#3E3636]",
        footer: "border-t-[1px] border-[#3E3636]",
        closeButton: "hidden",
      }}
      radius="lg"
      placement="center"
      onOpenChange={(open) => !open && onClose()}
    >
      <ModalContent>
        {(onCloseInternal) => (
          <>
            {/* Modal Header */}
            <ModalHeader className="flex justify-center pb-2 relative">
              <span className="font-semibold">Signup</span>
              <button
                className="absolute top-2 right-2 text-[#F5EDED] text-xl hover:text-[#D72323]"
                onClick={onCloseInternal}
                aria-label="Close"
              >
                &times;
              </button>
            </ModalHeader>

            {/* Modal Body */}
            <ModalBody>
              {/* Tab Selection */}
              <div className="flex justify-between mb-4 border-b border-[#3E3636]">
                <button
                  className={`flex-1 text-center py-2 ${
                    tab === "consumer" ? "text-[#D72323] border-b-2 border-[#D72323]" : "text-[#F5EDED]"
                  }`}
                  onClick={() => setTab("consumer")}
                >
                  Consumer
                </button>
                <button
                  className={`flex-1 text-center py-2 ${
                    tab === "businessIndustry"
                      ? "text-[#D72323] border-b-2 border-[#D72323]"
                      : "text-[#F5EDED]"
                  }`}
                  onClick={() => setTab("businessIndustry")}
                >
                  Business
                </button>
              </div>

              {/* Consumer Signup Form */}
              {tab === "consumer" && (
                <form className="space-y-4">
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    value={consumerForm.firstName}
                    onChange={handleConsumerChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={consumerForm.lastName}
                    onChange={handleConsumerChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="NIC"
                    placeholder="NIC"
                    value={consumerForm.NIC}
                    onChange={handleConsumerChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={consumerForm.phoneNumber}
                    onChange={handleConsumerChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={consumerForm.email}
                    onChange={handleConsumerChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={consumerForm.password}
                    onChange={handleConsumerChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={consumerForm.confirmPassword}
                    onChange={handleConsumerChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                </form>
              )}

              {/* Business Signup Form */}
              {tab === "businessIndustry" && (
                <form className="space-y-4">
                  <Input
                    name="companyName"
                    placeholder="Company Name"
                    value={businessForm.companyName}
                    onChange={handleBusinessChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="registrationNumber"
                    placeholder="Registration Number"
                    value={businessForm.registrationNumber}
                    onChange={handleBusinessChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="businessCategory"
                    placeholder="Business Category"
                    value={businessForm.businessCategory}
                    onChange={handleBusinessChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={businessForm.phoneNumber}
                    onChange={handleBusinessChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Company Email"
                    value={businessForm.email}
                    onChange={handleBusinessChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={businessForm.password}
                    onChange={handleBusinessChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={businessForm.confirmPassword}
                    onChange={handleBusinessChange}
                    className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                  />
                </form>
              )}
              <div className="text-sm mt-4 text-gray-300 text-center">
                Already have an account?{" "}
                <span
                  className="text-[#D72323] cursor-pointer hover:underline"
                  onClick={() => {
                    onCloseInternal();
                    onLoginOpen();
                  }}
                >
                  Login
                </span>
              </div>
            </ModalBody>

            {/* Modal Footer */}
            <ModalFooter className="flex justify-center p-4">
              <Button
                className="w-full bg-[#D72323] hover:bg-[#D72323]/90 text-[#F5EDED] py-2 rounded-md"
                onPress={handleSignup}
              >
                Signup
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
