import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
<<<<<<< HEAD
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Shield, CheckCircle, ArrowRight, Zap, Eye, Clock } from "lucide-react"
=======
import { FileText, Users, Shield, CheckCircle, ArrowRight, Star, Clock, Building2 } from "lucide-react"
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"

export default async function LandingPage() {
  // Check if user is already signed in
  const { userId } = await auth()
  
  if (userId) {
    redirect("/public")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
<<<<<<< HEAD

       <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">UIUSPRS</span>
                <Badge variant="secondary" className="ml-2 text-xs animate-bounce" style={{ animationDelay: '0.5s' }}>v2.0</Badge>
=======
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">UIUSPRS</span>
                <div className="text-xs text-gray-500">Student Reporting System</div>
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <SignedOut>
<<<<<<< HEAD
                <Link href="/sign-in">
                  <Button className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Shield className="mr-2 h-4 w-4" />
=======
                <SignInButton 
                  mode="modal"
                  forceRedirectUrl="/public"
                  fallbackRedirectUrl="/public"
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Shield className="h-4 w-4 mr-2" />
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                    Sign In with UIU Email
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Button 
                  onClick={() => window.location.href = "/public"}
<<<<<<< HEAD
                  className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue to Dashboard
=======
                  className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
<<<<<<< HEAD
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4 animate-fade-in-up">
              <Badge variant="outline" className="px-4 py-1 text-sm font-medium animate-bounce bg-white/50 backdrop-blur-sm">
                🚀 Now Live - Enhanced Reporting System
              </Badge>
              <h1 className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <span className="block">United International</span>
                <span className="block text-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  University
                </span>
              </h1>
              <h2 className="text-2xl font-semibold text-muted-foreground mt-4 sm:text-3xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
                Student Problem Reporting System
              </h2>
            </div>
            
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.6s' }}>
              A modern, transparent platform designed for UIU students to report issues, 
              track progress in real-time, and receive timely responses from university authorities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <SignedOut>
                <Link href="/sign-in">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-float"
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Get Started Now
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = "/public"}
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Continue to Dashboard
                </Button>
              </SignedIn>
              
              {/* <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 rounded-xl border-2 hover:bg-accent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-105"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Eye className="mr-2 h-5 w-5" />
                Learn More
              </Button> */}
            </div>

            {/* Email Format Notice with enhanced styling */}
            <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-2xl max-w-2xl mx-auto backdrop-blur-sm animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '1s' }}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-semibold text-primary">UIU Email Required</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Please use your official UIU email address (format: <code className="bg-muted px-2 py-1 rounded font-mono text-primary">yourname@department.uiu.ac.bd</code>) to access the system.
              </p>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-1/4 left-10 animate-float" style={{ animationDelay: '1s' }}>
              <div className="w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
            </div>
            <div className="absolute bottom-1/4 right-10 animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with enhanced animations */}
      <section id="features" className="py-20 bg-muted/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">Why Choose UIUSPRS?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Built with modern technology to ensure transparency, efficiency, and user-friendly experience
            </p>
=======
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
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-white/50 backdrop-blur-sm animate-fade-in-up">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors group-hover:scale-110 duration-300 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Easy Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Submit detailed reports with file attachments through an intuitive interface designed for students
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-white/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors group-hover:scale-110 duration-300 mb-4">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Full Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track your report's journey from submission to resolution with real-time updates and progress indicators
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-white/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors group-hover:scale-110 duration-300 mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Your reports are handled securely with anonymous public viewing to protect student privacy
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-white/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors group-hover:scale-110 duration-300 mb-4">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Fast Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Streamlined workflow ensures quick assignment to departments and timely resolution of issues
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* How it Works with enhanced animations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">How It Works</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              A simple, transparent process designed to resolve student issues efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center relative animate-fade-in-up">
              <div className="relative">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-float hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transform translate-x-10 animate-pulse"></div>
              </div>
              <h4 className="text-xl font-semibold mb-4">Submit Your Report</h4>
              <p className="text-muted-foreground leading-relaxed">
                Log in with your UIU email and submit detailed reports with evidence. Our system ensures one quality report per week.
              </p>
            </div>
            
            <div className="text-center relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-float hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-500 to-purple-500 transform translate-x-10 animate-pulse"></div>
              </div>
              <h4 className="text-xl font-semibold mb-4">Track Progress</h4>
              <p className="text-muted-foreground leading-relaxed">
                Watch your report move through DSW review, department assignment, and resolution phases with live updates.
              </p>
            </div>
            
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-float hover:scale-110 transition-transform duration-300" style={{ animationDelay: '1s' }}>
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-4">Get Resolution</h4>
              <p className="text-muted-foreground leading-relaxed">
                Receive detailed feedback and resolution updates via email and dashboard notifications once completed.
=======
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
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
              </p>
            </div>
          </div>
        </div>
<<<<<<< HEAD
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">100%</div>
              <div className="text-muted-foreground">Transparent Process</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">System Availability</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">Secure</div>
              <div className="text-muted-foreground">Data Protection</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">Fast</div>
              <div className="text-muted-foreground">Issue Resolution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-foreground">Ready to Get Started?</h3>
            <p className="text-xl text-muted-foreground">
              Join the UIU community in creating a better campus experience through transparent communication.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignedOut>
                <SignInButton 
                  mode="modal"
                  forceRedirectUrl="/public"
                  fallbackRedirectUrl="/public"
                >
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Sign In & Start Reporting
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = "/public"}
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Go to Your Dashboard
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">UIUSPRS</span>
              <Badge variant="outline">v2.0</Badge>
            </div>
            <p className="text-muted-foreground">
              &copy; 2024 United International University. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Student Problem Reporting System - Making UIU Better Together 🚀
=======

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
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

















// import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { FileText, Users, Shield, CheckCircle } from "lucide-react"
// import { redirect } from "next/navigation"
// import { auth } from "@clerk/nextjs/server"

// export default async function LandingPage() {
//   // Check if user is already signed in
//   const { userId } = await auth()
  
//   if (userId) {
//     redirect("/public")
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Navigation */}
//       <nav className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <Shield className="h-8 w-8 text-blue-600" />
//               <span className="ml-2 text-xl font-bold text-gray-900">UIUSPRS</span>
//             </div>
//             <div>
//               <SignedOut>
//                 <SignInButton 
//                   mode="modal"
//                   forceRedirectUrl="/public"
//                   fallbackRedirectUrl="/public"
//                 >
//                   <Button className="bg-blue-600 hover:bg-blue-700">
//                     Sign In with UIU Email
//                   </Button>
//                 </SignInButton>
//               </SignedOut>
//               <SignedIn>
//                 <Button 
//                   onClick={() => window.location.href = "/public"}
//                   className="bg-green-600 hover:bg-green-700"
//                 >
//                   Go to Dashboard
//                 </Button>
//               </SignedIn>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
//             United International University
//           </h1>
//           <h2 className="text-2xl font-semibold text-blue-600 mt-2 sm:text-3xl">
//             Student Problem Reporting System
//           </h2>
//           <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
//             A transparent platform for UIU students to report issues, track progress, and receive 
//             timely responses from university authorities.
//           </p>

//           <div className="mt-10">
//             <SignedOut>
//               <SignInButton 
//                 mode="modal"
//                 forceRedirectUrl="/public"
//                 fallbackRedirectUrl="/public"
//               >
//                 <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
//                   Get Started - Sign In with UIU Email
//                 </Button>
//               </SignInButton>
//             </SignedOut>
//             <SignedIn>
//               <Button 
//                 size="lg" 
//                 onClick={() => window.location.href = "/public"}
//                 className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
//               >
//                 Continue to Dashboard
//               </Button>
//             </SignedIn>
//           </div>

//           {/* Email Format Notice */}
//           <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
//             <p className="text-sm text-blue-800">
//               <strong>Important:</strong> Please use your official UIU email address 
//               (format: yourname@department.uiu.ac.bd) to access this system.
//             </p>
//           </div>
//         </div>

//         {/* Features Grid */}
//         <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           <Card className="text-center">
//             <CardHeader>
//               <FileText className="h-12 w-12 text-blue-600 mx-auto" />
//               <CardTitle>Easy Reporting</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 Submit your issues with detailed descriptions and file attachments
//               </CardDescription>
//             </CardContent>
//           </Card>

//           <Card className="text-center">
//             <CardHeader>
//               <Users className="h-12 w-12 text-green-600 mx-auto" />
//               <CardTitle>Transparent Process</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 Track your report's progress from submission to resolution
//               </CardDescription>
//             </CardContent>
//           </Card>

//           <Card className="text-center">
//             <CardHeader>
//               <Shield className="h-12 w-12 text-purple-600 mx-auto" />
//               <CardTitle>Secure & Anonymous</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 Your reports are handled securely with anonymous public viewing
//               </CardDescription>
//             </CardContent>
//           </Card>

//           <Card className="text-center">
//             <CardHeader>
//               <CheckCircle className="h-12 w-12 text-orange-600 mx-auto" />
//               <CardTitle>Quick Resolution</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 Get timely responses and solutions from relevant departments
//               </CardDescription>
//             </CardContent>
//           </Card>
//         </div>

//         {/* How it Works */}
//         <div className="mt-20">
//           <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl font-bold text-blue-600">1</span>
//               </div>
//               <h4 className="text-xl font-semibold mb-2">Submit Report</h4>
//               <p className="text-gray-600">
//                 Log in with your UIU email and submit your issue with details and evidence
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl font-bold text-green-600">2</span>
//               </div>
//               <h4 className="text-xl font-semibold mb-2">Track Progress</h4>
//               <p className="text-gray-600">
//                 Monitor your report as it moves through DSW and departmental review
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl font-bold text-purple-600">3</span>
//               </div>
//               <h4 className="text-xl font-semibold mb-2">Get Resolution</h4>
//               <p className="text-gray-600">
//                 Receive feedback and resolution updates via email and dashboard
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <p>&copy; 2024 United International University. All rights reserved.</p>
//           <p className="mt-2 text-gray-400">
//             Student Problem Reporting System - Making UIU Better Together
//           </p>
//         </div>
//       </footer>
//     </div>
//   )
// }