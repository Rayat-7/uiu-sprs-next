import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Shield, CheckCircle, ArrowRight, Star, Clock, Building2 } from "lucide-react"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

export default async function LandingPage() {
  // Check if user is already signed in
  const { userId } = await auth()
  
  if (userId) {
    redirect("/public")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">UIUSPRS</span>
                <div className="text-xs text-gray-500">Student Reporting System</div>
              </div>
            </div>
            <div>
              <SignedOut>
                <SignInButton 
                  mode="modal"
                  forceRedirectUrl="/public"
                  fallbackRedirectUrl="/public"
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Shield className="h-4 w-4 mr-2" />
                    Sign In with UIU Email
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  onClick={() => window.location.href = "/public"}
                  className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2" />
              Trusted by UIU Students & Administration
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
            United International University
          </h1>
          <h2 className="text-2xl font-semibold text-blue-600 mt-2 sm:text-3xl">
            Student Problem Reporting System
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A transparent, efficient platform for UIU students to report issues, track progress, and receive 
            timely responses from university authorities. Your voice matters, and we're here to listen.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <SignInButton 
                mode="modal"
                forceRedirectUrl="/public"
                fallbackRedirectUrl="/public"
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Shield className="h-5 w-5 mr-2" />
                  Get Started - Sign In with UIU Email
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button 
                size="lg" 
                onClick={() => window.location.href = "/public"}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Continue to Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </SignedIn>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 border-2 hover:bg-gray-50 transition-all duration-200"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>

          {/* Email Format Notice */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl max-w-2xl mx-auto border border-blue-200">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-blue-600 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  <strong>Secure Access for UIU Community</strong>
                </p>
                <p className="text-sm text-blue-800">
                  Please use your official UIU email address (format: yourname@department.uiu.ac.bd) to access this system.
                  Only verified UIU emails are granted access to ensure security and authenticity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Easy Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Submit your issues with detailed descriptions and file attachments through our intuitive interface
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Real-time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Track your report's progress from submission to resolution with live status updates
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Secure & Transparent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Your reports are handled securely with transparent public viewing while maintaining privacy
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Quick Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Get timely responses and solutions from relevant departments with email notifications
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, transparent process designed to ensure your concerns are heard and resolved efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                {/* Connector line */}
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-green-300 transform translate-x-8"></div>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">Submit Report</h4>
              <p className="text-gray-600 leading-relaxed">
                Log in with your UIU email and submit your issue with detailed descriptions and supporting evidence
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                {/* Connector line */}
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-300 to-purple-300 transform translate-x-8"></div>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">Track Progress</h4>
              <p className="text-gray-600 leading-relaxed">
                Monitor your report as it moves through DSW administration and departmental review processes
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">Get Resolution</h4>
              <p className="text-gray-600 leading-relaxed">
                Receive feedback and resolution updates via email notifications and your personal dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by the UIU Community</h3>
            <p className="text-gray-600">Making a difference in student experience</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Reports Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
              <div className="text-gray-600">Average Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">10+</div>
              <div className="text-gray-600">Departments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <div className="ml-3">
                  <div className="text-xl font-bold">UIUSPRS</div>
                  <div className="text-sm text-gray-400">Student Reporting System</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering UIU students with a transparent and efficient platform for reporting and resolving campus issues.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>United International University</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Student Welfare Department</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 United International University. All rights reserved.
            </p>
            <p className="mt-2 text-gray-500">
              Student Problem Reporting System - Making UIU Better Together
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}