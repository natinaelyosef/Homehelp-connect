"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon, Wrench, Calendar, MessageSquare, Settings, LogOut, DollarSign, Users, Star, ChevronDown, Bell, Search } from "lucide-react"
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
import { useState, useEffect } from "react"
import { Service, getServicesByProvider, createService } from "@/lib/api"
import api from '@/lib/api'
import { useRouter } from "next/navigation"

export default function ProviderDashboard() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userStatus, setUserStatus] = useState({
    isVerified: false,
    needsDocuments: false
  })
  const [idFile, setIdFile] = useState<File | null>(null)
  const [certFile, setCertFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<{ 
    text: string; 
    type: 'success' | 'error' 
  } | null>(null)
  const [activeTab, setActiveTab] = useState("services")
  const router = useRouter()
  
  useEffect(() => {
    const checkDocuments = async () => {
      try {
        const response = await api.get("/provider/check-documents")
        if (!response.data.documents_verified) {
          router.push("/upload-documents")
        }
      } catch (error) {
        console.error("Error checking documents:", error)
      }
    }

    checkDocuments()
  }, [router])

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await api.get('/provider/status');
        setUserStatus({
          isVerified: response.data.is_verified,
          needsDocuments: response.data.needs_documents
        });
        if (response.data.is_verified && !response.data.needs_documents) {
          fetchProviderServices(); // Changed from fetchServices to fetchProviderServices
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    }
    checkUserStatus();
  }, []);

  const fetchProviderServices = async () => {
    setLoading(true);
    try {
      const data = await getServicesByProvider();
      const servicesWithDefaults = data.map(service => ({
        ...service,
        rating: service.rating ?? 0,
        image: service.image || '/placeholder-service.jpg',
        provider_name: service.provider_name || "Your Service",
        price: service.price ? Number(service.price) : 0
      }));
      setServices(servicesWithDefaults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const handleUploadDocuments = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idFile || !certFile) {
      setUploadMessage({ text: 'Please upload both documents', type: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('id_verification', idFile)
      formData.append('certification', certFile)

      const response = await fetch('/api/provider/upload-documents', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      setUploadMessage({ 
        text: 'Documents uploaded successfully! Please wait for admin approval.', 
        type: 'success' 
      })
      setUserStatus(prev => ({ ...prev, needsDocuments: false }))
    } catch (error) {
      setUploadMessage({ 
        text: error instanceof Error ? error.message : 'Failed to upload documents', 
        type: 'error' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddService = async (newService: { 
    title: string
    description: string
    price: string
    image?: string
    rating?: number
    provider_name?: string
  }) => {
    try {
      const priceNumber = Number(newService.price.replace(/[^0-9.]/g, ''));
      if (isNaN(priceNumber)) throw new Error("Please enter a valid price");
  
      const createdService = await createService({
        title: newService.title,
        description: newService.description,
        price: priceNumber,
        image: newService.image || "",
      });
      
      // Refresh the provider's services after adding a new one
      fetchProviderServices();
    } catch (err) {
      console.error("Failed to add service:", err);
      throw err;
    }
  }

  if (userStatus.needsDocuments) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar className="bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-lg">
            <SidebarHeader className="border-b border-indigo-700">
              <div className="flex items-center gap-2 px-4 py-4">
                <HomeIcon className="h-6 w-6 text-white" />
                <span className="text-lg font-bold">HomeHelp Pro</span>
              </div>
            </SidebarHeader>
          </Sidebar>
          
          <div className="flex-1 p-8 flex items-center justify-center">
            <Card className="max-w-md w-full shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Complete Your Registration</CardTitle>
                <CardDescription className="text-gray-600">
                  Upload required documents to start using your provider dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUploadDocuments} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Verification</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {idFile ? (
                              <p className="text-sm text-gray-500">{idFile.name}</p>
                            ) : (
                              <>
                                <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <p className="text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5MB)</p>
                              </>
                            )}
                          </div>
                          <input 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                            className="hidden" 
                            required
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Professional Certification</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {certFile ? (
                              <p className="text-sm text-gray-500">{certFile.name}</p>
                            ) : (
                              <>
                                <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <p className="text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5MB)</p>
                              </>
                            )}
                          </div>
                          <input 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                            className="hidden" 
                            required
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {uploadMessage && (
                    <div className={`rounded-md p-3 ${
                      uploadMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                      <p className="text-sm">{uploadMessage.text}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : 'Submit Documents'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarProvider>
    )
  }

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
                <span className="text-lg font-bold">HomeHelp Pro</span>
              </Link>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/provider" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <HomeIcon className="h-4 w-4" />
                    </div>
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/provider/services" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <span>My Services</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/provider/bookings" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span>Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/provider/messages" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
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
                  <Link href="/dashboard/provider/settings" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
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
                    <AvatarFallback className="bg-indigo-600">MP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium truncate">Homehelp.connect</p>
                    <p className="text-xs text-white/70 truncate">homehelp.connect@gmail.com</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/provider/settings" className="cursor-pointer">
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
              <input
                type="text"
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
                      <AvatarFallback className="bg-indigo-600 text-white">MP</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">Provider</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/provider/settings" className="cursor-pointer">
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
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, Provider!</h1>
              <p className="text-gray-600">Here's what's happening with your business today</p>
            </div>
            
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,234</div>
                  <p className="text-xs text-green-500 mt-1">+$256 from last month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Completed Jobs</CardTitle>
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <Wrench className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-green-500 mt-1">+5 from last month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Upcoming Jobs</CardTitle>
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-green-500 mt-1">+2 new bookings</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Clients</CardTitle>
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Users className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-green-500 mt-1">+3 new clients</p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="services" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4 gap-1 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger 
                    value="upcoming" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                    onClick={() => setActiveTab("pending")}
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                    onClick={() => setActiveTab("completed")}
                  >
                    Completed
                  </TabsTrigger>
                  <TabsTrigger 
                    value="services" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                    onClick={() => setActiveTab("services")}
                  >
                    My Services
                  </TabsTrigger>
                </TabsList>
                
                <AddServiceDialog onAddServiceAction={handleAddService} />

              </div>

              <TabsContent value="services" className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-red-600">Error loading services: {error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <div className="p-4 bg-indigo-100 rounded-full">
              <Wrench className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No services yet</h3>
            <p className="text-gray-500 max-w-md">
              You haven't added any services yet. Get started by adding your first service to attract customers.
            </p>
            <AddServiceDialog onAddServiceAction={handleAddService} />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48 w-full bg-gray-100 group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://placehold.co/600x400?text=Service+Image'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white">{service.title}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-white">
                        {(service.rating ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">Your Service</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ${Number(service.price).toFixed(2)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                    {service.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Added {new Date(service.created_at).toLocaleDateString()}</span>
                    <span>ID: {service.id}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between gap-2 p-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
              
              {/* Other tabs content would go here */}
              <TabsContent value="upcoming">
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-medium text-lg mb-4">Upcoming Jobs</h3>
                  <p className="text-gray-500">No upcoming jobs scheduled</p>
                </div>
              </TabsContent>
              
              <TabsContent value="pending">
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-medium text-lg mb-4">Pending Requests</h3>
                  <p className="text-gray-500">No pending requests</p>
                </div>
              </TabsContent>
              
              <TabsContent value="completed">
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-medium text-lg mb-4">Completed Jobs</h3>
                  <p className="text-gray-500">No completed jobs yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
