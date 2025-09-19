"use client"

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Shield, FileText, Users, TrendingUp, CheckCircle, ArrowRight, Star } from 'lucide-react'

export default function LandingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    // If user is authenticated, redirect to public page
    if (isLoaded && user) {
      console.log("Landing - User is authenticated, redirecting to public")
      router.push('/public')
    }
  }, [isLoaded, user, router])

  // Don't render landing page if user is authenticated
  if (isLoaded && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: FileText,
      title: "Easy Reporting",
      description: "Submit reports quickly with file attachments and detailed descriptions"
    },
    {
      icon: TrendingUp,
      title: "Real-time Tracking",
      description: "Track your report's progress from submission to resolution"
    },
    {
      icon: Users,
      title: "Transparent Process",
      description: "See how reports are handled by DSW and department administrators"
    },
    {
      icon: CheckCircle,
      title: "Quick Resolution",
      description: "Efficient workflow ensures faster problem resolution"
    }
  ]

  const stats = [
    { number: "1000+", label: "Reports Resolved" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Available" },
    { number: "48hrs", label: "Avg Response Time" }
  ]

  const testimonials = [
    {
      name: "Sarah Ahmed",
      role: "Computer Science Student",
      content: "The reporting system made it so easy to get my hostel issue resolved quickly!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612ad37?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Rafiq Hassan",
      role: "Engineering Student", 
      content: "Transparent and efficient. I could track my complaint from start to finish.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Nadia Khan",
      role: "Business Student",
      content: "Finally, a system where students can report issues and actually see results!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">UIUSPRS</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                United International University
                <span className="block text-primary">Student Problem Reporting System</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A transparent, efficient platform for UIU students to report issues and track their resolution process from submission to completion.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 py-3"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center justify-center rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 py-3">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose UIUSPRS?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by students, for students. Our system ensures your voice is heard and your issues are resolved efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4 p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to get your issues resolved</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Submit Report</h3>
              <p className="text-muted-foreground">Sign in with your UIU email and submit your issue with details and evidence</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="text-muted-foreground">Monitor your report as it moves through DSW admin to department resolution</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Get Resolution</h3>
              <p className="text-muted-foreground">Receive updates and final resolution with feedback via email</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">What Students Say</h2>
            <p className="text-xl text-muted-foreground">Real feedback from UIU students</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl opacity-90">
            Join thousands of UIU students who are already using UIUSPRS to resolve their campus issues efficiently.
          </p>
          <Link 
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8 py-3"
          >
            Sign In with UIU Email
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">UIUSPRS</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 United International University. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )}













// import { SignedIn, SignedOut } from "@clerk/nextjs"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { FileText, Users, Shield, CheckCircle, ArrowRight, Zap, Eye, Clock } from "lucide-react"
// import { redirect } from "next/navigation"
// import { auth } from "@clerk/nextjs/server"
// import Link from "next/link"

// export default async function LandingPage() {
//   // Check if user is already signed in
//   const { userId } = await auth()
  
//   if (userId) {
//     redirect("/public")
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
//       </div>

//       {/* Subtle Grid Pattern */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>

//       {/* Navigation */}
//       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <div className="relative">
//                 <Shield className="h-8 w-8 text-primary animate-pulse" />
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
//               </div>
//               <div>
//                 <span className="text-xl font-bold text-foreground">UIUSPRS</span>
//                 <Badge variant="secondary" className="ml-2 text-xs animate-bounce" style={{ animationDelay: '0.5s' }}>v2.0</Badge>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <SignedOut>
//                 <Link href="/sign-in">
//                   <Button className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
//                     <Shield className="mr-2 h-4 w-4" />
//                     Sign In with UIU Email
//                   </Button>
//                 </Link>
//               </SignedOut>
//               <SignedIn>
//                 <Button 
//                   onClick={() => window.location.href = "/public"}
//                   className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                 >
//                   <ArrowRight className="mr-2 h-4 w-4" />
//                   Continue to Dashboard
//                 </Button>
//               </SignedIn>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative py-20 lg:py-32">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="text-center space-y-8">
//             <div className="space-y-4 animate-fade-in-up">
//               <Badge variant="outline" className="px-4 py-1 text-sm font-medium animate-bounce bg-white/50 backdrop-blur-sm">
//                 🚀 Now Live - Enhanced Reporting System
//               </Badge>
//               <h1 className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
//                 <span className="block">United International</span>
//                 <span className="block text-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
//                   University
//                 </span>
//               </h1>
//               <h2 className="text-2xl font-semibold text-muted-foreground mt-4 sm:text-3xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
//                 Student Problem Reporting System
//               </h2>
//             </div>
            
//             <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.6s' }}>
//               A modern, transparent platform designed for UIU students to report issues, 
//               track progress in real-time, and receive timely responses from university authorities.
//             </p>

//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in" style={{ animationDelay: '0.8s' }}>
//               <SignedOut>
//                 <Link href="/sign-in">
//                   <Button 
//                     size="lg" 
//                     className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-float"
//                   >
//                     <Shield className="mr-2 h-5 w-5" />
//                     Get Started Now
//                   </Button>
//                 </Link>
//               </SignedOut>
//               <SignedIn>
//                 <Button 
//                   size="lg" 
//                   onClick={() => window.location.href = "/public"}
//                   className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                 >
//                   <ArrowRight className="mr-2 h-5 w-5" />
//                   Continue to Dashboard
//                 </Button>
//               </SignedIn>
              
//               {/* <Button 
//                 variant="outline" 
//                 size="lg"
//                 className="text-lg px-8 py-4 rounded-xl border-2 hover:bg-accent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-105"
//                 onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
//               >
//                 <Eye className="mr-2 h-5 w-5" />
//                 Learn More
//               </Button> */}
//             </div>

//             {/* Email Format Notice with enhanced styling */}
//             <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-2xl max-w-2xl mx-auto backdrop-blur-sm animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '1s' }}>
//               <div className="flex items-center justify-center space-x-2 mb-2">
//                 <Shield className="h-5 w-5 text-primary animate-pulse" />
//                 <span className="font-semibold text-primary">UIU Email Required</span>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 Please use your official UIU email address (format: <code className="bg-muted px-2 py-1 rounded font-mono text-primary">yourname@department.uiu.ac.bd</code>) to access the system.
//               </p>
//             </div>

//             {/* Floating Elements */}
//             <div className="absolute top-1/4 left-10 animate-float" style={{ animationDelay: '1s' }}>
//               <div className="w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
//             </div>
//             <div className="absolute bottom-1/4 right-10 animate-float" style={{ animationDelay: '2s' }}>
//               <div className="w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Grid with enhanced animations */}
//       <section id="features" className="py-20 bg-muted/30 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h3 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">Why Choose UIUSPRS?</h3>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
//               Built with modern technology to ensure transparency, efficiency, and user-friendly experience
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-white/50 backdrop-blur-sm animate-fade-in-up">
//               <CardHeader>
//                 <div className="mx-auto w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors group-hover:scale-110 duration-300 mb-4">
//                   <FileText className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <CardTitle className="text-xl">Easy Reporting</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription className="text-base">
//                   Submit detailed reports with file attachments through an intuitive interface designed for students
//                 </CardDescription>
//               </CardContent>
//             </Card>

//             <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-white/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
//               <CardHeader>
//                 <div className="mx-auto w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors group-hover:scale-110 duration-300 mb-4">
//                   <Eye className="h-6 w-6 text-green-600" />
//                 </div>
//                 <CardTitle className="text-xl">Full Transparency</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription className="text-base">
//                   Track your report's journey from submission to resolution with real-time updates and progress indicators
//                 </CardDescription>
//               </CardContent>
//             </Card>

//             <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-white/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//               <CardHeader>
//                 <div className="mx-auto w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors group-hover:scale-110 duration-300 mb-4">
//                   <Shield className="h-6 w-6 text-purple-600" />
//                 </div>
//                 <CardTitle className="text-xl">Secure & Private</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription className="text-base">
//                   Your reports are handled securely with anonymous public viewing to protect student privacy
//                 </CardDescription>
//               </CardContent>
//             </Card>

//             <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-white/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
//               <CardHeader>
//                 <div className="mx-auto w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors group-hover:scale-110 duration-300 mb-4">
//                   <Zap className="h-6 w-6 text-orange-600" />
//                 </div>
//                 <CardTitle className="text-xl">Fast Resolution</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription className="text-base">
//                   Streamlined workflow ensures quick assignment to departments and timely resolution of issues
//                 </CardDescription>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* How it Works with enhanced animations */}
//       <section className="py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h3 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">How It Works</h3>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
//               A simple, transparent process designed to resolve student issues efficiently
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//             <div className="text-center relative animate-fade-in-up">
//               <div className="relative">
//                 <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-float hover:scale-110 transition-transform duration-300">
//                   <span className="text-3xl font-bold text-white">1</span>
//                 </div>
//                 <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transform translate-x-10 animate-pulse"></div>
//               </div>
//               <h4 className="text-xl font-semibold mb-4">Submit Your Report</h4>
//               <p className="text-muted-foreground leading-relaxed">
//                 Log in with your UIU email and submit detailed reports with evidence. Our system ensures one quality report per week.
//               </p>
//             </div>
            
//             <div className="text-center relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//               <div className="relative">
//                 <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-float hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>
//                   <span className="text-3xl font-bold text-white">2</span>
//                 </div>
//                 <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-500 to-purple-500 transform translate-x-10 animate-pulse"></div>
//               </div>
//               <h4 className="text-xl font-semibold mb-4">Track Progress</h4>
//               <p className="text-muted-foreground leading-relaxed">
//                 Watch your report move through DSW review, department assignment, and resolution phases with live updates.
//               </p>
//             </div>
            
//             <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
//               <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-float hover:scale-110 transition-transform duration-300" style={{ animationDelay: '1s' }}>
//                 <span className="text-3xl font-bold text-white">3</span>
//               </div>
//               <h4 className="text-xl font-semibold mb-4">Get Resolution</h4>
//               <p className="text-muted-foreground leading-relaxed">
//                 Receive detailed feedback and resolution updates via email and dashboard notifications once completed.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section with animations */}
//       <section className="py-20 bg-primary/5 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
//             <div className="space-y-2 animate-fade-in-up hover:scale-105 transition-transform duration-300">
//               <div className="text-4xl font-bold text-primary animate-pulse">100%</div>
//               <div className="text-muted-foreground">Transparent Process</div>
//             </div>
//             <div className="space-y-2 animate-fade-in-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
//               <div className="text-4xl font-bold text-primary animate-pulse">24/7</div>
//               <div className="text-muted-foreground">System Availability</div>
//             </div>
//             <div className="space-y-2 animate-fade-in-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
//               <div className="text-4xl font-bold text-primary animate-pulse">Secure</div>
//               <div className="text-muted-foreground">Data Protection</div>
//             </div>
//             <div className="space-y-2 animate-fade-in-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.3s' }}>
//               <div className="text-4xl font-bold text-primary animate-pulse">Fast</div>
//               <div className="text-muted-foreground">Issue Resolution</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="py-20">
//         <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//           <div className="space-y-8">
//             <h3 className="text-3xl font-bold text-foreground animate-fade-in">Ready to Get Started?</h3>
//             <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
//               Join the UIU community in creating a better campus experience through transparent communication.
//             </p>
            
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
//               <SignedOut>
//                 <Link href="/sign-in">
//                   <Button 
//                     size="lg" 
//                     className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-float"
//                   >
//                     <Shield className="mr-2 h-5 w-5" />
//                     Sign In & Start Reporting
//                   </Button>
//                 </Link>
//               </SignedOut>
//               <SignedIn>
//                 <Button 
//                   size="lg" 
//                   onClick={() => window.location.href = "/public"}
//                   className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                 >
//                   <ArrowRight className="mr-2 h-5 w-5" />
//                   Go to Your Dashboard
//                 </Button>
//               </SignedIn>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-muted/50 border-t border-border py-12 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center space-y-4">
//             <div className="flex items-center justify-center space-x-2">
//               <Shield className="h-6 w-6 text-primary animate-pulse" />
//               <span className="text-lg font-semibold">UIUSPRS</span>
//               <Badge variant="outline" className="animate-bounce">v2.0</Badge>
//             </div>
//             <p className="text-muted-foreground">
//               &copy; 2024 United International University. All rights reserved.
//             </p>
//             <p className="text-sm text-muted-foreground">
//               Student Problem Reporting System - Making UIU Better Together 🚀
//             </p>
//           </div>
//         </div>
//       </footer>

//       {/* <style jsx>{`
//         @keyframes fade-in {
//           0% { opacity: 0; }
//           100% { opacity: 1; }
//         }
//         @keyframes fade-in-up {
//           0% {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes slide-up {
//           0% {
//             opacity: 0;
//             transform: translateY(50px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//         }
//         @keyframes gradient {
//           0%, 100% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.8s ease-out forwards;
//         }
//         .animate-fade-in-up {
//           animation: fade-in-up 0.8s ease-out forwards;
//         }
//         .animate-slide-up {
//           animation: slide-up 1s ease-out forwards;
//         }
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
//         .animate-gradient {
//           background-size: 200% 200%;
//           animation: gradient 3s ease infinite;
//         }
//       `}</style> */}
//     </div>
//   )
// }















