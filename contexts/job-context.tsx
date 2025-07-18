"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNotifications } from "@/contexts/notification-context"
import { useSubscription } from "@/contexts/subscription-context"
import { useWeb3 } from "@/hooks/use-web3"

// Define job type
export interface Job {
  id: number
  title: string
  company: string
  location: string
  salary: string
  description: string
  employer: string
  category: string
  isOpen: boolean
  postedAt?: string
  createdByWallet?: string // Wallet address of the creator
  isEarlyAccess?: boolean
  publicReleaseDate?: string
}

// Define application type
export interface JobApplication {
  id: number
  jobId: number
  applicant: string // Wallet address
  applicantName: string
  resumeIpfs: string
  message: string
  status: "pending" | "accepted" | "rejected"
  appliedAt: string
}

// Initial mock jobs
const initialJobs: Job[] = [
  {
    id: 1,
    title: "Senior Solidity Developer",
    company: "DeFi Protocol",
    location: "Remote",
    salary: "120,000 - 150,000 USDC",
    description: "We're looking for an experienced Solidity developer to help build our next-generation DeFi protocol.",
    employer: "0x1234...5678",
    category: "Development",
    isOpen: true,
    postedAt: "2023-04-01",
  },
  {
    id: 2,
    title: "Blockchain UI/UX Designer",
    company: "NFT Marketplace",
    location: "New York, USA",
    salary: "90,000 - 110,000 USDC",
    description: "Design beautiful and intuitive interfaces for our NFT marketplace.",
    employer: "0xabcd...efgh",
    category: "Design",
    isOpen: true,
    postedAt: "2023-04-05",
  },
  {
    id: 3,
    title: "Smart Contract Auditor",
    company: "Security DAO",
    location: "Remote",
    salary: "130,000 - 160,000 USDC",
    description: "Help secure the future of Web3 by auditing smart contracts for vulnerabilities.",
    employer: "0x7890...1234",
    category: "Security",
    isOpen: true,
    postedAt: "2023-03-20",
  },
  {
    id: 4,
    title: "Community Manager",
    company: "GameFi Project",
    location: "Remote",
    salary: "70,000 - 90,000 USDC",
    description: "Grow and manage our community across Discord, Twitter, and other platforms.",
    employer: "0xijkl...mnop",
    category: "Marketing",
    isOpen: true,
    postedAt: "2023-03-15",
  },
  {
    id: 5,
    title: "Tokenomics Specialist",
    company: "Layer 2 Solution",
    location: "Berlin, Germany",
    salary: "100,000 - 130,000 USDC",
    description: "Design and implement sustainable tokenomics models for our Layer 2 ecosystem.",
    employer: "0xqrst...uvwx",
    category: "Economics",
    isOpen: true,
    postedAt: "2023-03-10",
  },
  {
    id: 6,
    title: "Frontend Developer (React)",
    company: "Web3 Wallet",
    location: "Remote",
    salary: "90,000 - 120,000 USDC",
    description: "Build beautiful, responsive interfaces for our Web3 wallet application.",
    employer: "0x2468...1357",
    category: "Development",
    isOpen: true,
    postedAt: "2023-03-05",
  },
]

// Initial mock applications
const initialApplications: JobApplication[] = [
  {
    id: 1,
    jobId: 1,
    applicant: "0xabcd...1234",
    applicantName: "John Doe",
    resumeIpfs: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    message:
      "I have 5 years of experience with Solidity and have worked on multiple DeFi protocols. I'm excited about the opportunity to join your team.",
    status: "pending",
    appliedAt: "2023-04-05",
  },
  {
    id: 2,
    jobId: 1,
    applicant: "0xefgh...5678",
    applicantName: "Jane Smith",
    resumeIpfs: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    message:
      "I've been developing smart contracts for 3 years and have a strong background in security auditing. I'm particularly interested in your DeFi platform.",
    status: "pending",
    appliedAt: "2023-04-06",
  },
  {
    id: 3,
    jobId: 1,
    applicant: "0xijkl...9012",
    applicantName: "Alex Johnson",
    resumeIpfs: "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
    message:
      "I'm a senior blockchain developer with experience in Ethereum, Solana, and Polkadot. I've built several DeFi applications and would love to contribute to your project.",
    status: "pending",
    appliedAt: "2023-04-07",
  },
  {
    id: 4,
    jobId: 2,
    applicant: "0xmnop...3456",
    applicantName: "Sam Wilson",
    resumeIpfs: "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn",
    message:
      "I have extensive experience in smart contract auditing and have helped secure several high-profile DeFi protocols.",
    status: "pending",
    appliedAt: "2023-03-20",
  },
]

// Create context type
interface JobContextType {
  jobs: Job[]
  applications: JobApplication[]
  addJob: (job: Omit<Job, "id" | "isOpen" | "postedAt">) => void
  updateJob: (id: number, jobData: Partial<Job>) => void
  deleteJob: (id: number) => void
  closeJob: (id: number) => void
  applyToJob: (application: Omit<JobApplication, "id" | "status" | "appliedAt">) => void
  updateApplicationStatus: (id: number, status: "accepted" | "rejected") => void
  getJobApplications: (jobId: number) => JobApplication[]
  getUserApplications: (walletAddress: string) => JobApplication[]
  getUserJobs: (walletAddress: string) => Job[]
  getVisibleJobs: () => Job[]
}

// Create context with default values
const JobContext = createContext<JobContextType>({
  jobs: initialJobs,
  applications: [],
  addJob: () => {},
  updateJob: () => {},
  deleteJob: () => {},
  closeJob: () => {},
  applyToJob: () => {},
  updateApplicationStatus: () => {},
  getJobApplications: () => [],
  getUserApplications: () => [],
  getUserJobs: () => [],
  getVisibleJobs: () => [],
})

// Create provider component
export function JobProvider({ children }: { children: ReactNode }) {
  const { address } = useWeb3()
  const { addNotification } = useNotifications()
  const { isSubscribed, subscribedCategories } = useSubscription()

  // Initialize state with jobs from localStorage if available, otherwise use initialJobs
  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window !== "undefined") {
      const savedJobs = localStorage.getItem("jobsfi")
      return savedJobs ? JSON.parse(savedJobs) : initialJobs
    }
    return initialJobs
  })

  // Initialize applications from localStorage if available, otherwise use initialApplications
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    if (typeof window !== "undefined") {
      const savedApplications = localStorage.getItem("jobsfi_applications")
      return savedApplications ? JSON.parse(savedApplications) : initialApplications
    }
    return initialApplications
  })

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jobsfi", JSON.stringify(jobs))
    }
  }, [jobs])

  // Save applications to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jobsfi_applications", JSON.stringify(applications))
    }
  }, [applications])

  // Add a new job
  const addJob = (jobData: Omit<Job, "id" | "isOpen" | "postedAt">) => {
    const now = new Date()

    // Set early access period based on job category
    let isEarlyAccess = false
    let publicReleaseDate = null

    // If the job is in a category that has subscribers, make it early access
    if (jobData.category) {
      // Create a release date 3 days from now for early access
      const releaseDate = new Date(now)
      releaseDate.setDate(releaseDate.getDate() + 3)

      isEarlyAccess = true
      publicReleaseDate = releaseDate.toISOString()

      // Send notifications to subscribers who are interested in this category
      console.log(`Sending early access notifications for ${jobData.category} job to subscribers`)
    }

    const newJob: Job = {
      ...jobData,
      id: jobs.length > 0 ? Math.max(...jobs.map((job) => job.id)) + 1 : 1,
      isOpen: true,
      postedAt: now.toISOString().split("T")[0], // Format: YYYY-MM-DD
      createdByWallet: address || undefined,
      isEarlyAccess,
      publicReleaseDate,
    }

    // Update the jobs state with the new job at the beginning of the array
    const updatedJobs = [newJob, ...jobs]
    setJobs(updatedJobs)

    // Immediately save to localStorage to ensure persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("jobsfi", JSON.stringify(updatedJobs))
    }

    console.log("Job added successfully:", newJob)
    return newJob.id // Return the new job ID for reference
  }

  // Update an existing job
  const updateJob = (id: number, jobData: Partial<Job>) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, ...jobData } : job)))
  }

  // Delete a job
  const deleteJob = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id))
    // Also remove all applications for this job
    setApplications(applications.filter((app) => app.jobId !== id))
  }

  // Close a job
  const closeJob = (id: number) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, isOpen: false } : job)))
  }

  // Apply to a job
  const applyToJob = (applicationData: Omit<JobApplication, "id" | "status" | "appliedAt">) => {
    const newApplication: JobApplication = {
      ...applicationData,
      id: applications.length > 0 ? Math.max(...applications.map((app) => app.id)) + 1 : 1,
      status: "pending",
      appliedAt: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
    }
    setApplications([newApplication, ...applications])

    // Find the job
    const job = jobs.find((j) => j.id === applicationData.jobId)

    // Send notification to the job creator
    if (job && job.createdByWallet) {
      addNotification({
        walletAddress: job.createdByWallet,
        type: "application",
        title: "New Job Application",
        message: `${applicationData.applicantName} has applied to your job: ${job.title}`,
        data: {
          jobId: job.id,
          applicationId: newApplication.id,
        },
      })
    }
  }

  // Update application status
  const updateApplicationStatus = (id: number, status: "accepted" | "rejected") => {
    setApplications(
      applications.map((app) => {
        if (app.id === id) {
          // Send notification to the applicant
          const job = jobs.find((j) => j.id === app.jobId)
          if (job) {
            addNotification({
              walletAddress: app.applicant,
              type: "job_status",
              title: status === "accepted" ? "Application Accepted!" : "Application Status Update",
              message:
                status === "accepted"
                  ? `Your application for ${job.title} has been accepted! The employer will contact you soon.`
                  : `Your application for ${job.title} has been reviewed. Unfortunately, the position has been filled.`,
              data: {
                jobId: job.id,
                applicationId: app.id,
                status,
              },
            })
          }
          return { ...app, status }
        }
        return app
      }),
    )
  }

  // Get all applications for a specific job
  const getJobApplications = (jobId: number) => {
    return applications.filter((app) => app.jobId === jobId)
  }

  // Get all applications for a specific user
  const getUserApplications = (walletAddress: string) => {
    return applications.filter((app) => app.applicant === walletAddress)
  }

  // Get all jobs created by a specific user
  const getUserJobs = (walletAddress: string) => {
    return jobs.filter((job) => job.createdByWallet === walletAddress)
  }

  // Get all jobs that should be visible to the current user
  const getVisibleJobs = () => {
    const now = new Date()

    return jobs.filter((job) => {
      // If the job is not in early access mode, it's visible to everyone
      if (!job.isEarlyAccess) return true

      // If the job's public release date has passed, it's visible to everyone
      if (job.publicReleaseDate && new Date(job.publicReleaseDate) <= now) return true

      // If the user is not subscribed, they can't see early access jobs
      if (!isSubscribed) return false

      // If the user has an unlimited subscription, they can see all early access jobs
      if (subscribedCategories.includes("all")) return true

      // If the user is subscribed to this job's category, they can see it
      return subscribedCategories.includes(job.category)
    })
  }

  return (
    <JobContext.Provider
      value={{
        jobs,
        applications,
        addJob,
        updateJob,
        deleteJob,
        closeJob,
        applyToJob,
        updateApplicationStatus,
        getJobApplications,
        getUserApplications,
        getUserJobs,
        getVisibleJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  )
}

// Custom hook to use the job context
export function useJobs() {
  const context = useContext(JobContext)
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider")
  }
  return context
}
