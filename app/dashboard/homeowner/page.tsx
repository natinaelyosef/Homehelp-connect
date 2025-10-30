"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon, Search, Star, Calendar, MessageSquare, Settings, LogOut, ChevronDown, Bell, Wrench } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { RatingDialog } from "@/components/rating-dialog"
import { BookingDialog } from "@/components/booking-dialog"
import { ServiceDetailsDialog } from "@/components/service-details-dialog"
import { useState, useEffect } from "react"
import { getServices } from "@/lib/api"

export default function HomeownerDashboard() {
  interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    created_at?: string;
    provider_id?: number;
    image?: string;
    provider_name?: string;
    rating?: number;
  }

  const [recommendedServices, setRecommendedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setRecommendedServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-xl">
          <SidebarHeader className="border-b border-indigo-700 px-4">
            <div className="flex items-center gap-2 py-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="p-2 bg-white rounded-lg">
                  <HomeIcon className="h-5 w-5 text-indigo-700" />
                </div>
                <span className="text-lg font-bold">HomeHelp</span>
              </Link>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/homeowner" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <HomeIcon className="h-4 w-4" />
                    </div>
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/homeowner/services" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Search className="h-4 w-4" />
                    </div>
                    <span>Find Services</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/homeowner/bookings" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span>My Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/homeowner/messages" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <span>Messages</span>
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/homeowner/settings" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Settings className="h-4 w-4" />
                    </div>
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-indigo-700 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Avatar className="h-9 w-9 border-2 border-white">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-indigo-600">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium truncate">HomeHelp Connect</p>
                    <p className="text-xs text-white/70 truncate">homehelp.connect@gmail.com</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/homeowner/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login" className="cursor-pointer text-red-600 hover:text-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
            <SidebarTrigger className="text-gray-700 hover:text-indigo-600" />
            
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search services, bookings..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback className="bg-indigo-600 text-white">JD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">Homeowner</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/homeowner/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer text-red-600 hover:text-red-700">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, Homeowner!</h1>
              <p className="text-gray-600">Here's what's happening with your home services</p>
            </div>
            
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-green-500 mt-1">+2 from last month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Bookings</CardTitle>
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <Wrench className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-green-500 mt-1">+1 from last month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Reviews Given</CardTitle>
                  <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                    <Star className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-green-500 mt-1">+3 from last month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Messages</CardTitle>
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-green-500 mt-1">+2 new unread</p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="upcoming" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger 
                    value="upcoming" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger 
                    value="past" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                    onClick={() => setActiveTab("past")}
                  >
                    Past
                  </TabsTrigger>
                  <TabsTrigger 
                    value="recommended" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                    onClick={() => setActiveTab("recommended")}
                  >
                    Recommended
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="upcoming" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      id: "1",
                      title: "Plumbing Repair",
                      provider: "Mike's Plumbing",
                      date: "Tomorrow, 10:00 AM",
                      status: "Confirmed",
                      image: "/placeholder-service.jpg",
                      price: "$120",
                      rating: 4.0
                    },
                    {
                      id: "2",
                      title: "House Cleaning",
                      provider: "CleanPro Services",
                      date: "Friday, 2:00 PM",
                      status: "Pending",
                      image: "/placeholder-service.jpg",
                      price: "$90",
                      rating: 4.5
                    },
                    {
                      id: "3",
                      title: "Electrical Inspection",
                      provider: "Volt Experts",
                      date: "Next Monday, 9:00 AM",
                      status: "Confirmed",
                      image: "/placeholder-service.jpg",
                      price: "$150",
                      rating: 4.8
                    },
                  ].map((booking) => (
                    <Card key={booking.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative h-40 w-full bg-gray-100 group">
                        <img
                          src={booking.image}
                          alt={booking.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold text-white">{booking.title}</h3>
                          <p className="text-sm text-white/90">{booking.provider}</p>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <Badge variant={booking.status === "Confirmed" ? "default" : "outline"}>
                            {booking.status}
                          </Badge>
                          <span className="text-sm font-medium text-gray-500">{booking.date}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{booking.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">{booking.price}</span>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between gap-2 p-4 border-t">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href="/dashboard/homeowner/messages">Message</Link>
                        </Button>
                        <ServiceDetailsDialog
                          service={{
                            id: booking.id,
                            title: booking.title,
                            provider_name: booking.provider,
                            price: booking.price,
                            rating: booking.rating,
                            image: booking.image,
                          }}
                        />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="past" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      id: "4",
                      title: "Lawn Mowing",
                      provider: "Green Thumb Landscaping",
                      date: "Last week",
                      status: "Completed",
                      image: "/placeholder-service.jpg",
                      price: "$75",
                      rating: 5.0
                    },
                    {
                      id: "5",
                      title: "AC Repair",
                      provider: "Cool Air Services",
                      date: "2 weeks ago",
                      status: "Completed",
                      image: "/placeholder-service.jpg",
                      price: "$200",
                      rating: 4.7
                    },
                    {
                      id: "6",
                      title: "Painting Service",
                      provider: "Perfect Painters",
                      date: "Last month",
                      status: "Completed",
                      image: "/placeholder-service.jpg",
                      price: "$450",
                      rating: 4.9
                    },
                  ].map((booking) => (
                    <Card key={booking.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative h-40 w-full bg-gray-100">
                        <img
                          src={booking.image}
                          alt={booking.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold text-white">{booking.title}</h3>
                          <p className="text-sm text-white/90">{booking.provider}</p>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <Badge variant="secondary">{booking.status}</Badge>
                          <span className="text-sm font-medium text-gray-500">{booking.date}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{booking.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">{booking.price}</span>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between gap-2 p-4 border-t">
                        <Button variant="outline" size="sm" className="flex-1">
                          Book Again
                        </Button>
                        <RatingDialog bookingId={booking.id} serviceTitle={booking.title} />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recommended" className="space-y-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : error ? (
                  <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-red-600">Error loading services: {error}</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {recommendedServices.map((service) => (
                      <Card key={service.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                        <div className="relative h-40 w-full bg-gray-100 group">
                          <img
                            src={service.image || "/placeholder-service.jpg"}
                            alt={service.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-lg font-bold text-white">{service.title}</h3>
                            <p className="text-sm text-white/90">{service.provider_name || "Professional Service"}</p>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                            {service.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {(service.rating ?? 0).toFixed(1)}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-indigo-600">
                              ${service.price.toFixed(2)}
                            </span>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between gap-2 p-4 border-t">
                          <ServiceDetailsDialog service={{ 
                            ...service, 
                            id: service.id.toString(), 
                            price: service.price.toString(), 
                            image: service.image || "/placeholder-service.jpg", 
                            rating: service.rating ?? 0,
                            provider_name: service.provider_name || "Professional Service"
                          }} />
                          {/* <BookingDialog 
                            serviceId={service.id.toString()} 
                            serviceTitle={service.title}
                            onBookingSuccessAction={() => {
                              // Refresh bookings or show success message
                              alert("Booking created successfully!");
                            }}
                          /> */}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
