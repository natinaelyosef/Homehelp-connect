"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function ProviderBookingsPage() {
  const { toast } = useToast()

  // Mock bookings data
  const upcomingBookings = [
    {
      id: "1",
      title: "Plumbing Repair",
      client: "John Doe",
      address: "123 Main St, Anytown",
      date: "Tomorrow, 10:00 AM",
      price: "$150",
      status: "Confirmed",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      title: "Pipe Installation",
      client: "Sarah Johnson",
      address: "456 Oak Ave, Somewhere",
      date: "Friday, 2:00 PM",
      price: "$280",
      status: "Confirmed",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      title: "Leak Detection",
      client: "Michael Chen",
      address: "789 Pine Rd, Elsewhere",
      date: "Next Monday, 9:00 AM",
      price: "$120",
      status: "Confirmed",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const pendingBookings = [
    {
      id: "4",
      title: "Bathroom Plumbing",
      client: "Emily Rodriguez",
      address: "321 Elm St, Anytown",
      date: "Requesting for Saturday",
      price: "$200",
      status: "Pending",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "5",
      title: "Water Heater Repair",
      client: "David Wilson",
      address: "654 Maple Dr, Somewhere",
      date: "Requesting for next week",
      price: "$175",
      status: "Pending",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const completedBookings = [
    {
      id: "6",
      title: "Sink Repair",
      client: "Jennifer Lee",
      address: "987 Cedar Ln, Anytown",
      date: "Last week",
      price: "$95",
      status: "Completed",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "7",
      title: "Toilet Installation",
      client: "Robert Brown",
      address: "654 Birch St, Somewhere",
      date: "2 weeks ago",
      price: "$320",
      status: "Completed",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "8",
      title: "Shower Repair",
      client: "Lisa Garcia",
      address: "321 Walnut Ave, Elsewhere",
      date: "Last month",
      price: "$150",
      status: "Completed",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const handleAccept = (id: string) => {
    toast({
      title: "Booking accepted",
      description: "You have accepted the booking request.",
    })
  }

  const handleDecline = (id: string) => {
    toast({
      title: "Booking declined",
      description: "You have declined the booking request.",
    })
  }

  const handleComplete = (id: string) => {
    toast({
      title: "Booking completed",
      description: "You have marked this booking as completed.",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage your service bookings</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/provider">
            <HomeIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{booking.title}</CardTitle>
                    <Badge>{booking.status}</Badge>
                  </div>
                  <CardDescription>{booking.client}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.client}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="text-sm">{booking.address}</p>
                        <p className="text-sm font-medium">{booking.date}</p>
                        <p className="text-sm font-bold text-homehelp-600">{booking.price}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/provider/messages">Message Client</Link>
                  </Button>
                  <Button size="sm" onClick={() => handleComplete(booking.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Complete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pending" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{booking.title}</CardTitle>
                    <Badge variant="outline">{booking.status}</Badge>
                  </div>
                  <CardDescription>{booking.client}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.client}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="text-sm">{booking.address}</p>
                        <p className="text-sm font-medium">{booking.date}</p>
                        <p className="text-sm font-bold text-homehelp-600">{booking.price}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleDecline(booking.id)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                  <Button size="sm" onClick={() => handleAccept(booking.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{booking.title}</CardTitle>
                    <Badge variant="secondary">{booking.status}</Badge>
                  </div>
                  <CardDescription>{booking.client}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.client}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="text-sm">{booking.address}</p>
                        <p className="text-sm font-medium">{booking.date}</p>
                        <p className="text-sm font-bold text-homehelp-600">{booking.price}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Receipt viewed",
                        description: "The receipt has been opened in a new tab.",
                      })
                    }}
                  >
                    View Receipt
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/provider/messages">Contact Client</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

