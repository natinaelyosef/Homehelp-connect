"use client"

// Import necessary components and utilities
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon, Users, DollarSign, Settings, LogOut, Shield } from "lucide-react"
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
import { ProviderApprovalCard, ReportReviewCard } from "@/components/admin-components"
import type { Provider, Report } from "@/lib/types"

// Mock data for service providers awaiting approval
const mockProviders: Provider[] = [
  {
    id: "1",
    name: "Michael Chen",
    type: "Electrician",
    experience: "5+ years",
    date: "Applied 2 days ago",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    type: "Plumber",
    experience: "3+ years",
    date: "Applied 3 days ago",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "David Wilson",
    type: "Carpenter",
    experience: "7+ years",
    date: "Applied 1 day ago",
    image: "/placeholder.svg?height=100&width=100",
  },
]

// Mock data for user reports
const mockReports: Report[] = [
  {
    id: "1",
    reporter: "John Doe",
    reported: "Mike's Plumbing",
    reason: "Service not completed as described",
    date: "2 days ago",
    status: "New",
  },
  {
    id: "2",
    reporter: "Emily Rodriguez",
    reported: "CleanPro Services",
    reason: "Unprofessional behavior",
    date: "1 week ago",
    status: "Under Review",
  },
  {
    id: "3",
    reporter: "Perfect Painters",
    reported: "David Wilson",
    reason: "Payment dispute",
    date: "3 days ago",
    status: "New",
  },
]

// Main Admin Dashboard component
export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar>
          {/* Sidebar Header with HomeHelp Logo */}
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-4 py-2">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <HomeIcon className="h-6 w-6 text-homehelp-600" />
                <span className="text-lg font-bold">HomeHelp Admin</span>
              </Link>
            </div>
          </SidebarHeader>

          {/* Sidebar Navigation Menu */}
          <SidebarContent>
            <SidebarMenu>
              {/* Dashboard Link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/admin">
                    <HomeIcon className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Service Providers Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/admin/providers">
                    <Users className="h-4 w-4" />
                    <span>Service Providers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Homeowners Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/admin/homeowners">
                    <Users className="h-4 w-4" />
                    <span>Homeowners</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Revenue Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/admin/revenue">
                    <DollarSign className="h-4 w-4" />
                    <span>Revenue</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Platform Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/admin/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          {/* Sidebar Footer with Admin Profile */}
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              {/* Admin Profile Information */}
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@homehelp.com</p>
                </div>
              </div>
              {/* Admin Profile Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin/settings">
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

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationsPanel />
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Users Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+156 from last month</p>
                </CardContent>
              </Card>
              {/* Service Providers Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">324</div>
                  <p className="text-xs text-muted-foreground">+42 from last month</p>
                </CardContent>
              </Card>
              {/* Total Revenue Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24,567</div>
                  <p className="text-xs text-muted-foreground">+$3,456 from last month</p>
                </CardContent>
              </Card>
              {/* Pending Approvals Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">+5 new requests</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabbed Content Section */}
            <Tabs defaultValue="approvals" className="space-y-4">
              <TabsList>
                <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
                <TabsTrigger value="revenue">Revenue Overview</TabsTrigger>
                <TabsTrigger value="reports">User Reports</TabsTrigger>
              </TabsList>

              {/* Pending Approvals Tab */}
              <TabsContent value="approvals" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mockProviders.map((provider) => (
                    <ProviderApprovalCard key={provider.id} provider={provider} />
                  ))}
                </div>
              </TabsContent>

              {/* Revenue Overview Tab */}
              <TabsContent value="revenue" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Monthly revenue statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Total Revenue Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Total Revenue</span>
                          </div>
                          <span className="font-bold">$24,567</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      {/* Platform Fee Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Platform Fee (20%)</span>
                          </div>
                          <span className="font-bold">$4,913</span>
                        </div>
                        <Progress value={20} className="h-2" />
                      </div>
                      {/* Provider Payouts Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Provider Payouts</span>
                          </div>
                          <span className="font-bold">$19,654</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* User Reports Tab */}
              <TabsContent value="reports" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mockReports.map((report) => (
                    <ReportReviewCard key={report.id} report={report} />
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

