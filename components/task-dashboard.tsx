"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Task {
  id: string
  taskTitle: string
  taskDescription: string
  requestTitle: string
  requestDescription: string
  submissionDate: string
}

interface TaskDashboardProps {
  tasks: Task[]
}

export default function TaskDashboard({ tasks }: TaskDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const truncateText = (text: string, maxLength = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Dashboard</CardTitle>
        <CardDescription>View and manage all your submitted tasks.</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tasks have been submitted yet. Create your first task to see it here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Task Description</TableHead>
                  <TableHead>Request Title</TableHead>
                  <TableHead>Request Description</TableHead>
                  <TableHead>Submission Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-mono">{task.id.slice(-6)}</TableCell>
                    <TableCell>{task.taskTitle}</TableCell>
                    <TableCell>{truncateText(task.taskDescription)}</TableCell>
                    <TableCell>{task.requestTitle}</TableCell>
                    <TableCell>{truncateText(task.requestDescription)}</TableCell>
                    <TableCell>{formatDate(task.submissionDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
