"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon, Wrench, Calendar, MessageSquare, Settings, LogOut, DollarSign, Users, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NotificationsPanel } from "@/components/notifications-panel"
import { AddServiceDialog } from "@/components/add-service-dialog"
import { ServiceDetailsDialog } from "@/components/service-details-dialog"
import { ReceiptDialog } from "@/components/receipt-dialog"

export default function ProviderDashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-4 py-2">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <HomeIcon className="h-6 w-6 text-homehelp-600" />
                <span className="text-lg font-bold">HomeHelp</span>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/provider">
                    <HomeIcon className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/provider/services">
                    <Wrench className="h-4 w-4" />
                    <span>My Services</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/provider/bookings">
                    <Calendar className="h-4 w-4" />
                    <span>Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/provider/messages">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/provider/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>MP</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Mike's Plumbing</p>
                  <p className="text-xs text-muted-foreground">mike@example.com</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/provider/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Provider Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationsPanel />
            </div>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,234</div>
                  <p className="text-xs text-muted-foreground">+$256 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+5 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Jobs</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">+2 new bookings</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">+3 new clients</p>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="upcoming" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming Jobs</TabsTrigger>
                  <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                  <TabsTrigger value="completed">Completed Jobs</TabsTrigger>
                </TabsList>
                <AddServiceDialog />
              </div>
              <TabsContent value="upcoming" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      id: "1",
                      title: "Plumbing Repair",
                      client: "John Doe",
                      address: "123 Main St, Anytown",
                      date: "Tomorrow, 10:00 AM",
                      price: "$150",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      id: "2",
                      title: "Pipe Installation",
                      client: "Sarah Johnson",
                      address: "456 Oak Ave, Somewhere",
                      date: "Friday, 2:00 PM",
                      price: "$280",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      id: "3",
                      title: "Leak Detection",
                      client: "Michael Chen",
                      address: "789 Pine Rd, Elsewhere",
                      date: "Next Monday, 9:00 AM",
                      price: "$120",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                  ].map((booking, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle>{booking.title}</CardTitle>
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
                          <Link href="/dashboard/provider/messages">Message</Link>
                        </Button>
                        <ServiceDetailsDialog
                          service={{
                            id: booking.id,
                            title: booking.title,
                            provider: booking.client,
                            price: booking.price,
                            rating: 4.0,
                            image: booking.image,
                            description: `Service for ${booking.client} at ${booking.address}`,
                          }}
                        />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      id: "4",
                      title: "Bathroom Plumbing",
                      client: "Emily Rodriguez",
                      address: "321 Elm St, Anytown",
                      date: "Requesting for Saturday",
                      price: "$200",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      id: "5",
                      title: "Water Heater Repair",
                      client: "David Wilson",
                      address: "654 Maple Dr, Somewhere",
                      date: "Requesting for next week",
                      price: "$175",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                  ].map((booking, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle>{booking.title}</CardTitle>
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
                            alert("Booking declined")
                          }}
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            alert("Booking accepted")
                          }}
                        >
                          Accept
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      id: "6",
                      title: "Sink Repair",
                      client: "Jennifer Lee",
                      address: "987 Cedar Ln, Anytown",
                      date: "Last week",
                      price: "$95",
                      rating: 5,
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      id: "7",
                      title: "Toilet Installation",
                      client: "Robert Brown",
                      address: "654 Birch St, Somewhere",
                      date: "2 weeks ago",
                      price: "$320",
                      rating: 4,
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      id: "8",
                      title: "Shower Repair",
                      client: "Lisa Garcia",
                      address: "321 Walnut Ave, Elsewhere",
                      date: "Last month",
                      price: "$150",
                      rating: 5,
                      image: "/placeholder.svg?height=100&width=100",
                    },
                  ].map((booking, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle>{booking.title}</CardTitle>
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
                              <div className="mt-1 flex items-center">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`mr-1 h-3 w-3 ${i < booking.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                    />
                                  ))}
                                <span className="ml-1 text-xs text-muted-foreground">{booking.rating}.0</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <ReceiptDialog
                          bookingId={booking.id}
                          serviceTitle={booking.title}
                          provider={booking.client}
                          date={booking.date}
                          price={booking.price}
                        />
                        <ServiceDetailsDialog
                          service={{
                            id: booking.id,
                            title: booking.title,
                            provider: booking.client,
                            price: booking.price,
                            rating: booking.rating,
                            image: booking.image,
                            description: `Completed service for ${booking.client} at ${booking.address}`,
                          }}
                        />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

