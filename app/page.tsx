"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon, ArrowRight, Loader2 } from "lucide-react"
import { ServiceProviderSection } from "@/components/service-provider-section"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState<'login' | 'register' | null>(null)

  const handleNavigation = async (path: string, action: 'login' | 'register') => {
    if (isLoading) return
    setIsLoading(true)
    setLoadingAction(action)
    
    try {
      await router.push(path)
    } catch (error) {
      console.error("Navigation error:", error)
      setIsLoading(false)
      setLoadingAction(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <HomeIcon className="h-6 w-6 text-homehelp-600" />
            <span className="text-xl font-bold">HomeHelp</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#services" className="text-sm font-medium hover:text-homehelp-600 transition-colors">
              Services
            </Link>
            <Button 
              variant="ghost" 
              className="text-sm font-medium hover:text-homehelp-600 transition-colors"
              onClick={() => handleNavigation("/login", "login")}
              disabled={isLoading}
            >
              {loadingAction === "login" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
            <Button 
              onClick={() => handleNavigation("/register/provider", "register")}
              disabled={isLoading}
            >
              {loadingAction === "register" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </nav>
          <Button variant="outline" size="icon" className="md:hidden">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-homehelp-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Find the Right Service Provider
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Browse through our verified service providers and find the perfect match for your needs. 
                    Log in to book a service or become a provider.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button 
                    size="lg" 
                    className="gap-1"
                    onClick={() => handleNavigation("/register/homeowner", "register")}
                    disabled={isLoading}
                  >
                    {loadingAction === "register" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing up...
                      </>
                    ) : (
                      <>
                        I am Homeowner<ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => handleNavigation("/register/provider", "register")}
                    disabled={isLoading}
                  >
                    {loadingAction === "register" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing up...
                      </>
                    ) : (
                      "Become a Provider"
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="HomeHelp Services"
                  className="rounded-xl object-cover"
                  height="550"
                  src="/placeholder.svg?height=550&width=550"
                  width="550"
                />
              </div>
            </div>
          </div>
        </section>

        <ServiceProviderSection />

        <section className="w-full py-12 md:py-24 lg:py-32 bg-homehelp-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Log in to book a service or join as a service provider
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="gap-1"
                  onClick={() => handleNavigation("/register/homeowner", "register")}
                  disabled={isLoading}
                >
                  {loadingAction === "register" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    <>
                      I am Homeowner <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-homehelp-600"
                  onClick={() => handleNavigation("/register/provider", "register")}
                  disabled={isLoading}
                >
                  {loadingAction === "register" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    "Become a Provider"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                HomeHelp
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

