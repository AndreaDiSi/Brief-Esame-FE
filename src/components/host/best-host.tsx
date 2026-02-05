import React, { useState } from 'react';
import { toast } from "sonner";
import { Star, Trophy, User, Mail, ShieldCheck } from 'lucide-react';
import { useHost, type THostWithNReservations } from '../context/host-context';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@base-ui/react';
const BestHost = () => {
    const [data, setData] = useState<THostWithNReservations>();
    const [loading, setLoading] = useState(false);
    const hostData = useHost();

    const handleGetBest = async () => {
        setLoading(true);
        const promise = hostData.fetchBestHost();

        toast.promise(promise, {
            loading: 'Analysing host performance...',
            success: (best) => {
                console.log(best)
                setData(best);
                setLoading(false);
                return `Top Host found!`;
            },
            error: (err) => {
                setLoading(false);
                return 'Error calculating statistics';
            },
        });
    };

    return (
        <div className='flex flex-col items-center gap-2 wrap-anywhere'>
            <p className='font-bold text-black text-xl'>Find out the best Host</p>
            <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <Dialog>
                    <DialogTrigger render=
                        {<Button onClick={handleGetBest}
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg font-medium transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-200`}
                        >
                            <Trophy size={18} />
                            {loading ? "Calculating..." : "Get Best Host"}
                        </Button>}>

                    </DialogTrigger>
                    {data && (
                        <DialogContent>
                            <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="bg-white border-2 border-amber-100 rounded-2xl overflow-hidden shadow-xl">
                                    <div className="bg-amber-500 p-4 flex justify-between items-center">
                                        <span className="text-white text-xs font-bold uppercase tracking-wider">
                                            {data.isSuperhost ? " Superhost" : "Top Rated"}
                                        </span>
                                        <div className="flex text-yellow-200"><Star size={14} fill="currentColor" /></div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-amber-50 rounded-lg text-amber-600 hidden lg:flex">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900">{data.hostName} {data.surname}</h4>
                                                <div className="flex items-center gap-1 text-gray-500 mt-1">
                                                    <Mail size={14} />
                                                    <span className="text-sm">{data.email}</span>
                                                </div>
                                                {data.isSuperhost && (
                                                    <div className="flex items-center gap-1 text-amber-600 mt-1 font-semibold">
                                                        <ShieldCheck size={14} />
                                                        <span className="text-xs">Verified Superhost</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mt-6 flex items-center justify-between bg-gray-50 rounded-xl flex-col md:flex-row">
                                                <span className="text-sm font-medium text-gray-600">Total Feedbacks Received</span>
                                                <span className="text-2xl font-black text-amber-600">{data.nfeedback}</span>
                                            </div>
                                            <div className="mt-6 flex items-center justify-between bg-gray-50 rounded-xl flex-col md:flex-row">
                                                <span className="text-sm font-medium text-gray-600">Average Feedback</span>
                                                <div className='flex items-center gap-1'>
                                                    <span className="text-2xl font-black text-amber-600">{data.avgFeedback.toFixed(1)}</span>
                                                    <Star size={14} fill='amber' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    )}
                </Dialog>

                {/* CARD DEI RISULTATI */}

            </div>
        </div>
    );
};

export default BestHost;