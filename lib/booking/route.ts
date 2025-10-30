// import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import prisma from "@/lib/prisma"

// export const POST = withClerkMiddleware(async (req: NextRequest) => {
//   try {
//     const { userId } = getAuth(req)
    
//     if (!userId) {
//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const body = await req.json()
    
//     // Validate required fields
//     if (!body.service_id || !body.scheduled_date) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       )
//     }

//     // Check if service exists
//     const service = await prisma.service.findUnique({
//       where: { id: parseInt(body.service_id) }
//     })

//     if (!service) {
//       return NextResponse.json(
//         { message: "Service not found" },
//         { status: 404 }
//       )
//     }

//     // Create booking
//     const booking = await prisma.booking.create({
//       data: {
//         service_id: parseInt(body.service_id),
//         user_id: userId,
//         scheduled_date: new Date(body.scheduled_date),
//         status: "confirmed"
//       }
//     })

//     return NextResponse.json(booking)
//   } catch (error) {
//     console.error("Booking creation error:", error)
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     )
//   }
// })

// export const config = {
//   matcher: "/api/bookings",
// }