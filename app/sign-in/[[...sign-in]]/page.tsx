"use client"

import React, { useState } from 'react'
import { SignIn } from "@clerk/nextjs"
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Google Icon Component
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
)

// Testimonials data
const testimonials = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108755-2616b612ad37?w=400&h=400&fit=crop&crop=face",
    name: "Sarah Ahmed",
    handle: "@sarahcse22",
    text: "The reporting system made it so easy to get my hostel issue resolved quickly!"
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    name: "Rafiq Hassan",
    handle: "@rafiq.eee23",
    text: "Transparent and efficient. I could track my complaint from start to finish."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    name: "Nadia Khan",
    handle: "@nadia.bba21",
    text: "Finally, a system where students can report issues and actually see results!"
  }
]

// Glass Input Wrapper
const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-all duration-300 focus-within:border-primary/70 focus-within:bg-primary/10 focus-within:shadow-lg">
    {children}
  </div>
)

// Testimonial Card
const TestimonialCard = ({ testimonial, delay }: { testimonial: typeof testimonials[0], delay: string }) => (
  <div className={`animate-fade-in-up ${delay} flex items-start gap-3 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 w-64 hover:bg-white/15 transition-all duration-300`}>
    <img 
      src={testimonial.avatarSrc} 
      className="h-10 w-10 object-cover rounded-2xl border-2 border-white/20" 
      alt="avatar" 
    />
    <div className="text-sm leading-snug">
      <p className="font-medium text-white">{testimonial.name}</p>
      <p className="text-white/70 text-xs">{testimonial.handle}</p>
      <p className="mt-1 text-white/90">{testimonial.text}</p>
    </div>
  </div>
)

export default function SignInPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side - Sign in form */}
      <section className="flex-1 flex items-center justify-center p-8 relative">
        {/* Back to home button */}
        <Link 
          href="/"
          className="absolute top-6 left-6 flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-300 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm">Back to Home</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">UIUSPRS</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in with your UIU email to access the reporting system
              </p>
            </div>

            {/* Email Format Notice */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary text-sm">UIU Email Required</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Use format: <code className="bg-muted px-1 py-0.5 rounded">yourname@department.uiu.ac.bd</code>
              </p>
            </div>

            {/* Clerk Sign In Component */}
            <div className="flex justify-center">
              <SignIn 
                afterSignInUrl="/public"
                redirectUrl="/public"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-background/80 backdrop-blur-md border border-border/50 shadow-2xl",
                    headerTitle: "text-foreground",
                    headerSubtitle: "text-muted-foreground",
                    socialButtonsBlockButton: "bg-background border border-border hover:bg-accent transition-colors duration-300",
                    socialButtonsBlockButtonText: "text-foreground",
                    formButtonPrimary: "bg-primary hover:bg-primary/90 transition-colors duration-300",
                    formFieldInput: "bg-background/50 border border-border focus:border-primary/50 transition-colors duration-300",
                    footerActionLink: "text-primary hover:text-primary/80 transition-colors duration-300"
                  },
                  layout: {
                    socialButtonsVariant: "blockButton",
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Right side - Hero image with testimonials */}
      <section className="hidden md:block flex-1 relative p-4">
        <div 
          className="absolute inset-4 rounded-3xl bg-gradient-to-b from-orange-300 via-red-900 to-orange-600 shadow-2xl"
          style={{
            backgroundImage: `background: linear-gradient(to bottom, #fdba74, #ffffff, #c2410c);;, url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=1000&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay pattern */}
          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] rounded-3xl opacity-30"></div> */}
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-8 rounded-3xl">
            <div className="text-center space-y-4 mt-12">
              <h2 className="text-3xl font-bold text-white">
                Join the UIU Community
              </h2>
              <p className="text-white/80 text-lg max-w-md mx-auto">
                Transparent reporting system designed by students, for students
              </p>
              <div className="flex items-center justify-center space-x-4 text-white/70">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1000+</div>
                  <div className="text-sm">Reports Resolved</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">95%</div>
                  <div className="text-sm">Success Rate</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm">Available</div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="flex gap-4 justify-center overflow-hidden">
              <TestimonialCard testimonial={testimonials[0]} delay="delay-300" />
              <div className="hidden xl:flex">
                <TestimonialCard testimonial={testimonials[1]} delay="delay-500" />
              </div>
              <div className="hidden 2xl:flex">
                <TestimonialCard testimonial={testimonials[2]} delay="delay-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  )
}