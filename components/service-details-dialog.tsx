"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookingDialog } from "./booking-dialog"

interface ServiceDetailsDialogProps {
  service: {
    id: string
    title: string
    provider_name: string
    price: string
    rating: number
    image: string
    description?: string
  }
}

export function ServiceDetailsDialog({ service }: ServiceDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{service.title}</DialogTitle>
          <DialogDescription>Provided by {service.provider_name}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-4">
            <img
              src={service.image || "/placeholder.svg"}
              alt={service.title}
              className="h-24 w-24 rounded-md object-cover"
            />
            <div>
              <p className="text-lg font-bold text-homehelp-600">{service.price}</p>
              <div className="mt-1 flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`mr-1 h-4 w-4 ${
                        i < service.rating ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                <span className="ml-1 text-sm text-muted-foreground">{service.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">
              {service.description ||
                "Professional service with attention to detail. Our experienced team ensures high-quality work and customer satisfaction. We use premium materials and follow industry best practices."}
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Provider Information</h4>
            <p className="text-sm text-muted-foreground">
              {service.provider_name} is a verified service provider with excellent ratings and reviews. They specialize in
              this type of service and have completed many similar jobs.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          {/* <BookingDialog serviceId={service.id} serviceTitle={service.title} onBookingSuccessAction={function (): void {
            throw new Error("Function not implemented.")
          } } /> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

