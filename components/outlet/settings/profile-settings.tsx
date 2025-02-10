'use client'

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import { updateOutletThunk, getOutletByIdThunk } from '@/app/Redux/features/outletSlice'
import { RootState } from '@/app/Redux/store/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ProfileSettings() {
  const dispatch = useDispatch();
  const { id: outletId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);

  const { outlet, loading } = useSelector((state: RootState) => state.outlets);

  const [profile, setProfile] = useState({
    outletName: '',
    outletAddress: '',
    registrationNumber: '',
    emailAddress: '',
    image: '',
    certificate: '',
  });

  useEffect(() => {
    if (outletId) {
      dispatch(getOutletByIdThunk(outletId));
    }
  }, [outletId, dispatch]);

  useEffect(() => {
    if (outlet) {
      setProfile({
        outletName: outlet?.outletName || '',
        outletAddress: outlet?.outletAddress || '',
        registrationNumber: outlet?.registrationNumber || '',
        emailAddress: outlet?.emailAddress || '',
        image: outlet?.image || '',
        certificate: outlet?.certificate || '',
      });
    }
  }, [outlet]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!outletId) {
      toast.error('Invalid outlet ID');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('outletName', profile.outletName);
      formData.append('outletAddress', profile.outletAddress);
      formData.append('registrationNumber', profile.registrationNumber);
      formData.append('emailAddress', profile.emailAddress);
      if (profile.image instanceof File) {
        formData.append('image', profile.image);
      }
      if (profile.certificate instanceof File) {
        formData.append('certificate', profile.certificate);
      }

      await dispatch(updateOutletThunk({ id: outletId, formData })).unwrap();

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'certificate') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfile((prev) => ({
      ...prev,
      [field]: file, // Store file as a File object
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="outletName">Outlet Name</Label>
              <Input
                id="outletName"
                value={profile.outletName}
                onChange={(e) => setProfile({ ...profile, outletName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outletAddress">Outlet Address</Label>
              <Input
                id="outletAddress"
                value={profile.outletAddress}
                onChange={(e) => setProfile({ ...profile, outletAddress: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={profile.registrationNumber}
                disabled
                className="cursor-not-allowed opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                value={profile.emailAddress}
                onChange={(e) => setProfile({ ...profile, emailAddress: e.target.value })}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Outlet Image</Label>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'image')}
              />
              <div className="flex items-center gap-4">
                <img
                  src={profile.image instanceof File ? URL.createObjectURL(profile.image) : profile.image || '/placeholder.svg'}
                  alt="Outlet"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Upload Image
                </Button>
              </div>
            </div>

            {/* Certificate Upload */}
            <div className="space-y-2">
              <Label>Outlet Certificate</Label>
              <input
                type="file"
                ref={certificateInputRef}
                className="hidden"
                accept="application/pdf"
                onChange={(e) => handleImageUpload(e, 'certificate')}
              />
              <div className="flex items-center gap-4">
                <span>{profile.certificate instanceof File ? profile.certificate.name : profile.certificate || 'No file uploaded'}</span>
                <Button type="button" variant="outline" onClick={() => certificateInputRef.current?.click()}>
                  Upload Certificate
                </Button>
              </div>
            </div>

            <Button type="submit">Update Profile</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
