import { User, UserRole, BusinessCategory } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserDetailsViewProps {
  user: User
}

export function UserDetailsView({ user }: UserDetailsViewProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.profileUrl || '/placeholder.svg'} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>
        </div>

        {user.role === UserRole.CONSUMER && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="font-medium">{(user as any).firstName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="font-medium">{(user as any).lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">NIC</p>
              <p className="font-medium">{(user as any).nic}</p>
            </div>
          </div>
        )}

        {user.role === UserRole.BUSINESS && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Business Name</p>
              <p className="font-medium">{(user as any).businessName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Registration Number</p>
              <p className="font-medium">{(user as any).registrationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Business Category</p>
              <p className="font-medium">{(user as any).businessCategory}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Person</p>
              <p className="font-medium">{(user as any).contactPersonName}</p>
            </div>
            {(user as any).certificationUrl && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Certification</p>
                <a href={(user as any).certificationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Certification
                </a>
              </div>
            )}
          </div>
        )}

        {(user.role === UserRole.DISPATCH_MANAGER || user.role === UserRole.SENIOR_DISPATCHER || user.role === UserRole.DISPATCHER) && (
          <div>
            <p className="text-sm text-gray-500">Staff Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

