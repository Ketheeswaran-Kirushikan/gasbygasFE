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
import { useDispatch } from "react-redux";
import { useState } from "react";
import { login } from "@/app/Redux/features/authSlice"; // Import your login thunk
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation

export function LoginModal({
  isOpen,
  onClose,
  onSignupOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSignupOpen: () => void;
}) {
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize Next.js router for navigation
  const [emailOrAdminName, setEmailOrAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleLogin = async () => {
    setIsLoading(true); // Start loading
    try {
      const result = await dispatch(
        login({ emailOrAdminName, password })
      ).unwrap();

      // Extract userType and userId from the result
      const { userType, id } = result.user;

      // Navigate based on userType
      if (userType === "dispatch") {
        router.push("/dispatch");
      } else if (userType === "outlet") {
        router.push(`/outlet/${id}`); // Navigate to dynamic outlet page
      } else if (userType === "consumer") {
        router.push(`/consumers/${id}`); // Navigate to dynamic consumer page
      } else if (userType === "businessIndustry") {
        router.push(`/businessIndustry/${id}`); // Navigate to dynamic business page
      } else {
        toast.error("Invalid user type. Please contact support.");
      }

      // Reset form fields and close modal
      setEmailOrAdminName("");
      setPassword("");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false); // End loading
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
            <ModalHeader className="flex justify-center pb-2 relative">
              <span className="font-semibold">Login</span>
              <button
                className="absolute top-2 right-2 text-[#F5EDED] text-xl hover:text-[#D72323]"
                onClick={onCloseInternal}
                aria-label="Close"
              >
                &times;
              </button>
            </ModalHeader>
            <ModalBody>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <Input
                  placeholder="Email or Admin Name"
                  value={emailOrAdminName}
                  onChange={(e) => setEmailOrAdminName(e.target.value)}
                  className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#F5EDED] text-black placeholder-gray-500 rounded-md"
                />
              </form>
              <div className="text-sm mt-2 text-gray-300 text-center">
                Don’t have an account?{" "}
                <span
                  className="text-[#D72323] cursor-pointer hover:underline"
                  onClick={() => {
                    onCloseInternal();
                    onSignupOpen();
                  }}
                >
                  Register
                </span>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center p-4">
              <Button
                className="w-full bg-[#D72323] hover:bg-[#D72323]/90 text-[#F5EDED] py-2 rounded-md"
                onClick={handleLogin}
                isDisabled={isLoading} // Disable button while loading
              >
                {isLoading ? "Logging In..." : "Login"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
