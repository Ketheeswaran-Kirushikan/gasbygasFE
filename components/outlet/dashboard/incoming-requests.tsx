import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const requests = [
  { id: 'ABC1025', type: 'Domestic', quantity: 2, status: 'Pending' },
  { id: 'ABC1026', type: 'Industrial', quantity: 5, status: 'Confirmed' },
  { id: 'ABC1027', type: 'Commercial', quantity: 3, status: 'Pending' },
  { id: 'ABC1028', type: 'Domestic', quantity: 1, status: 'Confirmed' },
]

export function IncomingRequests() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {request.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

