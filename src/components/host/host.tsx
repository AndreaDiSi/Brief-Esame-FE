import React, { useState } from 'react'
import { useHost } from '../context/host-context'
import type { THost } from '../context/host-context'
import HostDialog from './host-dialog'
import { toast } from "sonner"
import HostEditDialog from './host-edit-dialog'
import HostViewDialog from './host-view-dialog.tsx'

const Host = () => {
    const { data, deleteHost } = useHost()
    const [searchTerm, setSearchTerm] = useState('')
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [confirmId, setConfirmId] = useState<number | null>(null)
    const [editHost, setEditHost] = useState<THost | null>(null)
    const [viewHost, setViewHost] = useState<THost | null>(null)

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const filteredData = data.filter(item =>
        item.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.surname.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0

        const direction = sortDirection === 'asc' ? 1 : -1

        // ordinamento boolean
        if (sortColumn === 'isSuperhost') {
            return ((a.isSuperhost === b.isSuperhost) ? 0 : a.isSuperhost ? 1 : -1) * direction
        }

        // ordinamento stringhe
        if (sortColumn === 'hostName' || sortColumn === 'email' || sortColumn === 'surname' || sortColumn === 'hostAddress') {
            const valA = (a[sortColumn as keyof THost] as string) || ''
            const valB = (b[sortColumn as keyof THost] as string) || ''
            return valA.localeCompare(valB) * direction
        }

        // ordinamento numerico
        const valueA = a[sortColumn as keyof THost] as number
        const valueB = b[sortColumn as keyof THost] as number
        return (valueA - valueB) * direction
    })

    const handleView = (id: number) => {
        const found = data.find(item => item.idHost === id)
        if (found) {
            setViewHost(found)
        }
    }

    const handleEdit = (id: number) => {
        const found = data.find(item => item.idHost === id)
        if (found) {
            setEditHost(found)
        }
    }

    const handleDelete = (id: number) => {
        setConfirmId(id)
    }

    const confirmDelete = async () => {
        if (confirmId === null) return
        await deleteHost(confirmId)
        setConfirmId(null)
        toast.success("Host deleted", {
            description: "The host has been successfully removed.",
        })
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-1">
                    <h2 className="text-2xl font-bold text-gray-800">Hosts</h2>
                    <HostDialog />
                </div>

                {/* Search Bar & Mobile Sort */}
                <div className="px-6 py-4 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, email or surname..."
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
                            <option value="hostName">Name</option>
                            <option value="email">Email</option>
                            <option value="isSuperhost">Superhost</option>
                        </select>
                    </div>
                </div>

                {/* --- MOBILE VIEW: CARDS --- */}
                <div className="block md:hidden px-6 pb-4">
                    {sortedData.length > 0 ? (
                        <div className="space-y-4 grid grid-cols-1 mx-auto sm:grid-cols-2 gap-2">
                            {sortedData.map((item) => (
                                <div key={item.idHost} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{item.hostName} {item.surname}</h3>
                                            <p className="text-sm text-gray-500">{item.email}</p>
                                        </div>
                                        {item.isSuperhost && (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Superhost
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-sm text-gray-600 my-3 bg-gray-50 p-2 rounded">
                                        <p className="truncate"><span className="font-semibold">Address:</span> {item.hostAddress}</p>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-3 pt-3 border-t border-gray-100">
                                        <button onClick={() => handleView(item.idHost)} className="bg-blue-600 hover:bg-blue-800 rounded-lg py-0.5 text-white text-sm px-2 hover:cursor-pointer">View</button>
                                        <button onClick={() => handleEdit(item.idHost)} className="bg-yellow-600 hover:bg-yellow-800 rounded-lg py-0.5 text-white text-sm px-2 hover:cursor-pointer">Edit</button>
                                        <button onClick={() => handleDelete(item.idHost)} className="bg-red-600 hover:bg-red-800 rounded-lg py-0.5 text-white text-sm px-2 hover:cursor-pointer">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">No results found.</div>
                    )}
                </div>

                {/* --- DESKTOP VIEW: TABLE --- */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('idHost')}>
                                    ID {sortColumn === 'idHost' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('hostName')}>
                                    Name {sortColumn === 'hostName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('surname')}>
                                    Surname {sortColumn === 'surname' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('email')}>
                                    Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('hostAddress')}>
                                    Address {sortColumn === 'hostAddress' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('isSuperhost')}>
                                    Superhost {sortColumn === 'isSuperhost' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.length > 0 ? (
                                sortedData.map((item) => (
                                    <tr key={item.idHost} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.idHost}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.hostName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.surname}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.hostAddress}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {item.isSuperhost ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => handleView(item.idHost)} className="bg-blue-600 hover:bg-blue-800 mr-3 rounded-lg py-0.5 text-white px-2 hover:cursor-pointer">View</button>
                                            <button onClick={() => handleEdit(item.idHost)} className="bg-yellow-600 hover:bg-yellow-800 mr-3 rounded-lg py-0.5 text-white px-2 hover:cursor-pointer">Edit</button>
                                            <button onClick={() => handleDelete(item.idHost)} className="bg-red-600 hover:bg-red-800 rounded-lg py-0.5 text-white px-2 hover:cursor-pointer">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">No results found.</td>
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
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Conferma eliminazione</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Sei sicuro di voler eliminare questo host? L'azione non può essere annullata.
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
                {editHost && (
                    <HostEditDialog
                        host={editHost}
                        open={!!editHost}
                        onClose={() => setEditHost(null)}
                    />
                )}

                {/* Dialog di view */}
                {viewHost && (
                    <HostViewDialog
                        host={viewHost}
                        open={!!viewHost}
                        onClose={() => setViewHost(null)}
                    />
                )}

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {sortedData.length} of {data.length} results
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Host