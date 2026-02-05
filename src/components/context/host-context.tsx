import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export type THost = {
    idHost: number;
    hostName: string;
    surname: string;
    email: string;
    hostAddress: string;
    superhost: boolean;
}

export type TNewHost = Omit<THost, "idHost">;


interface HostProviderProps {
    children: React.ReactNode;
}

export interface HostContextType {
    data: THost[];
    addHost: (newHost: TNewHost) => Promise<void>;
    deleteHost: (id: number) => Promise<void>;
    updateHost: (id: number, updated: TNewHost) => Promise<void>;
    fetchBestHost: () => Promise<THostWithNReservations>
    fetchSuperHost: () => Promise<THost[]>;
    fetchTopFiveBestHost: () => Promise<THost[]>;
}

const API_URL = import.meta.env.VITE_API_URL;

export type THostWithNReservations = THost & {
    nfeedback: number;
    avgFeedback: number;
};

const HostContext = createContext<HostContextType | null>(null);

export const useHost = () => {
    const context = useContext(HostContext);
    if (!context)
        throw new Error("useHost must be used within a HostProvider");
    return context;
}

export const HostProvider = ({ children }: HostProviderProps) => {
    const [data, setData] = useState<THost[]>([]);

    useEffect(() => {
        const fetchHosts = async () => {
            try {
                const res = await fetch(`${API_URL}/hosts`);
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                const json: THost[] = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching hosts:", error);
                toast.error("Failed to load hosts");
            }
        }
        fetchHosts();
    }, []);

    const addHost = async (newHost: TNewHost) => {
        try {
            const res = await fetch(`${API_URL}/hosts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newHost),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }
            
            const newHostResponse: THost = await res.json();
            setData(prev => [newHostResponse, ...prev]);
            toast.success("Host added successfully!");
        } catch (error) {
            console.error("Error adding host:", error);
            toast.error(error instanceof Error ? error.message : "Failed to add host");
            throw error;
        }
    }

    const deleteHost = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/hosts/${id}`, {
                method: "DELETE",
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }
            
            setData(prev => prev.filter(item => item.idHost !== id));
            toast.success("Host deleted successfully!");
        } catch (error) {
            console.error("Error deleting host:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete host");
            throw error;
        }
    }

    const updateHost = async (id: number, updated: TNewHost) => {
        try {
            const res = await fetch(`${API_URL}/hosts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updated),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }
            
            const updatedResponse: THost = await res.json();
            setData(prev => prev.map(item =>
                item.idHost === id ? updatedResponse : item
            ));
            toast.success("Host updated successfully!");
        } catch (error) {
            console.error("Error updating host:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update host");
            throw error;
        }
    }

    const fetchBestHost = async () => {
        try {
            const res = await fetch(`${API_URL}/hosts/best`);
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to fetch best host");
            }
            
            return res.json();
        } catch (error) {
            console.error("Error fetching best host:", error);
            toast.error(error instanceof Error ? error.message : "Failed to fetch best host");
            throw error;
        }
    };

    const fetchTopFiveBestHost = async () => {
        try {
            const res = await fetch(`${API_URL}/hosts/topfivehosts`);
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to fetch top five hosts");
            }
            
            return res.json();
        } catch (error) {
            console.error("Error fetching top five hosts:", error);
            toast.error(error instanceof Error ? error.message : "Failed to fetch top five hosts");
            throw error;
        }
    };

    const fetchSuperHost = async () => {
        try {
            const res = await fetch(`${API_URL}/hosts/superhosts`);
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to fetch superhosts");
            }
            
            return res.json();
        } catch (error) {
            console.error("Error fetching superhosts:", error);
            toast.error(error instanceof Error ? error.message : "Failed to fetch superhosts");
            throw error;
        }
    };

    return (
        <HostContext.Provider value={{ data, addHost, deleteHost, updateHost, fetchBestHost, fetchSuperHost, fetchTopFiveBestHost }}>
            {children}
        </HostContext.Provider>
    );
};

export default HostContext;