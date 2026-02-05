import React, { useState } from 'react'
import { useReservation } from '../context/reservation-context'
import type { TReservation } from '../context/reservation-context'
import { useTenant } from '../context/tenant-context'
import { useAccomodation } from '../context/accomodation-context'
import ReservationDialog from './reservation-dialog' 
import { toast } from "sonner"
import ReservationEditDialog from './reservation-edit-dialog'
import ReservationViewDialog from './reservation-view-dialog'

const Reservation = () => {
    const { reservations, deleteReservation } = useReservation()
    const { tenantData } = useTenant()
    const { accomodationData } = useAccomodation()
    
    const [searchTerm, setSearchTerm] = useState('')
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [confirmId, setConfirmId] = useState<number | null>(null)
    const [editRes, setEditRes] = useState<TReservation | null>(null)
    const [viewRes, setViewRes] = useState<TReservation | null>(null)

    // Helper per mostrare nomi invece di ID
    const getTenantFullName = (id: number) => {
        const t = tenantData.find(item => item.idTenant === id)
        return t ? `${t.tenantName} ${t.surname}` : `ID: ${id}`
    }

    const getAccName = (id: number) => {
        const a = accomodationData.find(item => item.idAccomodation === id)
        return a ? a.accomodationName : `ID: ${id}`
    }

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const filteredData = reservations.filter(item =>
        getTenantFullName(item.idTenant).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getAccName(item.idAccomodation).toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reservationStartDate.includes(searchTerm) ||
        item.reservationEndDate.includes(searchTerm) ||
        item.idReservation.toString().includes(searchTerm) 
    )

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0

        const direction = sortDirection === 'asc' ? 1 : -1

        // ordinamento stringhe (date o nomi risolti)
        if (sortColumn === 'reservationStartDate' || sortColumn === 'reservationEndDate') {
            const valA = (a[sortColumn as keyof TReservation] as string) || ''
            const valB = (b[sortColumn as keyof TReservation] as string) || ''
            return valA.localeCompare(valB) * direction
        }

        // ordinamento numerico (ID)
        const valueA = a[sortColumn as keyof TReservation] as number
        const valueB = b[sortColumn as keyof TReservation] as number
        return (valueA - valueB) * direction
    })

    const handleView = (id: number) => {
        const found = reservations.find(item => item.idReservation === id)
        if (found) {
            setViewRes(found)
        }
    }

    const handleEdit = (id: number) => {
        const found = reservations.find(item => item.idReservation === id)
        if (found) {
            setEditRes(found)
        }
    }

    const handleDelete = (id: number) => {
        setConfirmId(id)
    }

    const confirmDelete = async () => {
        if (confirmId === null) return
        await deleteReservation(confirmId)
        setConfirmId(null)
        toast.success("Reservation deleted", {
            description: "The reservation has been successfully removed.",
        })
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-1">
                    <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
                    <ReservationDialog />
                </div>

                {/* Search Bar & Mobile Sort */}
                <div className="px-6 py-4 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search by tenant, property or date..."
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
                            <option value="reservationStartDate">Start Date</option>
                            <option value="idTenant">Tenant</option>
                            <option value="idAccomodation">Accomodation</option>
                        </select>
                    </div>
                </div>

                {/* --- MOBILE VIEW: CARDS --- */}
                <div className="block md:hidden px-6 pb-4">
                    {sortedData.length > 0 ? (
                        <div className="space-y-4 grid grid-cols-1 mx-auto sm:grid-cols-2 gap-2">
                            {sortedData.map((item) => (
                                <div key={item.idReservation} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{getTenantFullName(item.idTenant)}</h3>
                                            <p className="text-sm text-gray-500">{getAccName(item.idAccomodation)}</p>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 my-3 bg-gray-50 p-2 rounded">
                                        <p className="truncate"><span className="font-semibold">Period:</span> {item.reservationStartDate} to {item.reservationEndDate}</p>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-3 pt-3 border-t border-gray-100">
                                        <button onClick={() => handleView(item.idReservation)} className="bg-blue-600 hover:bg-blue-800 rounded-lg py-0.5 text-white text-sm px-2 hover:cursor-pointer">View</button>
                                        <button onClick={() => handleEdit(item.idReservation)} className="bg-yellow-600 hover:bg-yellow-800 rounded-lg py-0.5 text-white text-sm px-2 hover:cursor-pointer">Edit</button>
                                        <button onClick={() => handleDelete(item.idReservation)} className="bg-red-600 hover:bg-red-800 rounded-lg py-0.5 text-white text-sm px-2 hover:cursor-pointer">Delete</button>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('idReservation')}>
                                    ID {sortColumn === 'idReservation' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('idTenant')}>
                                    Tenant {sortColumn === 'idTenant' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('idAccomodation')}>
                                    Accomodation {sortColumn === 'idAccomodation' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('reservationStartDate')}>
                                    Start Date {sortColumn === 'reservationStartDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('reservationEndDate')}>
                                    End Date {sortColumn === 'reservationEndDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.length > 0 ? (
                                sortedData.map((item) => (
                                    <tr key={item.idReservation} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.idReservation}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getTenantFullName(item.idTenant)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getAccName(item.idAccomodation)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.reservationStartDate}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.reservationEndDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => handleView(item.idReservation)} className="bg-blue-600 hover:bg-blue-800 mr-3 rounded-lg py-0.5 text-white px-2 hover:cursor-pointer">View</button>
                                            <button onClick={() => handleEdit(item.idReservation)} className="bg-yellow-600 hover:bg-yellow-800 mr-3 rounded-lg py-0.5 text-white px-2 hover:cursor-pointer">Edit</button>
                                            <button onClick={() => handleDelete(item.idReservation)} className="bg-red-600 hover:bg-red-800 rounded-lg py-0.5 text-white px-2 hover:cursor-pointer">Delete</button>
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
                                Sei sicuro di voler eliminare questa prenotazione? L'azione non può essere annullata.
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
                {editRes && (
                    <ReservationEditDialog
                        reservation={editRes}
                        open={!!editRes}
                        onClose={() => setEditRes(null)}
                    />
                )}

                {/* Dialog di view */}
                {viewRes && (
                    <ReservationViewDialog
                        reservation={viewRes}
                        open={!!viewRes}
                        onClose={() => setViewRes(null)}
                    />
                )}

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {sortedData.length} of {reservations.length} results
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reservation