import React from 'react'
import type { THost } from '../context/host-context';

interface Props {
    host: THost;
    open: boolean;
    onClose: () => void;
}

const HostViewDialog = ({ host, open, onClose }: Props) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="absolute inset-0 bg-black opacity-40"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <h3 className="text-xl font-semibold mb-4">
                    Accomodation Details
                </h3>

                <div className="space-y-2 text-sm text-gray-700">
                    <p><b>ID:</b> {host.idHost}</p>
                    <p><b>Name:</b> {host.hostName}</p>
                    <p><b>Surname:</b> {host.surname}</p>
                    <p><b>Address:</b> {host.hostAddress}</p>
                    <p><b>Email:</b> {host.email}</p>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-white rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HostViewDialog
