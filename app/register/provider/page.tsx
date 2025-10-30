"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader2, User, Mail, Phone, Home, Lock, FileText, Award } from "lucide-react"

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(10, { message: "Phone must be at least 10 digits" }).optional(),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }).optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  yearsExperience: z.number().int().positive().optional(),
  idVerification: z.any().optional(),
  certification: z.any().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export default function ProviderRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      yearsExperience: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append("full_name", values.fullName)
      formData.append("email", values.email)
      formData.append("password", values.password)
      
      if (values.phone) formData.append("phone_number", values.phone)
      if (values.address) formData.append("address", values.address)
      if (values.yearsExperience) {
        formData.append("years_experience", values.yearsExperience.toString())
      }
      if (values.idVerification && values.idVerification instanceof File) {
        formData.append("id_verification", values.idVerification)
      }
      if (values.certification && values.certification instanceof File) {
        formData.append("certification", values.certification)
      }
  
      const response = await axios.post(
        'http://localhost:8000/register/provider/request',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
  
      toast({
        title: "Registration submitted!",
        description: response.data.message,
      })

      router.push(response.data.redirect_to || "/login")
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.detail || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Our Service Provider Network
          </h1>
          <p className="text-gray-600">
            Register your business to connect with homeowners in your area
          </p>
        </div>

        <Card className="shadow-lg rounded-xl overflow-hidden border-0">
          <CardHeader className="bg-homehelp-600 text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              Service Provider Registration
            </CardTitle>
            <CardDescription className="text-white/90">
              Complete your profile to start receiving service requests
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                      Personal Information
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                      Business Information
                    </h3>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-gray-500" />
                            Business Address
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, City, State, ZIP" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearsExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-500" />
                            Years of Experience
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Security Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Account Security
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-500" />
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-500" />
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Documents Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Verification Documents
                  </h3>
                  <p className="text-sm text-gray-500">
                    You can submit these documents now or later in your provider dashboard
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="idVerification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            ID Verification
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                className="bg-white"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="certification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-500" />
                            Professional Certification
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => field.onChange(e.target.files?.[0])}
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <Link href="/">
                      Back to Home
                    </Link>
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-homehelp-600 hover:bg-homehelp-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-homehelp-600 hover:text-homehelp-700">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
