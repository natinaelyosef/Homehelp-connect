"use client"

import { useState } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createBooking } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BookingDialogProps {
  serviceId: string
  serviceTitle: string
}

export function BookingDialog({ serviceId, serviceTitle }: BookingDialogProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ]

  const handleSubmit = async () => {
    if (!date || !time) return

    const formData = new FormData()
    formData.append("serviceId", serviceId)
    formData.append("date", format(date, "yyyy-MM-dd"))
    formData.append("time", time)

    const result = await createBooking(formData)

    if (result.success) {
      toast({
        title: "Booking created",
        description: `Your booking for ${serviceTitle} on ${format(date, "MMMM d, yyyy")} at ${time} has been created.`,
      })
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Book Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Service</DialogTitle>
          <DialogDescription>Select a date and time to book {serviceTitle}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !time && "text-muted-foreground")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {time || "Select a time"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid gap-1">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!date || !time}>
            Book Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

