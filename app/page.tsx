import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Shield, CheckCircle } from "lucide-react"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

export default async function LandingPage() {
  // Check if user is already signed in
  const { userId } = await auth()
  
  if (userId) {
    redirect("/public")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">UIUSPRS</span>
            </div>
            <div>
              <SignedOut>
                <SignInButton 
                  mode="modal"
                  forceRedirectUrl="/public"
                  fallbackRedirectUrl="/public"
                >
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Sign In with UIU Email
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  onClick={() => window.location.href = "/public"}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Go to Dashboard
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            United International University
          </h1>
          <h2 className="text-2xl font-semibold text-blue-600 mt-2 sm:text-3xl">
            Student Problem Reporting System
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            A transparent platform for UIU students to report issues, track progress, and receive 
            timely responses from university authorities.
          </p>

          <div className="mt-10">
            <SignedOut>
              <SignInButton 
                mode="modal"
                forceRedirectUrl="/public"
                fallbackRedirectUrl="/public"
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Get Started - Sign In with UIU Email
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button 
                size="lg" 
                onClick={() => window.location.href = "/public"}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
              >
                Continue to Dashboard
              </Button>
            </SignedIn>
          </div>

          {/* Email Format Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> Please use your official UIU email address 
              (format: yourname@department.uiu.ac.bd) to access this system.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-600 mx-auto" />
              <CardTitle>Easy Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Submit your issues with detailed descriptions and file attachments
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto" />
              <CardTitle>Transparent Process</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your report's progress from submission to resolution
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mx-auto" />
              <CardTitle>Secure & Anonymous</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your reports are handled securely with anonymous public viewing
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-orange-600 mx-auto" />
              <CardTitle>Quick Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get timely responses and solutions from relevant departments
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Submit Report</h4>
              <p className="text-gray-600">
                Log in with your UIU email and submit your issue with details and evidence
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Track Progress</h4>
              <p className="text-gray-600">
                Monitor your report as it moves through DSW and departmental review
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Get Resolution</h4>
              <p className="text-gray-600">
                Receive feedback and resolution updates via email and dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 United International University. All rights reserved.</p>
          <p className="mt-2 text-gray-400">
            Student Problem Reporting System - Making UIU Better Together
          </p>
        </div>
      </footer>
    </div>
  )
}