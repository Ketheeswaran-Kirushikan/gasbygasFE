import { User } from '@/Types/outlet/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserDetailsViewProps {
  user: User;
}

export function UserDetailsView({ user }: UserDetailsViewProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Profile Section */}
        <div className="flex items-center space-x-6 border-b pb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.image || '/placeholder.svg'} alt={user.firstName || user.companyName || "User"} />
            <AvatarFallback>{user.firstName?.charAt(0) || user.companyName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {user.userType === "consumer" ? `${user.firstName} ${user.lastName}` : user.companyName}
            </h2>
            <p className="text-gray-500 capitalize">{user.userType}</p>
          </div>
        </div>

        {/* General Information in Row Format */}
        <div className="grid grid-cols gap-6 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{user.phoneNumber}</p>
          </div>

          {/* Consumer-Specific Fields */}
          {user.userType === "consumer" && (
            <>
              <div>
                <p className="text-gray-500">First Name</p>
                <p className="font-medium">{user.firstName || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Name</p>
                <p className="font-medium">{user.lastName || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">NIC</p>
                <p className="font-medium">{user.NIC || "N/A"}</p>
              </div>
            </>
          )}

          {/* Business-Specific Fields */}
          {user.userType === "businessIndustry" && (
            <>
              <div>
                <p className="text-gray-500">Business Name</p>
                <p className="font-medium">{user.companyName || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Registration No.</p>
                <p className="font-medium">{user.registrationNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Business Category</p>
                <p className="font-medium">{user.businessCategory || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Contact Person</p>
                <p className="font-medium">{user.contactPersonName || "N/A"}</p>
              </div>
              {user.certificationUrl && (
                <div className="col-span-2">
                  <p className="text-gray-500">Certification</p>
                  <a href={user.certificationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Certification
                  </a>
                </div>
              )}
            </>
          )}
        </div>
        
      </CardContent>
    </Card>
  );
}
