import { Trophy, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type THost, useHost } from "../context/host-context";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@base-ui/react';

const SuperHost = () => {
    const [data, setData] = useState<THost[]>([]);
    const [loading, setLoading] = useState(false);
    const hostData = useHost();

    const handleGetAllSuperHosts = async () => {
        setLoading(true);
        const promise = hostData.fetchSuperHost();

        toast.promise(promise, {
            loading: 'Getting all SuperHosts...',
            success: (hosts) => {
                console.log(hosts);
                setData(hosts);
                setLoading(false);
                return `All SuperHosts Found!`;
            },
            error: () => {
                setLoading(false);
                return 'Error Getting SuperHosts';
            },
        });
    };

    return (
        <div className='flex flex-col items-center gap-2 wrap-anywhere'>
            <p className='font-bold text-black text-xl'>SuperHosts</p>

            <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">

                {/* CARDS */}
                <Dialog>
                    <DialogTrigger render={
                        <Button onClick={handleGetAllSuperHosts}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-200"
                        >
                            <Trophy size={18} />
                            {loading ? "Calculating..." : "Get All SuperHosts"}
                        </Button>
                    }>
                    </DialogTrigger>

                    {data.length > 0 && (
                        <DialogContent>
                                {data.map((host) => (
                                    <div
                                        key={host.idHost}
                                        className="animate-in fade-in slide-in-from-top-4 duration-500 bg-white border-2 border-indigo-100 rounded-2xl overflow-hidden shadow-xl"
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

                                            <span className="block mt-2 font-medium text-yellow-600">
                                                ⭐ SuperHost
                                            </span>
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

export default SuperHost;
