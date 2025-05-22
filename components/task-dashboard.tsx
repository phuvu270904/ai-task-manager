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
									<TableHead className="text-blue-700 dark:text-blue-300">
										Task Description
									</TableHead>
									<TableHead className="text-blue-700 dark:text-blue-300">
										Request Title
									</TableHead>
									<TableHead className="text-blue-700 dark:text-blue-300">
										Request Description
									</TableHead>
									<TableHead className="text-blue-700 dark:text-blue-300">
										Submission Date
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredTasks.map((task) => (
									<TableRow
										key={task.id}
										className="hover:bg-purple-50 dark:hover:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30"
									>
										<TableCell className="font-mono text-indigo-600 dark:text-indigo-400">
											{task.id.slice(-6)}
										</TableCell>
										<TableCell className="font-medium">
											{task.taskTitle}
										</TableCell>
										<TableCell className="text-gray-600 dark:text-gray-400">
											{truncateText(task.taskDescription)}
										</TableCell>
										<TableCell>{task.requestTitle}</TableCell>
										<TableCell className="text-gray-600 dark:text-gray-400">
											{truncateText(task.requestDescription)}
										</TableCell>
										<TableCell className="text-gray-500 dark:text-gray-500">
											{formatDate(task.submissionDate)}
										</TableCell>
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
