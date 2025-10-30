"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeIcon, Settings, LogOut } from "lucide-react"
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
import { useState } from "react"

export default function PendingUserDashboard() {
  const [userStatus] = useState({
    isVerified: false,
    needsDocuments: false
  })


  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="bg-gray-900 text-white">
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
              <SidebarMenuItem className="hover:bg-white hover:text-black">
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/pending">
                    <HomeIcon className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="hover:bg-white hover:text-black">
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/pending/settings">
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
                  <p className="text-sm font-medium">Homehelp.connect</p>
                  <p className="text-xs text-muted-foreground">homehelp.connect@gmail.com</p>
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
                    <Link href="/dashboard/pending/settings">
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
              <h1 className="text-lg font-semibold">Pending Approval</h1>
            </div>
          </header>
          
          <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>
                    {userStatus.needsDocuments 
                      ? "Please complete your registration by uploading required documents"
                      : "Your account is pending admin approval"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userStatus.needsDocuments ? (
                      <>
                        <p>To become a verified provider, please upload:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Government-issued ID for verification</li>
                          <li>Professional certification or license</li>
                        </ul>
                        <Button asChild>
                          <Link href="/dashboard/provider/upload-documents">
                            Upload Documents
                          </Link>
                        </Button>
                      </>
                    ) : (

                      <>
                        <p>Thank you for submitting your documents. Your account is currently under review.</p>
                        <p className="text-sm text-muted-foreground">
                          Our team typically reviews applications within 2-3 business days.
                          You'll receive an email notification once your account is approved.
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                          <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium">What to expect after approval:</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                              <li>Full access to provider dashboard</li>
                              <li>Ability to create and manage services</li>
                              <li>Booking requests from clients</li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Prepare Your Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        While you wait, you can prepare your profile information and service offerings.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Review Platform Policies</h3>
                      <p className="text-sm text-muted-foreground">
                        Familiarize yourself with our terms of service and community guidelines.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

