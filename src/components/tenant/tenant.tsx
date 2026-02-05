import React, { useState } from 'react'
import { useTenant } from '../context/tenant-context'
import type { TTenant } from '../context/tenant-context'
import TenantDialog from './tenant-dialog' // Assumiamo esistano questi componenti
import { toast } from "sonner"
import TenantEditDialog from './tenant-edit-dialog'
import TenantViewDialog from './tenant-view-dialog'

const Tenant = () => {
    const { tenantData, deleteTenant } = useTenant()
    const [searchTerm, setSearchTerm] = useState('')
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [confirmId, setConfirmId] = useState<number | null>(null)
    const [editTenant, setEditTenant] = useState<TTenant | null>(null)
    const [viewTenant, setViewTenant] = useState<TTenant | null>(null)

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const filteredData = tenantData.filter(item =>
        item.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.surname.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0

        const direction = sortDirection === 'asc' ? 1 : -1

        // ordinamento stringhe
        if (sortColumn === 'tenantName' || sortColumn === 'email' || sortColumn === 'surname' || sortColumn === 'tenantAddress') {
            const valA = (a[sortColumn as keyof TTenant] as string) || ''
            const valB = (b[sortColumn as keyof TTenant] as string) || ''
            return valA.localeCompare(valB) * direction
        }

        // ordinamento numerico
        const valueA = a[sortColumn as keyof TTenant] as number
        const valueB = b[sortColumn as keyof TTenant] as number
        return (valueA - valueB) * direction
    })

    const handleView = (id: number) => {
        const found = tenantData.find(item => item.idTenant === id)
        if (found) {
            setViewTenant(found)
        }
    }

    const handleEdit = (id: number) => {
        const found = tenantData.find(item => item.idTenant === id)
        if (found) {
            setEditTenant(found)
        }
    }

    const handleDelete = (id: number) => {
        setConfirmId(id)
    }

    const confirmDelete = async () => {
        if (confirmId === null) return
        await deleteTenant(confirmId)
        setConfirmId(null)
        toast.success("Tenant deleted", {
            description: "The tenant has been successfully removed.",
        })
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-1">
                    <h2 className="text-2xl font-bold text-gray-800">Tenants</h2>
                    <TenantDialog />
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
                            <option value="tenantName">Name</option>
                            <option value="surname">Surname</option>
                            <option value="email">Email</option>
                        </select>
                    </div>
                </div>

                {/* --- MOBILE VIEW: CARDS --- */}
                <div className="block md:hidden px-6 pb-4">
                    {sortedData.length > 0 ? (
                        <div className="space-y-4 grid grid-cols-1 mx-auto sm:grid-cols-2 gap-2">
                            {sortedData.map((item) => (
                                <div key={item.idTenant} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{item.tenantName} {item.surname}</h3>
                                            <p className="text-sm text-gray-500">{item.email}</p>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 my-3 bg-gray-50 p-2 rounded">
                                        <p className="truncate"><span className="font-semibold">Address:</span> {item.tenantAddress}</p>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-3 pt-3 border-t border-gray-100">
                                        <button onClick={() => handleView(item.idTenant)} className="bg-blue-600 hover:bg-blue-800 rounded-lg py-0.5 text-white text-sm px-2 hover:cursor-pointer">View</button>
                                        <button onClick={() => handleEdit(item.idTenant)} className="bg-yellow-600 hover:bg-yellow-800 rounded-lg py-0.5 text-white text-sm px-2 hover:cursor-pointer">Edit</button>
                                        <button onClick={() => handleDelete(item.idTenant)} className="bg-red-600 hover:bg-red-800 rounded-lg py-0.5 text-white text-sm px-2 hover:cursor-pointer">Delete</button>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('idTenant')}>
                                    ID {sortColumn === 'idTenant' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('tenantName')}>
                                    Name {sortColumn === 'tenantName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('surname')}>
                                    Surname {sortColumn === 'surname' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('email')}>
                                    Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('tenantAddress')}>
                                    Address {sortColumn === 'tenantAddress' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.length > 0 ? (
                                sortedData.map((item) => (
                                    <tr key={item.idTenant} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.idTenant}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.tenantName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.surname}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.tenantAddress}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => handleView(item.idTenant)} className="bg-blue-600 hover:bg-blue-800 mr-3 rounded-lg py-0.5 text-white px-2 hover:cursor-pointer">View</button>
                                            <button onClick={() => handleEdit(item.idTenant)} className="bg-yellow-600 hover:bg-yellow-800 mr-3 rounded-lg py-0.5 text-white px-2 hover:cursor-pointer">Edit</button>
                                            <button onClick={() => handleDelete(item.idTenant)} className="bg-red-600 hover:bg-red-800 rounded-lg py-0.5 text-white px-2 hover:cursor-pointer">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No results found.</td>
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
                                Sei sicuro di voler eliminare questo tenant? L'azione non può essere annullata.
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
                {editTenant && (
                    <TenantEditDialog
                        tenant={editTenant}
                        open={!!editTenant}
                        onClose={() => setEditTenant(null)}
                    />
                )}

                {/* Dialog di view */}
                {viewTenant && (
                    <TenantViewDialog
                        tenant={viewTenant}
                        open={!!viewTenant}
                        onClose={() => setViewTenant(null)}
                    />
                )}

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {sortedData.length} of {tenantData.length} results
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tenant