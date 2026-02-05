import React, { useState } from 'react';
import { toast } from "sonner";
import { Star, Trophy, User, Mail, ShieldCheck } from 'lucide-react';
import { useHost, type THost } from '../context/host-context';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@base-ui/react';

const TopFiveBestHost = () => {
    const [data, setData] = useState<THost[]>([]);
    const [loading, setLoading] = useState(false);
    const hostData = useHost();

    const handleGetBest = async () => {
        setLoading(true);
        const promise = hostData.fetchTopFiveBestHost();

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
            <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm text-sm">

                {/* CARD DEI RISULTATI */}
                <Dialog>
                    <DialogTrigger render={
                        <Button onClick={handleGetBest}
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg font-medium transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-200`}
                        >
                            <Trophy size={18} />
                            {loading ? "Calculating..." : "Get Best Host"}
                        </Button>}>
                    </DialogTrigger>
                    {data.length > 0 && (
                        <DialogContent className={"grid grid-cols-3 min-w-5xl "}>
                            {data.map((host) => (
                                <div
                                    key={host.idHost}
                                    className="animate-in fade-in slide-in-from-top-4 duration-500 bg-white border-2 border-indigo-100 rounded-2xl overflow-hidden shadow-xl text-sm h-50 flex flex-col  justify-center"
                                >
                                    <div className="bg-indigo-600 p-4 flex justify-between items-center">
                                        <span className="text-white text-xs font-bold uppercase tracking-wider">
                                            SuperHost
                                        </span>
                                        <div className="flex text-yellow-300">
                                            <Star size={14} fill="currentColor" />
                                        </div>
                                    </div>

                                    <div className="p-6 text-center">
                                        <h4 className="text-xl font-bold text-gray-900">
                                            {host.hostName} {host.surname}
                                        </h4>

                                        <p className="text-sm text-gray-600 mt-2">
                                            {host.email}
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

export default TopFiveBestHost;