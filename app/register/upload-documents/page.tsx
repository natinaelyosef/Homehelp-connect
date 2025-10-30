"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { FileUp, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"

export default function DocumentUploadPage() {
  const [idFile, setIdFile] = useState<File | null>(null)
  const [certFile, setCertFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // Check authentication and verification status
  useEffect(() => {
    const checkAuthAndVerification = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await api.get("/provider/status")
        if (response.data.documents_verified) {
          router.push("/dashboard/provider")
        }
      } catch (error) {
        console.error("Verification check failed:", error)
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuthAndVerification()
  }, [router, toast])

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return

      const file = e.target.files[0]
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload JPG, PNG, or PDF files only",
          variant: "destructive",
        })
        return
      }
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        })
        return
      }
      
      setter(file)
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!idFile || !certFile) {
      toast({
        title: "Missing Documents",
        description: "Please upload both ID verification and certification files",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("id_verification", idFile)
      formData.append("certification", certFile)

      const response = await api.post("/provider/upload-documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000 // 30 seconds timeout
      })

      toast({
        title: "Success!",
        description: response.data.message,
      })

      router.push(response.data.redirect_to || "/dashboard/provider")
    } catch (error: any) {
      console.error("Upload error:", error)
      
      let errorMessage = "Upload failed. Please try again."
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Session expired. Please log in again."
          localStorage.clear()
          router.push("/login")
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.status === 413) {
          errorMessage = "File size exceeds server limit"
        }
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden">
        {/* ... rest of your JSX remains the same ... */}
      </Card>
    </div>
  )
}

// DocumentUploadSection component remains the same

function DocumentUploadSection({ 
  label, 
  description,
  file, 
  onChange 
}: {
  label: string
  description?: string
  file: File | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium">{label}</label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <label className="flex-1">
          <div className={`border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${
            file ? "border-green-200 bg-green-50" : "border-gray-300 hover:border-primary"
          }`}>
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              {file ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <span className="text-sm font-medium truncate max-w-full">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </>
              ) : (
                <>
                  <FileUp className="h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium">Click to upload</span>
                  <span className="text-xs text-muted-foreground">
                    JPG, PNG, or PDF (max 5MB)
                  </span>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={onChange}
              className="hidden"
            />
          </div>
        </label>
        
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onChange({ target: { files: null } } as any)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}