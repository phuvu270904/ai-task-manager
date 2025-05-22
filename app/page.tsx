"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send, Sparkles } from "lucide-react"
import TaskDashboard from "@/components/task-dashboard"

export default function TaskManager() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("create")
  const [isGenerating, setIsGenerating] = useState(false)
  const [userRequest, setUserRequest] = useState({
    title: "",
    description: "",
  })
  const [generatedDraft, setGeneratedDraft] = useState<null | {
    title: string
    description: string
  }>(null)
  const [tasks, setTasks] = useState<
    Array<{
      id: string
      taskTitle: string
      taskDescription: string
      requestTitle: string
      requestDescription: string
      submissionDate: string
    }>
  >([])

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserRequest((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateDraft = async () => {
    if (!userRequest.title || !userRequest.description) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and description for your task request.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate API call to AI service
      const response = await fetch("/api/generate-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRequest),
      })

      if (!response.ok) throw new Error("Failed to generate task draft")

      const data = await response.json()
      setGeneratedDraft(data)
      toast({
        title: "Draft generated",
        description: "AI has created a task draft based on your request.",
      })
    } catch (error) {
      console.error("Error generating draft:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating your task draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const submitTaskDraft = () => {
    if (!generatedDraft) return

    // Create new task object
    const newTask = {
      id: Date.now().toString(),
      taskTitle: generatedDraft.title,
      taskDescription: generatedDraft.description,
      requestTitle: userRequest.title,
      requestDescription: userRequest.description,
      submissionDate: new Date().toISOString(),
    }

    // Add to tasks array
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)

    // Save to localStorage
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))

    // Reset form and draft
    setUserRequest({ title: "", description: "" })
    setGeneratedDraft(null)

    // Show success message
    toast({
      title: "Task submitted",
      description: "Your task has been saved successfully.",
    })

    // Switch to dashboard tab
    setActiveTab("dashboard")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">AI Task Manager</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Task</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Request</CardTitle>
              <CardDescription>Enter your task details and let AI help you create a detailed draft.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Task Title
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a title for your task"
                  value={userRequest.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Task Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what you need to accomplish"
                  rows={4}
                  value={userRequest.description}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={generateDraft}
                disabled={isGenerating || !userRequest.title || !userRequest.description}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Draft
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {generatedDraft && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Task Draft</CardTitle>
                <CardDescription>Review the AI-generated task draft below.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Task Title</h3>
                  <div className="p-3 bg-muted rounded-md">{generatedDraft.title}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Task Description</h3>
                  <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">{generatedDraft.description}</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={submitTaskDraft} className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Task Draft
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dashboard">
          <TaskDashboard tasks={tasks} />
        </TabsContent>
      </Tabs>

      <div className="mt-12 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>How to Use This Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Features Implemented:</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Input form for task requests with title and description</li>
                <li>AI integration to generate detailed task drafts</li>
                <li>Preview section to review generated drafts</li>
                <li>Task submission and storage in local database</li>
                <li>Dashboard to view all submitted tasks</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Usage Instructions:</h3>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Enter a title and description for your task request</li>
                <li>Click "Generate Draft" to let AI create a detailed task</li>
                <li>Review the generated draft</li>
                <li>Click "Submit Task Draft" to save the task</li>
                <li>View all submitted tasks in the Dashboard tab</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
