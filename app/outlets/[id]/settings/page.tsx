'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from '@/components/outlet/settings/general-settings';
import { SecuritySettings } from '@/components/outlet/settings/security-settings';
import { NotificationSettings } from '@/components/outlet/settings/notification-settings';
import { ProfileSettings } from '@/components/outlet/settings/profile-settings';
import { getOutletByIdThunk } from '@/app/Redux/features/outletSlice';
import { RootState, AppDispatch } from '@/app/Redux/store/store';

export default function SettingsPage() {
  const dispatch: AppDispatch = useDispatch();
  const { id: outletId } = useParams(); // ✅ Get outlet ID from URL params

  // ✅ Fetch outlet data from Redux
  const { outlet, loading } = useSelector((state: RootState) => state.outlets);

  useEffect(() => {
    if (outletId) {
      dispatch(getOutletByIdThunk(outletId)); // ✅ Fetch outlet data
    }
  }, [dispatch, outletId]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {loading ? (
        <p className="text-gray-500">Loading outlet data...</p>
      ) : (
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings outlet={outlet} />
          </TabsContent>
          <TabsContent value="security">
            <SecuritySettings outlet={outlet} />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationSettings outlet={outlet} />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileSettings outlet={outlet} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
