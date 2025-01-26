import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslatedText } from "@/components/consumer/ui/translated-text";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotificationsByUserIdThunk,
  updateNotificationThunk,
} from "@/app/Redux/features/notificationSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import PaymentModal from "./paynow";
import { useParams } from "next/navigation";

export function Notifications() {
  const dispatch = useDispatch();
  const { notifications = [] } = useSelector(
    (state: any) => state.notifications
  );
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [price, setPrice] = useState(0);
  const { id } = useParams();

  // Fetch notifications on load
  useEffect(() => {
    dispatch(fetchNotificationsByUserIdThunk(id));
  }, [dispatch, id]);

  // Display toast for unread notifications
  useEffect(() => {
    notifications
      .filter((notification: any) => !notification.isRead)
      .forEach((notification: any) => {
        if (!notification.toastShown) {
          toast.info(
            <div className="flex flex-col gap-1">
              <TranslatedText text={notification.message} />
              <span className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          );
        }
      });
  }, [notifications]);

  // Count unread notifications
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  // Handle notification click
  const handleNotificationClick = async (notification: any) => {
    setSelectedNotification(notification);
    setIsNotificationModalOpen(true);

    // Extract referenceNumber and price from the message if available
    const referenceMatch = notification.message.match(/Reference:\s(REF\d+)/);
    const priceMatch = notification.message.match(/amount\s(\d+)/);

    if (referenceMatch) setReferenceNumber(referenceMatch[1]);
    if (priceMatch) setPrice(parseFloat(priceMatch[1]));

    // Mark notification as read if not already
    if (!notification.isRead) {
      const updateData = { id: notification._id, isRead: true };
      try {
        await dispatch(updateNotificationThunk(updateData)).unwrap();
      } catch (error) {
        console.error("Error updating notification:", error);
      }
    }
  };

  const handleNotificationModalOpenChange = (open: boolean) => {
    if (!open) {
      setIsNotificationModalOpen(false);
    }
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setIsNotificationModalOpen(false);
  };

  const filteredNotifications = notifications
  .filter((notification: any) => {
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "read") return notification.isRead;
    return true;
  })
  .slice(0, 6); // Show only the last 6 notifications


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">
                <TranslatedText text="ALL" />
              </TabsTrigger>
              <TabsTrigger value="unread">
                <TranslatedText text="Unread" />
              </TabsTrigger>
              <TabsTrigger value="read">
                <TranslatedText text="Read" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-2">
              {filteredNotifications.length === 0 ? (
                <DropdownMenuItem disabled>
                  <TranslatedText text="No notifications" />
                </DropdownMenuItem>
              ) : (
                filteredNotifications.map((notification: any) => (
                  <DropdownMenuItem
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`cursor-pointer ${
                      notification.isRead ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      <TranslatedText
                        text={notification.message.substring(0, 50) + "..."}
                      />
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </TabsContent>
          </Tabs>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notification Modal */}
      <Dialog
        open={isNotificationModalOpen}
        onOpenChange={handleNotificationModalOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedNotification ? (
              <>
                <p>
                  <strong>Message:</strong> {selectedNotification.message}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </p>
                {selectedNotification.message.includes("pay your amount") && (
                  <Button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="bg-green-600 text-white"
                  >
                    Pay Now
                  </Button>
                )}
              </>
            ) : (
              <p>No notification selected</p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsNotificationModalOpen(false)}
              className="bg-blue-600 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <PaymentModal
        open={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        referenceNumber={referenceNumber}
        price={price}
      />
    </>
  );
}
