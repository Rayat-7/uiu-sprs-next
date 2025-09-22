import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// UIUSPRS Knowledge Base for context
const uiusprsContext = `
You are UIUSPRS Assistant, a helpful AI chatbot for the United International University Student Problem Reporting System (UIUSPRS).

SYSTEM OVERVIEW:
UIUSPRS is a transparent platform for UIU students to report issues, track progress, and receive responses from university authorities. The system ensures accountability and provides real-time tracking of student complaints.

KEY RULES & POLICIES:
- Only UIU students with valid @department.uiu.ac.bd emails can access the system
- Students can submit ONE report per week to ensure quality and prevent spam
- Reports follow this workflow: Submission → DSW Review → Department Assignment → Resolution → Approval → Completion
- All reports are displayed anonymously in public view to protect student privacy
- File uploads supported: PNG, JPG, PDF (maximum 5MB each)
- Priority levels: LOW (minor issues), MEDIUM (standard problems), HIGH (urgent matters), URGENT (critical/safety issues)

REPORT CATEGORIES & DEPARTMENTS:
1. Academic Issues: Course registration, grading disputes, faculty concerns, examination problems, curriculum feedback
   → Handled by: Academic Affairs Department
   
2. Facility Problems: Classroom issues, laboratory problems, building maintenance, infrastructure concerns, utility failures
   → Handled by: Facilities Management Department
   
3. Administrative Issues: Admission queries, documentation problems, policy clarifications, procedural concerns
   → Handled by: Administration Office
   
4. IT Support: WiFi problems, computer lab issues, online platform problems, account access issues, system bugs
   → Handled by: IT Department
   
5. Library Services: Book availability, study space issues, library facilities, research support, opening hours
   → Handled by: Library Administration
   
6. Cafeteria/Food Services: Food quality, service issues, hygiene concerns, pricing, facility cleanliness
   → Handled by: Food Services Department
   
7. Transportation: Bus service issues, route problems, schedule concerns, safety matters, driver behavior
   → Handled by: Transport Department
   
8. Hostel/Accommodation: Room issues, facility problems, hostel policies, maintenance requests, safety concerns
   → Handled by: Hostel Administration
   
9. Financial Issues: Fee-related queries, scholarship questions, payment problems, refund requests, billing errors
   → Handled by: Finance Office
   
10. Other: Issues not fitting other categories
    → Handled by: DSW Office (reassigned as needed)

REPORT STATUSES (Track Progress):
- SUBMITTED: Report received, awaiting DSW admin review (24-48 hours)
- ASSIGNED_TO_DEPARTMENT: Sent to relevant department for handling
- IN_PROGRESS: Department admin is actively working on resolution
- RESOLVED: Department has provided solution, awaiting DSW approval
- APPROVED: DSW has verified and approved the resolution
- COMPLETED: Case closed, student notified via email

USER ROLES & RESPONSIBILITIES:
- STUDENT: Can submit reports, track progress, view public feed
- DSW_ADMIN: Reviews submissions, assigns to departments, approves resolutions
- DEPT_ADMIN: Handles assigned reports, provides solutions and feedback

SUBMISSION BEST PRACTICES:
- Be specific and detailed in descriptions
- Include dates, times, locations, and people involved (if appropriate)
- Attach evidence (photos, documents) when possible
- Choose the most appropriate category for faster routing
- Set priority honestly - don't overuse URGENT
- Provide contact information for follow-up if needed

RESOLUTION TIMELINES (Approximate):
- Simple issues: 3-7 days
- Complex problems: 1-2 weeks  
- Infrastructure/facility issues: 2-4 weeks
- Policy/administrative matters: 1-3 weeks
- Urgent/safety issues: 24-48 hours

TROUBLESHOOTING COMMON ISSUES:
- Login Problems: Verify UIU email format, clear browser cache, try incognito mode
- Report Not Submitting: Check required fields, file size limits, internet connection
- Missing Notifications: Check spam folder, verify UIU email is active
- Can't Track Reports: Reports appear immediately in Student Dashboard after submission
- File Upload Issues: Ensure PNG/JPG/PDF under 5MB, try different browser

SYSTEM FEATURES:
- Real-time progress tracking
- Email notifications at each stage
- Anonymous public viewing for transparency
- Mobile-responsive design
- Secure file upload with evidence support
- Administrative workflow management
- Statistical reporting and analytics

Always provide helpful, accurate, and encouraging responses. If users ask about topics outside UIUSPRS scope, politely redirect them back to system-related questions. Be supportive and professional, understanding that students may be frustrated with their issues.
`

interface ChatRequest {
  message: string
  conversation?: Array<{
    type: 'user' | 'bot'
    content: string
  }>
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'Please sign in with your UIU email to use the AI assistant' 
      }, { status: 401 })
    }

    // Parse request body
    const body: ChatRequest = await req.json()
    const { message, conversation } = body

    if (!message?.trim()) {
      return NextResponse.json({ 
        error: 'Message is required' 
      }, { status: 400 })
    }

    // Get user context for personalized responses
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        reports: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true,
            priority: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5 // Get last 5 reports for context
        }
      }
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found in database' 
      }, { status: 404 })
    }

    // Build user context for personalized responses
    let userContext = `
USER PROFILE:
- Role: ${user.role}
- Name: ${user.firstName || 'Student'} ${user.lastName || ''}
- Email: ${user.email}
- Recent Reports: ${user.reports.length > 0 ? 
  user.reports.map(r => 
    `"${r.title}" (Status: ${r.status}, Category: ${r.category}, Priority: ${r.priority}, Date: ${r.createdAt.toLocaleDateString()})`
  ).join(' | ') : 
  'No reports submitted yet'
}`

    // Check weekly submission limit
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const recentReport = await prisma.report.findFirst({
      where: {
        studentId: user.id,
        createdAt: { gte: oneWeekAgo },
      },
    })

    const canSubmitReport = !recentReport
    userContext += `\n- Can Submit New Report: ${canSubmitReport ? 'YES' : 'NO (Weekly limit reached)'}`

    if (!canSubmitReport && recentReport) {
      const nextSubmissionDate = new Date(recentReport.createdAt)
      nextSubmissionDate.setDate(nextSubmissionDate.getDate() + 7)
      userContext += `\n- Next Submission Available: ${nextSubmissionDate.toLocaleDateString()}`
    }

    // Build conversation history for context
    let conversationHistory = ''
    if (conversation && conversation.length > 0) {
      conversationHistory = '\nRECENT CONVERSATION:\n' + 
        conversation.slice(-6).map((msg) => 
          `${msg.type === 'user' ? 'Student' : 'Assistant'}: ${msg.content}`
        ).join('\n')
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })

    // Create comprehensive prompt
    const prompt = `
${uiusprsContext}

${userContext}
${conversationHistory}

CURRENT STUDENT MESSAGE: "${message}"

INSTRUCTIONS FOR RESPONSE:
1. Respond as UIUSPRS Assistant in a helpful, friendly, and professional tone
2. Use the user context to provide personalized responses when relevant
3. If the student asks about their reports, reference their actual submission history
4. Provide specific, actionable guidance with clear next steps
5. If asked about topics outside UIUSPRS, politely redirect to system-related topics
6. Keep responses concise but comprehensive (aim for 2-4 sentences, max 300 words)
7. Use appropriate emojis sparingly (1-2 per response maximum)
8. If suggesting actions, be specific about where to find features in the system
9. Always be encouraging and supportive, especially if student seems frustrated
10. Include relevant warnings or reminders about rules when appropriate

IMPORTANT: Base your response on the actual user data provided above. If they have reports, mention their status. If they can't submit, explain the weekly limit clearly.

Respond now as UIUSPRS Assistant:
`

    // Generate response using Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    let botResponse = response.text()

    // Clean up the response
    botResponse = botResponse.trim()

    // Generate contextual quick actions based on response content and user state
    const quickActions = []
    
    // Add submit action only if user can submit
    if ((botResponse.toLowerCase().includes('submit') || message.toLowerCase().includes('submit')) && canSubmitReport) {
      quickActions.push({
        label: 'Submit New Report',
        action: 'navigate',
        url: '/dashboard/student'
      })
    }
    
    // Add dashboard action for tracking
    if (botResponse.toLowerCase().includes('track') || botResponse.toLowerCase().includes('dashboard') || user.reports.length > 0) {
      quickActions.push({
        label: 'View My Reports',
        action: 'navigate',
        url: '/dashboard/student'
      })
    }
    
    // Add rules/help actions
    if (botResponse.toLowerCase().includes('rule') || botResponse.toLowerCase().includes('policy') || botResponse.toLowerCase().includes('guideline')) {
      quickActions.push({
        label: 'Learn More Rules',
        action: 'chat',
        message: 'What are all the important rules I should know?'
      })
    }

    // Add troubleshooting help
    if (botResponse.toLowerCase().includes('problem') || botResponse.toLowerCase().includes('issue') || botResponse.toLowerCase().includes('error')) {
      quickActions.push({
        label: 'Get Help',
        action: 'chat',
        message: 'I need technical help with the system'
      })
    }

    return NextResponse.json({
      response: botResponse,
      quickActions: quickActions.slice(0, 4), // Limit to 4 actions
      canSubmitReport,
      userReports: user.reports.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Gemini API Error:', error)
    
    // Detailed error logging for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    
    // Provide helpful fallback response
    const fallbackResponse = `I apologize, but I'm experiencing technical difficulties right now. 🔧

Here's some quick help while I get back online:

**Common Actions:**
• Submit reports: Go to Student Dashboard
• Track reports: Check your dashboard for status updates  
• Weekly limit: Only 1 report per week allowed
• File uploads: PNG, JPG, PDF files under 5MB
• Urgent issues: Use URGENT priority for safety matters

**Need immediate help?** Contact the DSW office directly for urgent matters.

Please try asking me again in a moment!`

    return NextResponse.json({
      response: fallbackResponse,
      quickActions: [
        { label: 'Go to Dashboard', action: 'navigate', url: '/dashboard/student' },
        { label: 'Try Again', action: 'chat', message: 'Can you help me now?' }
      ],
      error: 'Temporary service unavailable',
      timestamp: new Date().toISOString()
    }, { status: 200 }) // Return 200 to avoid breaking the UI
  }
}