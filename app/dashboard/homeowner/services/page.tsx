"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeIcon, Search, Star } from "lucide-react"
import { BookingDialog } from "@/components/booking-dialog"
import { ServiceDetailsDialog } from "@/components/service-details-dialog"

export default function FindServicesPage() {
  // Mock services data
  const services = [
    {
      id: "1",
      title: "Plumbing Services",
      provider: "Mike's Plumbing",
      price: "$75/hour",
      rating: 4.8,
      image: "/placeholder.svg?height=100&width=100",
      description: "Professional plumbing services including repairs, installations, and maintenance.",
    },
    {
      id: "2",
      title: "Electrical Work",
      provider: "Volt Experts",
      price: "$85/hour",
      rating: 4.7,
      image: "/placeholder.svg?height=100&width=100",
      description: "Licensed electricians for all your electrical needs, from minor repairs to major installations.",
    },
    {
      id: "3",
      title: "House Cleaning",
      provider: "CleanPro Services",
      price: "$120",
      rating: 4.9,
      image: "/placeholder.svg?height=100&width=100",
      description: "Thorough house cleaning services with eco-friendly products and attention to detail.",
    },
    {
      id: "4",
      title: "Lawn Care",
      provider: "Green Thumb Landscaping",
      price: "$60",
      rating: 4.6,
      image: "/placeholder.svg?height=100&width=100",
      description: "Complete lawn care services including mowing, trimming, and garden maintenance.",
    },
    {
      id: "5",
      title: "Painting Services",
      provider: "Perfect Painters",
      price: "$35/hour",
      rating: 4.5,
      image: "/placeholder.svg?height=100&width=100",
      description: "Interior and exterior painting services with premium paints and professional finish.",
    },
    {
      id: "6",
      title: "Handyman Services",
      provider: "Fix-It-All",
      price: "$65/hour",
      rating: 4.7,
      image: "/placeholder.svg?height=100&width=100",
      description: "General handyman services for all your home repair and maintenance needs.",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Find Services</h1>
          <p className="text-muted-foreground">Browse and book services from our verified providers</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/homeowner">
            <HomeIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Search for services..." className="pl-10 py-6 text-lg" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.provider}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <p className="font-bold text-homehelp-600">{service.price}</p>
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                  <span>{service.rating}</span>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <ServiceDetailsDialog service={service} />
              <BookingDialog serviceId={service.id} serviceTitle={service.title} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

