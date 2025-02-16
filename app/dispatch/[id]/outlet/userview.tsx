import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function OutletDetailsView({ outlet }) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Outlet Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Profile Section */}
        <div className="flex items-center space-x-6 border-b pb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={outlet.image || '/placeholder.svg'} alt={outlet.outletName || "Outlet"} />
            <AvatarFallback>{outlet.outletName?.charAt(0) || 'O'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{outlet.outletName}</h2>
            <p className="text-gray-500">Outlet</p>
          </div>
        </div>

        {/* General Information in Row Format */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{outlet.emailAddress}</p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium">{outlet.outletAddress}</p>
          </div>
          <div>
            <p className="text-gray-500">Registration Number</p>
            <p className="font-medium">{outlet.registrationNumber}</p>
          </div>
          {outlet.certificate && (
            <div className="col-span-2">
              <p className="text-gray-500">Certificate</p>
              <a href={outlet.certificate} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Certificate
              </a>
            </div>
          )}
        </div>
        
      </CardContent>
    </Card>
  );
}