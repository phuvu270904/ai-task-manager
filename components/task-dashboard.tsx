"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Info, X, Calendar, FileText, MessageSquare } from "lucide-react"

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

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
    <div className="space-y-6">
      <Card className="border-purple-100 shadow-md dark:border-purple-900/30">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-t-lg border-b border-blue-100 dark:border-gray-700">
          <CardTitle className="text-blue-700 dark:text-blue-300">
            Task Dashboard
          </CardTitle>
          <CardDescription>
            View and manage all your submitted tasks.
          </CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-purple-400 dark:text-purple-500" />
            <Input
              placeholder="Search tasks..."
              className="pl-8 border-purple-200 dark:border-purple-900/30 focus:border-purple-400 dark:focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="bg-white dark:bg-gray-900">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-purple-400 dark:text-purple-500">
              No tasks have been submitted yet. Create your first task to see it
              here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50 dark:bg-purple-900/20">
                    <TableHead className="text-blue-700 dark:text-blue-300">
                      Task ID
                    </TableHead>
                    <TableHead className="text-blue-700 dark:text-blue-300">
                      Task Title
                    </TableHead>
                    <TableHead className="text-blue-700 dark:text-blue-300 hidden md:table-cell">
                      Task Description
                    </TableHead>
                    <TableHead className="text-blue-700 dark:text-blue-300 hidden lg:table-cell">
                      Request Title
                    </TableHead>
                    <TableHead className="text-blue-700 dark:text-blue-300">
                      Submission Date
                    </TableHead>
                    <TableHead className="text-blue-700 dark:text-blue-300 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-purple-400 dark:text-purple-500">
                        No tasks match your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className="hover:bg-purple-50 dark:hover:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30 cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                        <TableCell className="font-mono">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                            {task.id.slice(-6)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {task.taskTitle}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 hidden md:table-cell">
                          {truncateText(task.taskDescription, 60)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{task.requestTitle}</TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-500">
                          {formatDate(task.submissionDate)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task);
                            }}
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTask && (
        <Card className="border-indigo-100 shadow-lg dark:border-indigo-900/30 animate-fadeIn">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-indigo-900/20 rounded-t-lg border-b border-indigo-100 dark:border-indigo-900/30 flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <CardTitle className="text-indigo-700 dark:text-indigo-300">
                  {selectedTask.taskTitle}
                </CardTitle>
              </div>
              <CardDescription className="mt-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created on {formatDate(selectedTask.submissionDate)}</span>
                <span className="mx-1">•</span>
                <span className="font-mono text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                  ID: {selectedTask.id.slice(-6)}
                </span>
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 -mt-1 -mr-2"
              onClick={() => setSelectedTask(null)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 mb-2">
                <FileText className="h-4 w-4" />
                Task Description
              </h3>
              <div className="p-4 rounded-md bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 whitespace-pre-wrap">
                {selectedTask.taskDescription}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1.5 mb-2">
                <MessageSquare className="h-4 w-4" />
                Original Request
              </h3>
              <div className="space-y-3">
                <div className="font-medium p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                  {selectedTask.requestTitle}
                </div>
                <div className="text-gray-600 dark:text-gray-400 p-4 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 whitespace-pre-wrap">
                  {selectedTask.requestDescription}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-indigo-900/20 border-t border-indigo-100 dark:border-indigo-900/30 flex justify-end">
            <Button 
              variant="outline" 
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
              onClick={() => setSelectedTask(null)}
            >
              Close Details
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
