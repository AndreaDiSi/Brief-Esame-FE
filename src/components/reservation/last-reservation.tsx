import React, { useState } from 'react';
import { useReservation, type TReservation } from '../context/reservation-context';
import { useTenant } from '../context/tenant-context';
import { toast } from "sonner";
import { Calendar, Hash, Home, ArrowRight, Search, Star } from 'lucide-react';
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from '../ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type ReservationFormData, reservationSchema } from './reservation-dialog';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@base-ui/react';

export const LastReservation = () => {
    const { tenantData } = useTenant();
    const { getLastReservation } = useReservation();
    const [searchTermTenant, setSearchTermTenant] = useState('');
    const [lastRes, setLastRes] = useState<TReservation | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        watch,
        formState: { errors },
    } = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        mode: "onChange",
    });


    const selectedTenantId = watch("idTenant");

    const filteredDataTenant = tenantData.filter(item => {
        if (searchTermTenant === '') return false;
        const idString = item.idTenant.toString();
        return (
            item.tenantName.toLowerCase().includes(searchTermTenant.toLowerCase()) ||
            item.surname.toLowerCase().includes(searchTermTenant.toLowerCase()) ||
            idString.includes(searchTermTenant)
        );
    });


    const handleGetLast = async () => {
        if (!selectedTenantId) {
            toast.error("Select a Tenant first!");
            return;
        }

        setLoading(true);
        try {
            const data = await getLastReservation(Number(selectedTenantId));
            if (data) {
                setLastRes(data);
                toast.success("Last reservation Found!");
            } else {
                setLastRes(null);
                toast.error("No Reservation found for this tenant.");
            }
        } catch (error) {
            toast.error("Error during the fetch of the data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center gap-4 w-full'>
            <p className='font-bold text-black text-xl'>Tenant Activity Tracker</p>

            <div className="w-full max-w-md flex flex-col gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">


                <FieldGroup className="space-y-4">
                    <Field>
                        <Label className="text-gray-600 text-sm mb-1 ml-1">Search Tenant</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Name, surname or ID..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                value={searchTermTenant}
                                onChange={(e) => setSearchTermTenant(e.target.value)}
                            />
                        </div>
                    </Field>

                    <select
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500"
                        {...register("idTenant", { valueAsNumber: true })}
                    >
                        <option value="">-- Select a Tenant --</option>
                        {filteredDataTenant.map(tenant => (
                            <option key={tenant.idTenant} value={tenant.idTenant}>
                                {tenant.tenantName} {tenant.surname} (ID: {tenant.idTenant})
                            </option>
                        ))}
                    </select>


                </FieldGroup>

                <Dialog>
                    <DialogTrigger render={
                        <Button
                            onClick={handleGetLast}
                            disabled={loading || !selectedTenantId}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-100"
                        >
                            {loading ? "Searching..." : "Fetch Last Reservation"}
                        </Button>
                    }>
                    </DialogTrigger>
                    {lastRes && (
                        <DialogContent>
                            <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500 mt-2">
                                <div className="bg-white border-2 border-indigo-100 rounded-2xl overflow-hidden shadow-xl">
                                    <div className="bg-indigo-600 p-3 flex justify-between items-center">
                                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">Latest Activity</span>
                                        <div className="flex text-indigo-200"><Star size={12} fill="currentColor" /></div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Home size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-gray-900">Accomodation #{lastRes.idAccomodation}</h4>
                                                <div className="flex items-center gap-1 text-gray-500 mt-1">
                                                    <Hash size={12} />
                                                    <span className="text-xs font-mono">Booking ID: {lastRes.idReservation}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid grid-cols-1 gap-2">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={14} />
                                                    <span className="text-xs font-medium">Check-in</span>
                                                </div>
                                                <span className="text-sm font-bold text-indigo-600">{lastRes.reservationStartDate}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={14} />
                                                    <span className="text-xs font-medium">Check-out</span>
                                                </div>
                                                <span className="text-sm font-bold text-indigo-600">{lastRes.reservationEndDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    )}
                </Dialog>
            </div>
        </div>
    );
};