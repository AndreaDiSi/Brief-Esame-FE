import React, { useState } from 'react'
import { useAccomodation } from './context/accomodation-context'
import type { TAccomodation } from './context/accomodation-context'
import { Plus } from 'lucide-react';
import AccomodationDialog from './accomodation-dialog';

const Accomodation = () => {
    const { data, addAccomodation } = useAccomodation();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

   

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accomodationAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0;

        const direction = sortDirection === 'asc' ? 1 : -1;

        // ordinamento stringhe
        if (sortColumn === 'name' || sortColumn === 'accomodationAddress') {
             // Nota: ho aggiunto un controllo di sicurezza per le stringhe
            const valA = (a[sortColumn as keyof TAccomodation] as string) || '';
            const valB = (b[sortColumn as keyof TAccomodation] as string) || '';
            return valA.localeCompare(valB) * direction;
        }

        // ordinamento numerico
        const valueA = a[sortColumn as keyof TAccomodation] as number;
        const valueB = b[sortColumn as keyof TAccomodation] as number;

        return (valueA - valueB) * direction;
    });


    const handleView = (id: number) => {
        console.log('View accomodation:', id)
    }

    const handleEdit = (id: number) => {
        console.log('Edit accomodation:', id)
    }

    const handleDelete = (id: number) => {
        console.log('Delete accomodation:', id)
    }

    return (
        // Padding responsive: p-4 su mobile, p-8 su desktop
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-1">
                    <h2 className="text-2xl font-bold text-gray-800">Accomodations </h2>
                    <AccomodationDialog />
                </div>
                
                

                {/* Search Bar & Mobile Sort */}
                <div className="px-6 py-4 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search by name or address..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {/* Mobile Sort Dropdown (Visibile solo su mobile) */}
                    <div className="md:hidden">
                        <select 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            onChange={(e) => handleSort(e.target.value)}
                            value={sortColumn || ''}
                        >
                            <option value="">Sort by...</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                            <option value="nrooms">Rooms</option>
                        </select>
                    </div>
                </div>

                {/* --- MOBILE VIEW: CARDS --- */}
                <div className="block md:hidden px-6 pb-4">
                    {sortedData.length > 0 ? (
                        <div className="space-y-4 grid grid-cols-1 mx-auto sm:grid-cols-2 gap-2">
                            {sortedData.map((item) => (
                                <div key={item.idAccomodation} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.accomodationAddress}</p>
                                        </div>
                                        <span className="text-lg font-bold text-green-600">€{item.price}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 my-3 bg-gray-50 p-2 rounded">
                                        <div className="text-center">
                                            <span className="block font-semibold">Rooms</span>
                                            {item.nrooms}
                                        </div>
                                        <div className="text-center border-l border-r border-gray-200">
                                            <span className="block font-semibold">Beds</span>
                                            {item.nbedPlaces}
                                        </div>
                                        <div className="text-center">
                                            <span className="block font-semibold">Floor</span>
                                            {item.floor}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-3 pt-3 border-t border-gray-100">
                                        <button onClick={() => handleView(item.idAccomodation)} className="text-blue-600 font-medium text-sm">View</button>
                                        <button onClick={() => handleEdit(item.idAccomodation)} className="text-yellow-600 font-medium text-sm">Edit</button>
                                        <button onClick={() => handleDelete(item.idAccomodation)} className="text-red-600 font-medium text-sm">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">No results found.</div>
                    )}
                </div>

                {/* --- DESKTOP VIEW: TABLE (Visibile sopra 'md') --- */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('idAccomodation')}>
                                    ID {sortColumn === 'idAccomodation' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('name')}>
                                    Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('accomodationAddress')}>
                                    Address {sortColumn === 'accomodationAddress' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('nrooms')}>
                                    Rooms {sortColumn === 'nrooms' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('nbedPlaces')}>
                                    Bed Places {sortColumn === 'nbedPlaces' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('floor')}>
                                    Floor {sortColumn === 'floor' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200" onClick={() => handleSort('price')}>
                                    Price (€) {sortColumn === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.length > 0 ? (
                                sortedData.map((item) => (
                                    <tr key={item.idAccomodation ?? `${item.name}-${item.accomodationAddress}`} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.idAccomodation}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.accomodationAddress}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nrooms}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nbedPlaces}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.floor}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">€{item.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => handleView(item.idAccomodation)} className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                                            <button onClick={() => handleEdit(item.idAccomodation)} className="text-yellow-600 hover:text-yellow-800 mr-3">Edit</button>
                                            <button onClick={() => handleDelete(item.idAccomodation)} className="text-red-600 hover:text-red-800">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

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

export default Accomodation