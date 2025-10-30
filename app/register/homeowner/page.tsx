"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  HomeIcon,
  Loader2,
  CheckCircle2,
  Search,
  Shield,
  Clock,
  Star,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios from "axios"

const formSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    phone: z.string().min(10),
    address: z.string().min(5),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const benefits = [
  {
    icon: Search,
    title: "Easy Service Discovery",
    description:
      "Find verified service providers in your area with detailed profiles and reviews.",
  },
  {
    icon: Shield,
    title: "Verified Providers",
    description:
      "All service providers are thoroughly vetted and background-checked.",
  },
  {
    icon: Clock,
    title: "Quick Response",
    description:
      "Get fast responses from providers and schedule services at your convenience.",
  },
  {
    icon: Star,
    title: "Quality Assurance",
    description:
      "Rate and review services to help maintain high quality standards.",
  },
]

export default function HomeownerRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const formData = new URLSearchParams()
      formData.append("full_name", values.fullName)
      formData.append("email", values.email)
      formData.append("phone_number", values.phone)
      formData.append("address", values.address)
      formData.append("password", values.password)

      await axios.post("http://localhost:8000/register/homeowner/", formData.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })

      toast({
        title: "Registration successful!",
        description: "Your homeowner account has been created.",
      })
      router.push("/login")
    } catch (error: any) {
      let errorMessage = "Registration failed"
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left - Registration Form */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 md:p-16">
        <div className="mb-8 flex items-center gap-2">
          <HomeIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-gray-800">HomeHelp</span>
        </div>

        <div className="mx-auto max-w-md">
          <Card className="shadow-xl rounded-2xl border border-gray-200">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-semibold text-gray-800">
                Create Your Homeowner Account
              </CardTitle>
              <CardDescription>
                Start connecting with trusted service providers today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {[
                    { name: "fullName", label: "Full Name", placeholder: "John Doe" },
                    { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
                    { name: "password", label: "Password", type: "password" },
                    { name: "confirmPassword", label: "Confirm Password", type: "password" },
                    { name: "phone", label: "Phone Number", placeholder: "+1 (555) 123-4567" },
                    {
                      name: "address",
                      label: "Address",
                      placeholder: "123 Main St, City, ZIP",
                      description: (
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs"
                          type="button"
                        >
                          Use my current location
                        </Button>
                      ),
                    },
                  ].map(({ name, label, placeholder, type = "text", description }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof typeof formSchema["_type"]}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type={type}
                              placeholder={placeholder}
                              className="focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary"
                            />
                          </FormControl>
                          {description && (
                            <FormDescription>{description}</FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <Button
                    type="submit"
                    className="w-full rounded-xl text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right - Benefits */}
      <div className="hidden lg:flex w-1/2 bg-primary text-white p-12 items-center justify-center">
        <div className="max-w-md space-y-8">
          <h2 className="text-4xl font-bold">Why Choose HomeHelp?</h2>
          <p className="text-lg text-white/90">
            Get reliable home services with speed, safety, and quality you can count on.
          </p>
          <div className="space-y-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-full">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-white/80">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-8 text-sm text-white/80 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Already have an account?
            <Link
              href="/login"
              className="text-white underline font-medium hover:text-white/90"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
