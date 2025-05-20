"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart3, Download, Send, UserCheck, RefreshCw, Plus } from "lucide-react"
import type { ResumeAnalytics } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResumeAnalyticsComponent() {
  const [analytics, setAnalytics] = useState<ResumeAnalytics>({
    views: 0,
    downloads: 0,
    applicationsSent: 0,
    interviewsReceived: 0,
    lastUpdated: new Date().toISOString(),
  })

  useEffect(() => {
    // Load analytics data from localStorage
    const savedAnalytics = localStorage.getItem("resumeAnalytics")
    if (savedAnalytics) {
      try {
        setAnalytics(JSON.parse(savedAnalytics))
      } catch (error) {
        console.error("Error loading analytics data:", error)
      }
    }
  }, [])

  const updateAnalytics = (field: keyof ResumeAnalytics, value: number) => {
    const updatedAnalytics = {
      ...analytics,
      [field]: value,
      lastUpdated: new Date().toISOString(),
    }
    setAnalytics(updatedAnalytics)
    localStorage.setItem("resumeAnalytics", JSON.stringify(updatedAnalytics))
  }

  const resetAnalytics = () => {
    const resetData = {
      views: 0,
      downloads: 0,
      applicationsSent: 0,
      interviewsReceived: 0,
      lastUpdated: new Date().toISOString(),
    }
    setAnalytics(resetData)
    localStorage.setItem("resumeAnalytics", JSON.stringify(resetData))
  }

  // Calculate success rate
  const successRate =
    analytics.applicationsSent > 0 ? Math.round((analytics.interviewsReceived / analytics.applicationsSent) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Resume Analytics</h2>
        <Button variant="outline" size="sm" onClick={resetAnalytics}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Analytics
        </Button>
      </div>

      <p className="text-sm text-slate-600">
        Track your resume performance and job application statistics. Last updated:{" "}
        {new Date(analytics.lastUpdated).toLocaleString()}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-2 rounded-full mb-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">{analytics.views}</h3>
            <p className="text-sm text-slate-600">Resume Views</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-2 rounded-full mb-2">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">{analytics.downloads}</h3>
            <p className="text-sm text-slate-600">Downloads</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 p-2 rounded-full mb-2">
              <Send className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold">{analytics.applicationsSent}</h3>
            <p className="text-sm text-slate-600">Applications Sent</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 p-2 rounded-full mb-2">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">{analytics.interviewsReceived}</h3>
            <p className="text-sm text-slate-600">Interviews Received</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Success Rate</h3>
        <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
          <div
            className={`h-4 rounded-full ${
              successRate >= 30 ? "bg-green-500" : successRate >= 15 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${Math.min(100, successRate)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>0%</span>
          <span>{successRate}% Interview Rate</span>
          <span>100%</span>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          {successRate >= 30
            ? "Great job! Your resume is performing well above average."
            : successRate >= 15
              ? "Your resume is performing at an average level. Consider optimizing it further."
              : "Your resume may need improvement to increase your interview rate."}
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Update Your Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="applications-sent" className="mb-2 block">
              Applications Sent
            </Label>
            <div className="flex">
              <Input
                id="applications-sent"
                type="number"
                min="0"
                value={analytics.applicationsSent}
                onChange={(e) => updateAnalytics("applicationsSent", Number.parseInt(e.target.value) || 0)}
                className="rounded-r-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none"
                onClick={() => updateAnalytics("applicationsSent", analytics.applicationsSent + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="interviews-received" className="mb-2 block">
              Interviews Received
            </Label>
            <div className="flex">
              <Input
                id="interviews-received"
                type="number"
                min="0"
                value={analytics.interviewsReceived}
                onChange={(e) => updateAnalytics("interviewsReceived", Number.parseInt(e.target.value) || 0)}
                className="rounded-r-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none"
                onClick={() => updateAnalytics("interviewsReceived", analytics.interviewsReceived + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
