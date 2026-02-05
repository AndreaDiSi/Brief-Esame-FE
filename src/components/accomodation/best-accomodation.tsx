import React, { useState } from 'react';
import { toast } from "sonner";
import { useAccomodation } from "../context/accomodation-context";
import { Home, Star, MapPin, Trophy } from 'lucide-react';
import type { TAccomodation } from '../context/accomodation-context';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@base-ui/react';
export type TAccomodationWithNReservations = TAccomodation & {
    nreservations: number;
}

const BestAccomodation = () => {
    const [data, setData] = useState<TAccomodationWithNReservations>();
    const [loading, setLoading] = useState(false);
    const accomodationData = useAccomodation();

    const handleGetBest = async () => {
        setLoading(true);
        const promise = accomodationData.fetchBestAccomodation();

        toast.promise(promise, {
            loading: 'Analysing reservations...',
            success: (best) => {
                setData(best);
                setLoading(false);
                return `Top Accomodation found!`;
            },
            error: (err) => {
                setLoading(false);
                return 'Error calculating statistics';
            },
        });
    };

    return (
        <div className='flex flex-col items-center gap-2 wrap-anywhere'>
            <p className='font-bold text-black text-xl'>Find out the best Accomodation</p>
            <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <Dialog>
                    <DialogTrigger render={
                        <Button onClick={handleGetBest}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-200"
                        >
                            <Trophy size={18} />
                            {loading ? "Calculating..." : "Get Best Host"}
                        </Button>
                    }>
                    </DialogTrigger>

                    {data && (
                        <DialogContent>
                            <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="bg-white border-2 border-indigo-100 rounded-2xl overflow-hidden shadow-xl">
                                    <div className="bg-indigo-600 p-4 flex justify-between items-center">
                                        <span className="text-white text-xs font-bold uppercase tracking-wider">Most Popular</span>
                                        <div className="flex text-yellow-300"><Star size={14} fill="currentColor" /></div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 hidden lg:flex">
                                                <Home size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900">{data.accomodationName}</h4>
                                                <div className="flex items-center gap-1 text-gray-500 mt-1">
                                                    <MapPin size={14} />
                                                    <span className="text-sm">{data.accomodationAddress}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-xl md:flex-col">
                                            <span className="text-sm font-medium text-gray-600">Total Reservations</span>
                                            <span className="text-2xl font-black text-indigo-600">{data.nreservations}</span>
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

export default BestAccomodation;