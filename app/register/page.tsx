"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeIcon, Wrench, ArrowRight } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type")

  useEffect(() => {
    if (type === "homeowner") {
      router.push("/register/homeowner")
    } else if (type === "provider") {
      router.push("/register/provider")
    }
  }, [type, router])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <HomeIcon className="h-6 w-6 text-homehelp-600" />
        <span className="text-lg font-bold">HomeHelp</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Join HomeHelp</h1>
          <p className="text-sm text-muted-foreground">Choose how you want to use HomeHelp</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="hover:border-homehelp-300 transition-all">
            <CardHeader className="space-y-1">
              <div className="flex justify-center">
                <div className="rounded-full bg-homehelp-100 p-3">
                  <HomeIcon className="h-6 w-6 text-homehelp-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-center">Homeowner</CardTitle>
              <CardDescription className="text-center">Find and book qualified service providers</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <p>Access trusted professionals for all your home service needs</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full gap-1">
                <Link href="/register/homeowner">
                  I am Homeowner <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="hover:border-homehelp-300 transition-all">
            <CardHeader className="space-y-1">
              <div className="flex justify-center">
                <div className="rounded-full bg-homehelp-100 p-3">
                  <Wrench className="h-6 w-6 text-homehelp-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-center">Service Provider</CardTitle>
              <CardDescription className="text-center">Offer your services to homeowners</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <p>Join our network of verified service providers and grow your business</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full gap-1">
                <Link href="/register/provider">
                  I am Provider <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-homehelp-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

