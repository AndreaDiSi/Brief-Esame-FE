import type { TTenant } from "../context/tenant-context";

interface Props {
    tenant: TTenant;
    open: boolean;
    onClose: () => void;
}

const TenantViewDialog = ({ tenant, open, onClose }: Props) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black opacity-40"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <h3 className="text-xl font-semibold mb-4">
                    Tenant Details
                </h3>

                <div className="space-y-2 text-sm text-gray-700">
                    <p><b>ID:</b> {tenant.idTenant}</p>
                    <p><b>Name:</b> {tenant.tenantName}</p>
                    <p><b>Surname:</b> {tenant.surname}</p>
                    <p><b>Email:</b> {tenant.email}</p>
                    <p><b>Address:</b> {tenant.tenantAddress}</p>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TenantViewDialog;