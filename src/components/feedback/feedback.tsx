import { useState } from "react"
import { toast } from "sonner"
import { useFeedback } from "../context/feedback-context"
import type { TFeedback } from "../context/feedback-context"
import FeedbackDialog from "./feedback-dialog"
import FeedbackEditDialog from "./feedback-edit-dialog"
import FeedbackViewDialog from "./feedback-view-dialog"

import { Button } from "@/components/ui/button"
import { Eye, Pen, Trash } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
const Feedback = () => {

    const { feedbackData, deleteFeedback } = useFeedback()
    const [searchTerm, setSearchTerm] = useState('')
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [confirmId, setConfirmId] = useState<number | null>(null)
    const [editFeedback, setEditFeedback] = useState<TFeedback | null>(null)
    const [viewFeedback, setViewFeedback] = useState<TFeedback | null>(null)


    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    // Usa l'operatore opzionale ?. o una stringa vuota come fallback
    const filteredData = feedbackData.filter(item => {
        const title = item.title || "";
        const textFeedback = item.textFeedback || "";

        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            textFeedback.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0

        const direction = sortDirection === 'asc' ? 1 : -1

        // Ordinamento stringhe (titolo e testo)
        if (sortColumn === 'title' || sortColumn === 'textFeedback') {
            const valA = (a[sortColumn as keyof TFeedback] as string) || ''
            const valB = (b[sortColumn as keyof TFeedback] as string) || ''
            return valA.localeCompare(valB) * direction
        }

        // Ordinamento numerico (ID, Points, ReservationID)
        const valueA = a[sortColumn as keyof TFeedback] as number
        const valueB = b[sortColumn as keyof TFeedback] as number
        return (valueA - valueB) * direction
    })

    const handleView = (id: number) => {
        const found = feedbackData.find(item => item.idFeed === id)
        if (found) setViewFeedback(found)
    }

    const handleEdit = (id: number) => {
        const found = feedbackData.find(item => item.idFeed === id)
        if (found) setEditFeedback(found)
    }

    const handleDelete = (id: number) => {
        setConfirmId(id)
    }

    const confirmDelete = async () => {
        if (confirmId === null) return
        await deleteFeedback(confirmId)
        setConfirmId(null)
        toast.success("Feedback deleted", {
            description: "The feedback has been successfully removed.",
        })
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-1">
                    <h2 className="text-2xl font-bold text-gray-800">Feedbacks</h2>
                    <FeedbackDialog />
                </div>

                {/* Search Bar & Mobile Sort */}
                <div className="px-6 py-4 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search by title or content..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Mobile Sort Dropdown */}
                    <div className="md:hidden">
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            onChange={(e) => handleSort(e.target.value)}
                            value={sortColumn || ''}
                        >
                            <option value="">Sort by...</option>
                            <option value="title">Title</option>
                            <option value="points">Rating</option>
                            <option value="idReservation">Reservation</option>
                        </select>
                    </div>
                </div>

                {/* --- MOBILE VIEW: CARDS --- */}
                <div className="block md:hidden px-6 pb-4">
                    {sortedData.length > 0 ? (
                        <div className="space-y-4 grid grid-cols-1 mx-auto sm:grid-cols-2 gap-2">
                            {sortedData.map((item) => (
                                <div key={item.idFeed} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                                            <p className="text-sm font-semibold text-yellow-600">Rating: {item.points}/5</p>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 my-3 bg-gray-50 p-2 rounded">
                                        <p className="line-clamp-2 italic">"{item.textFeedback}"</p>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-3 pt-3 border-t border-gray-100">
                                        <Tooltip>
                                            <TooltipTrigger render={
                                                <Button onClick={() => handleView(item.idFeed)} variant={"outline"}><Eye /></Button>
                                            }>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>View</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger render={
                                                <Button onClick={() => handleEdit(item.idFeed)} variant={"outline"}><Pen /></Button>
                                            }>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Edit</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger render={
                                                <Button onClick={() => handleDelete(item.idFeed)} variant={"outline"}><Trash /></Button>
                                            }>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Delete</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">No feedbacks found.</div>
                    )}
                </div>

                {/* --- DESKTOP VIEW: TABLE --- */}
                <div className="hidden md:block overflow-x-auto min-w-5xl">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('idFeed')}>
                                    ID {sortColumn === 'idFeed' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('title')}>
                                    Title {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('points')}>
                                    Rating {sortColumn === 'points' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('idReservation')}>
                                    Reservation ID {sortColumn === 'idReservation' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.length > 0 ? (
                                sortedData.map((item) => (
                                    <tr key={item.idFeed} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.idFeed}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                                                {item.points} / 5
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">ID: {item.idReservation}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-4">
                                            <Tooltip>
                                                <TooltipTrigger render={
                                                    <Button onClick={() => handleView(item.idFeed)} variant={"outline"}><Eye /></Button>
                                                }>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger render={
                                                    <Button onClick={() => handleEdit(item.idFeed)} variant={"outline"}><Pen /></Button>
                                                }>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger render={
                                                    <Button onClick={() => handleDelete(item.idFeed)} variant={"outline"}><Trash /></Button>
                                                }>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal conferma delete */}
                {confirmId !== null && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-40" onClick={() => setConfirmId(null)} />
                        <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Are you sure you want to delete this feedback? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setConfirmId(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dialog di edit */}
                {editFeedback && (
                    <FeedbackEditDialog
                        feedback={editFeedback}
                        open={!!editFeedback}
                        onClose={() => setEditFeedback(null)}
                    />
                )}

                {/* Dialog di view */}
                {viewFeedback && (
                    <FeedbackViewDialog
                        feedback={viewFeedback}
                        open={!!viewFeedback}
                        onClose={() => setViewFeedback(null)}
                    />
                )}

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {sortedData.length} of {feedbackData.length} results
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feedback