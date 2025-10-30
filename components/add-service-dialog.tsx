"use client"

import { useState, useRef } from "react"
import { Plus, Star, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addService } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface AddServiceDialogProps {
  onAddServiceAction: (newService: {
    title: string;
    description: string;
    price: string;
    image?: string;
    rating?: number;
    provider_name?: string;
  }) => Promise<void>;
}

export function AddServiceDialog({ onAddServiceAction }: AddServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [providerName, setProviderName] = useState("")
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [image, setImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!title || !description || !price) return

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("provider_name", providerName)
      formData.append("rating", rating.toString())
      if (image) {
        formData.append("image", image)
      }

      const result = await addService(formData)

      if (result.success) {
        onAddServiceAction({
          title,
          description,
          price,
          provider_name: providerName,
          rating,
          image: previewImage || undefined
        });

        toast({
          title: "Service added",
          description: "Your new service has been added successfully.",
        })
        
        // Reset form and close dialog
        setIsOpen(false)
        setTitle("")
        setDescription("")
        setPrice("")
        setProviderName("")
        setRating(0)
        setImage(null)
        setPreviewImage(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add service. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>Create a new service to offer to homeowners</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Plumbing Repair"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="provider_name">Provider Name</Label>
            <Input
              id="provider_name"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="Your company or name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your service in detail..."
              rows={4}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 150"
            />
          </div>
          
          {/* <div className="grid gap-2">
            <Label>Rating</Label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    (hoverRating || rating) >= star
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div> */}
          
          <div className="grid gap-2">
            <Label>Service Image</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={triggerFileInput}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              {previewImage && (
                <div className="relative h-16 w-16">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!title || !description || !price || !providerName}
          >
            Add Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}