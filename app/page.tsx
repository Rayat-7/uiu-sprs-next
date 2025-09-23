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












