"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Users, Wallet, Sparkles } from "lucide-react"
import Link from "next/link"
import { StatsCard } from "@/components/stats-card"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Connect, Apply, and Get Hired{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                The Web3 Way
              </span>
            </h1>
            <p className="mb-8 text-lg text-gray-300">
              The decentralized job board connecting Web3 talent with innovative projects and companies. Powered by
              blockchain technology for transparency and security.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/post-job">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-6 text-lg font-semibold text-white hover:from-purple-600 hover:to-blue-600 sm:w-auto">
                  Post a Job
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  variant="outline"
                  className="w-full border-purple-400 px-8 py-6 text-lg font-semibold text-white hover:bg-purple-900/20 sm:w-auto"
                >
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Early Access Section */}
        <section className="container mx-auto px-4 py-12">
          <div
            className="mx-auto max-w-4xl rounded-xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-8 backdrop-blur-sm transform transition-all duration-700 opacity-0 translate-y-10 animate-fade-in-up"
            id="early-access-section"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-purple-500/20 p-3 animate-pulse">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white animate-fade-in">
                Get Early Access to Job Opportunities
              </h2>
              <p className="mb-6 text-lg text-gray-300 animate-fade-in delay-200">
                Subscribe to our blockchain-powered alert system and be the first to know about new job postings in your
                preferred categories.
              </p>
              <div className="grid w-full gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-gray-800/50 p-4 text-center transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/70 animate-fade-in delay-300">
                  <h3 className="mb-2 text-xl font-bold text-white">Basic</h3>
                  <p className="mb-2 text-3xl font-bold text-white">0.5 APE</p>
                  <p className="mb-4 text-sm text-gray-400">per month</p>
                  <p className="text-gray-300">24-hour early access to 1 category</p>
                </div>
                <div className="rounded-lg bg-gray-800/50 p-4 text-center relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/70 animate-fade-in delay-400">
                  <div className="absolute -right-12 top-6 rotate-45 bg-purple-500 px-12 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">Premium</h3>
                  <p className="mb-2 text-3xl font-bold text-white">12 APE</p>
                  <p className="mb-4 text-sm text-gray-400">for 3 months</p>
                  <p className="text-gray-300">48-hour early access to 3 categories</p>
                </div>
                <div className="rounded-lg bg-gray-800/50 p-4 text-center transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/70 animate-fade-in delay-500">
                  <h3 className="mb-2 text-xl font-bold text-white">Unlimited</h3>
                  <p className="mb-2 text-3xl font-bold text-white">25 APE</p>
                  <p className="mb-4 text-sm text-gray-400">for 6 months</p>
                  <p className="text-gray-300">72-hour early access to all categories</p>
                </div>
              </div>
              <Link href="/subscribe" className="mt-8 animate-fade-in delay-600">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Subscribe Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard
              icon={<Briefcase className="h-8 w-8 text-purple-400" />}
              title="Total Jobs Posted"
              value="1,234"
              description="Jobs posted on our platform"
            />
            <StatsCard
              icon={<Users className="h-8 w-8 text-blue-400" />}
              title="Applications Made"
              value="5,678"
              description="Successful applications submitted"
            />
            <StatsCard
              icon={<Wallet className="h-8 w-8 text-purple-400" />}
              title="Connected Wallets"
              value="2,345"
              description="Unique wallets connected"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Why Choose Web3Jobs?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm transition-all hover:bg-gray-800/70">
              <div className="mb-4 rounded-full bg-purple-500/20 p-3 w-fit">
                <Wallet className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Wallet Integration</h3>
              <p className="text-gray-300">
                Connect your wallet and manage your job postings or applications securely.
              </p>
            </div>
            <div className="rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm transition-all hover:bg-gray-800/70">
              <div className="mb-4 rounded-full bg-blue-500/20 p-3 w-fit">
                <Briefcase className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Smart Contract Powered</h3>
              <p className="text-gray-300">All job postings and applications are secured by blockchain technology.</p>
            </div>
            <div className="rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm transition-all hover:bg-gray-800/70">
              <div className="mb-4 rounded-full bg-purple-500/20 p-3 w-fit">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Early Access Alerts</h3>
              <p className="text-gray-300">
                Subscribe with ApeChain tokens to get early access to new job postings in your preferred categories.
              </p>
            </div>
          </div>
        </section>
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

      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>

      {/* Add intersection observer for animations */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.style.opacity = '1';
                  entry.target.style.transform = 'translateY(0)';
                  observer.unobserve(entry.target);
                }
              });
            }, { threshold: 0.1 });

            const section = document.getElementById('early-access-section');
            if (section) {
              observer.observe(section);
            }
          });
        `,
        }}
      />
    </div>
  )
}
