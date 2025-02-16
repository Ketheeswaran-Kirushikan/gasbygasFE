import { Card, CardContent, CardHeader, CardTitle } from "@/components/outlet/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/outlet/ui/table";

export function IncomingRequests({ gasRequests }) {
  // Get the last 5 gas requests (sorted by createdAt)
  const latestRequests = gasRequests
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {latestRequests?.length > 0 ? (
              latestRequests?.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.referenceNumber}</TableCell>
                  <TableCell>{request.gasType}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "approved"
                          ? "bg-blue-100 text-blue-800"
                          : request.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No recent requests available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
