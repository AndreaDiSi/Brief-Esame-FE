import React, { useState } from 'react';
import { Star, Trophy } from 'lucide-react';
import { useTenant, type TenantContextType, type TTenant } from '../context/tenant-context';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@base-ui/react';
import { toast } from 'sonner';

const TopTenants = () => {
    const tenantData = useTenant();
    const [data, setData] = useState<TTenant[]>([]);
    const [loading, setLoading] = useState(false);

    const handleGetBest = async () => {
        setLoading(true);
        const promise = tenantData.fetchTopFiveTenants();

        toast.promise(promise, {
            loading: 'Analysing tenant bookings...',
            success: (best) => {
                console.log(best)
                setData(best);
                setLoading(false);
                return `Top tenants found!`;
            },
            error: (err) => {
                setLoading(false);
                return 'Error calculating statistics';
            },
        });
    };
    return (
        <div className='flex flex-col items-center gap-2 wrap-anywhere'>
            <p className='font-bold text-black text-xl'>Top Tenants</p>

            <div className="flex flex-col items-center gap-6 p-6 rounded-xl border border-gray-200 shadow-sm text-sm">

                <Dialog>
                    <DialogTrigger render={
                        <Button
                            onClick={handleGetBest}
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-200`}
                        >
                            <Trophy size={18} />
                            {loading ? "Calculating..." : "Get Best Tenants"}
                        </Button>} />

                    {data.length > 0 && (
                        <DialogContent className={"grid grid-cols-3 min-w-5xl"}>
                            {data.map((tenant) => (
                                <div
                                    key={tenant.idTenant}
                                    className="animate-in fade-in slide-in-from-top-4 duration-500 bg-white border-2 border-emerald-100 rounded-2xl overflow-hidden shadow-xl text-sm h-50 flex flex-col justify-center"
                                >
                                    <div className="bg-emerald-600 p-4 flex justify-between items-center">
                                        <span className="text-white text-xs font-bold uppercase tracking-wider">
                                            Tenant
                                        </span>
                                        <div className="flex text-yellow-300">
                                            <Star size={14} fill="currentColor" />
                                        </div>
                                    </div>

                                    <div className="p-6 text-center">
                                        <h4 className="text-xl font-bold text-gray-900">
                                            {tenant.tenantName} {tenant.surname}
                                        </h4>

                                        <p className="text-sm text-gray-600 mt-2">
                                            {tenant.email}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {tenant.tenantAddress}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </DialogContent>
                    )}
                </Dialog>

            </div>
        </div>
    );
};

export default TopTenants;
