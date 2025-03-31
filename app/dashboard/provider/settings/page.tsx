"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HomeIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const profileFormSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  serviceArea: z.string().min(1, {
    message: "Service area is required.",
  }),
  bio: z.string().optional(),
})

const servicesFormSchema = z.object({
  availableWeekends: z.boolean(),
  availableEvenings: z.boolean(),
  emergencyService: z.boolean(),
  minBookingNotice: z.string(),
  maxDailyBookings: z.string(),
})

export default function ProviderSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      businessName: "Mike's Plumbing",
      email: "mike@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Anytown, USA",
      serviceArea: "25",
      bio: "Professional plumbing services with over 10 years of experience. Specializing in repairs, installations, and maintenance.",
    },
  })

  const servicesForm = useForm<z.infer<typeof servicesFormSchema>>({
    resolver: zodResolver(servicesFormSchema),
    defaultValues: {
      availableWeekends: true,
      availableEvenings: false,
      emergencyService: true,
      minBookingNotice: "2",
      maxDailyBookings: "5",
    },
  })

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated.",
      })
    }, 1000)
  }

  function onServicesSubmit(values: z.infer<typeof servicesFormSchema>) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsLoading(false)
      toast({
        title: "Service settings updated",
        description: "Your service settings have been updated.",
      })
    }, 1000)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Provider Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/provider">
            <HomeIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Business Profile</TabsTrigger>
          <TabsTrigger value="services">Service Settings</TabsTrigger>
          <TabsTrigger value="payments">Payment Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>Update your business information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback>MP</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Logo
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="serviceArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Area (miles)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 miles</SelectItem>
                            <SelectItem value="10">10 miles</SelectItem>
                            <SelectItem value="15">15 miles</SelectItem>
                            <SelectItem value="25">25 miles</SelectItem>
                            <SelectItem value="50">50+ miles</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>The maximum distance you're willing to travel for service.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your business and services..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>This will be displayed on your profile page.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Settings</CardTitle>
              <CardDescription>Configure your service availability and booking preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...servicesForm}>
                <form onSubmit={servicesForm.handleSubmit(onServicesSubmit)} className="space-y-4">
                  <FormField
                    control={servicesForm.control}
                    name="availableWeekends"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Weekend Availability</FormLabel>
                          <FormDescription>Make your services available on weekends.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={servicesForm.control}
                    name="availableEvenings"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Evening Availability</FormLabel>
                          <FormDescription>Make your services available after 5:00 PM.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={servicesForm.control}
                    name="emergencyService"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Emergency Services</FormLabel>
                          <FormDescription>Offer emergency services with priority booking.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={servicesForm.control}
                    name="minBookingNotice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Booking Notice (hours)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select minimum notice" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="2">2 hours</SelectItem>
                            <SelectItem value="4">4 hours</SelectItem>
                            <SelectItem value="8">8 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Minimum notice required before a booking can be made.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={servicesForm.control}
                    name="maxDailyBookings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Daily Bookings</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select maximum bookings" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3">3 bookings</SelectItem>
                            <SelectItem value="5">5 bookings</SelectItem>
                            <SelectItem value="8">8 bookings</SelectItem>
                            <SelectItem value="10">10 bookings</SelectItem>
                            <SelectItem value="15">15+ bookings</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Maximum number of bookings you can accept per day.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure your payment methods and payout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Payout Method</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input type="radio" id="bank" name="payout" className="h-4 w-4" defaultChecked />
                    <label htmlFor="bank" className="text-sm font-medium">
                      Bank Account (Direct Deposit)
                    </label>
                  </div>
                  <div className="ml-6 space-y-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Account Holder Name</label>
                      <Input defaultValue="Michael Johnson" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Account Number</label>
                      <Input defaultValue="••••••••1234" type="password" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Routing Number</label>
                      <Input defaultValue="••••••••5678" type="password" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="paypal" name="payout" className="h-4 w-4" />
                    <label htmlFor="paypal" className="text-sm font-medium">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Payout Schedule</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="radio" id="weekly" name="schedule" className="h-4 w-4" defaultChecked />
                    <label htmlFor="weekly" className="text-sm font-medium">
                      Weekly (Every Monday)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="biweekly" name="schedule" className="h-4 w-4" />
                    <label htmlFor="biweekly" className="text-sm font-medium">
                      Bi-weekly (Every other Monday)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="monthly" name="schedule" className="h-4 w-4" />
                    <label htmlFor="monthly" className="text-sm font-medium">
                      Monthly (1st of each month)
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Tax Information</h3>
                <div className="space-y-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Tax ID Type</label>
                    <Select defaultValue="ssn">
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ssn">Social Security Number (SSN)</SelectItem>
                        <SelectItem value="ein">Employer Identification Number (EIN)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Tax ID Number</label>
                    <Input defaultValue="•••-••-1234" type="password" />
                  </div>
                </div>
              </div>

              <Button>Save Payment Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

