"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptDialog } from "@/components/receipt-dialog" // Import the ReceiptDialog component

const bookings = [
  {
    id: "1",
    title: "Plumbing Repair",
    provider: "John Doe Plumbing",
    date: "2024-07-20",
    status: "Confirmed",
  },
  {
    id: "2",
    title: "Electrical Inspection",
    provider: "Jane Smith Electric",
    date: "2024-07-25",
    status: "Pending",
  },
  {
    id: "3",
    title: "Landscaping",
    provider: "Green Thumb Landscaping",
    date: "2024-08-01",
    status: "Completed",
  },
]

export default function BookingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">My Bookings</h1>
       
    
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle>{booking.title}</CardTitle>
              <CardDescription>
                {booking.provider} - {booking.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Status: {booking.status}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              {/* Replace the View Receipt button with the ReceiptDialog component */}
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  alert("Receipt viewed")
                }}
              >
                View Receipt
              </Button> */}
              {/* Change to: */}
              <ReceiptDialog
                bookingId={booking.id}
                serviceTitle={booking.title}
                provider={booking.provider}
                date={booking.date}
                price="$150"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

