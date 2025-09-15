import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const { userId } =await  auth()

  if (!userId) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    redirect("/unauthorized")
  }

  return user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await getCurrentUser()

  if (!allowedRoles.includes(user.role)) {
    redirect("/public")
  }

  return user
}
