"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeIcon, Star, Edit, Trash2 } from "lucide-react"
import { AddServiceDialog } from "@/components/add-service-dialog"
import { useToast } from "@/hooks/use-toast"

export default function ProviderServicesPage() {
  const { toast } = useToast()

  // Mock services data
  const services = [
    {
      id: "1",
      title: "Basic Plumbing Repair",
      description: "Fix leaks, clogs, and minor plumbing issues",
      price: "$75/hour",
      bookings: 24,
      rating: 4.8,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      title: "Pipe Installation",
      description: "Installation of new pipes and plumbing systems",
      price: "$150",
      bookings: 18,
      rating: 4.7,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      title: "Water Heater Repair",
      description: "Diagnose and fix issues with water heaters",
      price: "$120",
      bookings: 15,
      rating: 4.9,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "4",
      title: "Bathroom Fixture Installation",
      description: "Install sinks, toilets, showers, and bathtubs",
      price: "$200",
      bookings: 12,
      rating: 4.6,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const handleDeleteService = (id: string) => {
    toast({
      title: "Service deleted",
      description: "The service has been removed from your offerings.",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Services</h1>
          <p className="text-muted-foreground">Manage the services you offer to homeowners</p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/provider">
              <HomeIcon className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <AddServiceDialog onAddService={(service) => toast({ title: "Service added", description: `Added ${service.title}` })} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-bold text-homehelp-600">{service.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bookings</p>
                  <p className="font-medium">{service.bookings}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                    <span>{service.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

