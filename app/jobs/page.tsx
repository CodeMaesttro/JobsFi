"use client"

import { JobCard } from "@/components/job-card"
import { JobFilters, type FilterCriteria } from "@/components/job-filters"
import { Button } from "@/components/ui/button"
import { Plus, Briefcase, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useJobs } from "@/contexts/job-context"
import { Navbar } from "@/components/navbar"
import { useSubscription } from "@/contexts/subscription-context"
import { useSearchParams } from "next/navigation"

export default function JobsPage() {
  const { getVisibleJobs } = useJobs()
  const { isSubscribed } = useSubscription()
  const searchParams = useSearchParams()
  const [visibleJobs, setVisibleJobs] = useState(getVisibleJobs())
  const [filteredJobs, setFilteredJobs] = useState(visibleJobs)
  const [activeFilters, setActiveFilters] = useState<FilterCriteria | null>(null)

  // Check for newly added job and refresh the job list
  useEffect(() => {
    // Update visible jobs whenever the component mounts or when URL params change
    // This ensures newly added jobs are displayed
    const updatedJobs = getVisibleJobs()
    setVisibleJobs(updatedJobs)

    // If there are active filters, apply them to the updated jobs
    if (activeFilters) {
      applyFilters(activeFilters, updatedJobs)
    } else {
      setFilteredJobs(updatedJobs)
    }
  }, [getVisibleJobs, searchParams])

  const applyFilters = (filters: FilterCriteria, jobsToFilter = visibleJobs) => {
    // Apply filters to the jobs
    let filtered = [...jobsToFilter]

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower),
      )
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((job) => filters.categories.includes(job.category))
    }

    // Filter by locations
    if (filters.locations.length > 0) {
      filtered = filtered.filter((job) => filters.locations.includes(job.location))
    }

    // Filter by salary range
    filtered = filtered.filter((job) => {
      // Extract the numeric values from the salary string
      const salaryText = job.salary.replace(/[^0-9-]/g, "")
      const [minSalary, maxSalary] = salaryText.split("-").map((s) => Number.parseInt(s.trim(), 10))

      // Check if the job's salary range overlaps with the filter range
      const minFilterSalary = filters.salaryRange[0] * 1000
      const maxFilterSalary = filters.salaryRange[1] * 1000

      return (
        (minSalary >= minFilterSalary && minSalary <= maxFilterSalary) ||
        (maxSalary >= minFilterSalary && maxSalary <= maxFilterSalary) ||
        (minSalary <= minFilterSalary && maxSalary >= maxFilterSalary)
      )
    })

    setFilteredJobs(filtered)
    setActiveFilters(filters)
  }

  const handleFilterChange = (filters: FilterCriteria) => {
    applyFilters(filters)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Browse Jobs</h1>
            <p className="text-gray-300">Find your next opportunity in the Web3 space</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {!isSubscribed && (
              <Link href="/subscribe">
                <Button variant="outline" className="border-purple-400 text-white hover:bg-purple-900/20">
                  <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
                  Get Early Access
                </Button>
              </Link>
            )}
            <Link href="/post-job">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                Post a Job
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside>
            <JobFilters onFilterChange={handleFilterChange} />
          </aside>
          <div className="space-y-6">
            {activeFilters && (
              <div className="mb-4 rounded-lg bg-gray-800/50 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Active Filters</h3>
                  <Button
                    variant="link"
                    className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                    onClick={() => {
                      setFilteredJobs(visibleJobs)
                      setActiveFilters(null)
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeFilters.searchTerm && (
                    <span className="rounded-full bg-purple-900/50 px-3 py-1 text-xs text-white">
                      Search: {activeFilters.searchTerm}
                    </span>
                  )}
                  {activeFilters.categories.map((cat) => (
                    <span key={cat} className="rounded-full bg-blue-900/50 px-3 py-1 text-xs text-white">
                      {cat}
                    </span>
                  ))}
                  {activeFilters.locations.map((loc) => (
                    <span key={loc} className="rounded-full bg-green-900/50 px-3 py-1 text-xs text-white">
                      {loc}
                    </span>
                  ))}
                  <span className="rounded-full bg-orange-900/50 px-3 py-1 text-xs text-white">
                    Salary: {activeFilters.salaryRange[0]}K - {activeFilters.salaryRange[1]}K
                  </span>
                </div>
              </div>
            )}

            {!isSubscribed && (
              <div className="mb-6 rounded-lg bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      <h3 className="font-medium text-white">Get Early Access to Jobs</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-300">
                      Subscribe to get early access to job postings before they're publicly available.
                    </p>
                  </div>
                  <Link href="/subscribe">
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {filteredJobs.length === 0 ? (
              <div className="rounded-xl bg-gray-800/50 p-8 text-center backdrop-blur-sm">
                <p className="text-gray-300">No jobs match your filters. Try adjusting your criteria.</p>
              </div>
            ) : (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-400" />
              <span className="text-lg font-bold text-white">JobsFi</span>
            </div>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Web3Jobs. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/about" className="text-sm text-gray-400 hover:text-white">
                About
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
