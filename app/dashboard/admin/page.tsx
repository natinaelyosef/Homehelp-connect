"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon, Users, DollarSign, Settings, LogOut, Shield, Check, X, Loader2, RefreshCw, ChevronDown, Bell } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"
import { NotificationsPanel } from "@/components/notifications-panel"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import axios from "axios"

interface RegistrationRequest {
  id: number
  full_name: string
  email: string
  phone_number?: string
  years_experience?: number
  requested_at: string
  status: string
  id_verification?: string
  certification?: string
  address?: string
}

interface Provider {
  id: number
  full_name: string
  email: string
  phone_number?: string
  years_experience?: number
  is_verified: boolean
  created_at: string
}

interface Report {
  id: number
  title: string
  description: string
  created_at: string
  status: string
}

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('dashboard/admin/login')) {
      localStorage.removeItem("access_token")
      window.location.href = "dashboard/admin/login"
    }
    return Promise.reject(error)
  }
)

export default function AdminDashboard() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState({
    requests: true,
    providers: true,
    reports: true
  })
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@example.com"
  })
  const [authChecked, setAuthChecked] = useState(false)
  const [isManualRefresh, setIsManualRefresh] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [, updateActiveTab] = useState<string>("approvals");

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push("dashboard/admin/login")
        return
      }

      try {
        await api.get("/auth/validate")
        const adminRes = await api.get("/admins/me")
        setAdminData({
          name: adminRes.data.full_name,
          email: adminRes.data.email
        })
        setAuthChecked(true)
      } catch (error) {
        console.error("Auth verification failed:", error)
        localStorage.removeItem("access_token")
        router.push("dashboard/admin/login")
      }
    }

    verifyAuth()
  }, [router])

  useEffect(() => {
    if (!authChecked) return;
    
    const fetchData = async () => {
      try {
        setLoading({
          requests: true,
          providers: true,
          reports: true
        });

        const [requestsRes, providersRes, reportsRes] = await Promise.all([
          api.get("/admin/registration-requests?status=pending"),
          api.get("/providers?verified=true&limit=6"),
          api.get("/reports?status=open")
        ]);

        setRequests(requestsRes.data);
        setProviders(providersRes.data);
        setReports(reportsRes.data);
      } catch (error) {
        console.error("Data fetch failed:", error);
        toast({
          title: "Error loading data",
          description: "Failed to fetch dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading({
          requests: false,
          providers: false,
          reports: false
        });
      }
    }
    
    fetchData();

    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, [authChecked, toast]);

  const handleManualRefresh = async () => {
    try {
      setIsManualRefresh(true);
      const response = await api.get("/admin/registration-requests?status=pending");
      setRequests(response.data);
      toast({
        title: "Data refreshed",
        description: "Pending requests list has been updated",
      });
    } catch (error) {
      console.error("Refresh failed:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh pending requests",
        variant: "destructive"
      });
    } finally {
      setIsManualRefresh(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    try {
      setLoading(prev => ({ ...prev, requests: true }));
      const response = await api.post(`/admin/registration-requests/${requestId}/approve`);
      
      if (response.data?.updatedRequests) {
        setRequests(response.data.updatedRequests);
      } else {
        setRequests(prev => prev.filter(req => req.id !== requestId));
      }
      
      toast({
        title: "Approval successful",
        description: "Provider account has been created",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Approval failed",
          description: error.response?.data?.detail || "Could not approve request",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Approval failed",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  }
  
  const handleReject = async (requestId: number) => {
    try {
      setLoading(prev => ({ ...prev, requests: true }));
      const response = await api.post(`/admin/registration-requests/${requestId}/reject`, {
        reason: "Insufficient documentation"
      });
      
      if (response.data?.updatedRequests) {
        setRequests(response.data.updatedRequests);
      } else {
        setRequests(prev => prev.filter(req => req.id !== requestId));
      }
      
      toast({
        title: "Request rejected",
        description: "The registration request has been rejected",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Rejection failed",
          description: error.response?.data?.detail || "Could not reject request",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Rejection failed",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/admin/login")
  }

  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  
  function setActiveTab(tab: string): void {
    updateActiveTab(tab);
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Navigation */}
        <Sidebar className="bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-xl">
          <SidebarHeader className="border-b border-indigo-700 px-4">
            <div className="flex items-center gap-2 py-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="p-2 bg-white rounded-lg">
                  <HomeIcon className="h-5 w-5 text-indigo-700" />
                </div>
                <span className="text-lg font-bold">HomeHelp Admin</span>
              </Link>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/admin" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <HomeIcon className="h-4 w-4" />
                    </div>
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/admin/providers" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Users className="h-4 w-4" />
                    </div>
                    <span>Service Providers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/admin/homeowners" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Users className="h-4 w-4" />
                    </div>
                    <span>Homeowners</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/admin/revenue" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
                    <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <span>Revenue</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/admin/settings" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10">
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
                    <AvatarFallback className="bg-indigo-600">
                      {adminData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium truncate">{adminData.name}</p>
                    <p className="text-xs text-white/70 truncate">{adminData.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/admin/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
            <SidebarTrigger className="text-gray-700 hover:text-indigo-600" />
            
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleManualRefresh}
                disabled={isManualRefresh || loading.requests}
                className="hover:bg-indigo-50 hover:text-indigo-600"
              >
                {isManualRefresh ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2">Refresh</span>
              </Button>
              
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {adminData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">Admin</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, {adminData.name.split(' ')[0]}!</h1>
              <p className="text-gray-600">Here's what's happening with your platform today</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <Users className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-green-500 mt-1">+156 from last month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Service Providers</CardTitle>
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <Users className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{providers.length}</div>
                  <p className="text-xs text-green-500 mt-1">+{Math.floor(providers.length * 0.2)} from last month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24,567</div>
                  <p className="text-xs text-green-500 mt-1">+$3,456 from last month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Pending Approvals</CardTitle>
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Shield className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{requests.length}</div>
                  <p className="text-xs text-green-500 mt-1">{requests.length} new requests</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabbed Content Section */}
            <Tabs defaultValue="approvals" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList className="grid w-full sm:w-auto grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger 
                    value="approvals" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                    onClick={() => setActiveTab("approvals")}
                  >
                    Pending Approvals
                  </TabsTrigger>
                  <TabsTrigger 
                    value="providers" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                    onClick={() => setActiveTab("providers")}
                  >
                    Recent Providers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reports" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                    onClick={() => setActiveTab("reports")}
                  >
                    User Reports
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Pending Approvals Tab */}
              <TabsContent value="approvals" className="space-y-6">
                {loading.requests ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <div className="p-4 bg-indigo-100 rounded-full">
                      <Shield className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No pending approvals</h3>
                    <p className="text-gray-500 max-w-md">
                      There are currently no pending registration requests to review.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map((request) => (
                      <Card key={request.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                {request.full_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{request.full_name}</CardTitle>
                              <CardDescription className="mt-1">{request.email}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Contact</p>
                              <p>{request.phone_number || 'Not provided'}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-500">Experience</p>
                              <p>{request.years_experience ? `${request.years_experience} years` : 'Not specified'}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-500">Documents</p>
                              <div className="flex gap-2 mt-1">
                                {request.id_verification && (
                                  <a 
                                    href={request.id_verification} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    ID Verification
                                  </a>
                                )}
                                {request.certification && (
                                  <a 
                                    href={request.certification} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    Certification
                                  </a>
                                )}
                                {!request.id_verification && !request.certification && (
                                  <span className="text-sm text-gray-500">No documents uploaded</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-500">
                              Requested: {new Date(request.requested_at).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between gap-2 p-4 border-t">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReject(request.id)}
                            className="flex-1 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            className="flex-1 hover:bg-green-50 hover:text-green-600"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Recent Providers Tab */}
              <TabsContent value="providers" className="space-y-6">
                {loading.providers ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : providers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <div className="p-4 bg-indigo-100 rounded-full">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No providers found</h3>
                    <p className="text-gray-500 max-w-md">
                      There are currently no registered service providers.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {providers.map((provider) => (
                      <Card key={provider.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                {provider.full_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{provider.full_name}</CardTitle>
                              <CardDescription className="mt-1">{provider.email}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Experience</p>
                              <p>{provider.years_experience || 'Not specified'} years</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-500">Status</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                provider.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {provider.is_verified ? 'Verified' : 'Pending Verification'}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-500">
                              Joined: {new Date(provider.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="p-4 border-t">
                          <Button variant="outline" size="sm" className="w-full">
                            View Profile
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* User Reports Tab */}
              <TabsContent value="reports" className="space-y-6">
                {loading.reports ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <div className="p-4 bg-indigo-100 rounded-full">
                      <Shield className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
                    <p className="text-gray-500 max-w-md">
                      There are currently no open user reports to review.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
                      <Card key={report.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <CardDescription>
                            Reported on {new Date(report.created_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-3">
                            <p className="text-gray-700">{report.description}</p>
                            
                            <div className="flex justify-between items-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                report.status === 'open' ? 'bg-blue-100 text-blue-800' :
                                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex gap-2 p-4 border-t">
                          <Button variant="outline" size="sm" className="flex-1">
                            Dismiss
                          </Button>
                          <Button size="sm" className="flex-1">
                            Investigate
                          </Button>
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