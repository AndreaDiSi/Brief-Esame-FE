import { createContext, useContext, useEffect, useState } from "react";

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
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            const newHostResponse: THost = await res.json();
            setData(prev => [newHostResponse, ...prev]);
        } catch (error) {
            console.error("Error adding host:", error);
        }
    }

    const deleteHost = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/hosts/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            setData(prev => prev.filter(item => item.idHost !== id));
        } catch (error) {
            console.error("Error deleting host:", error);
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
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            const updatedResponse: THost = await res.json();
            setData(prev => prev.map(item =>
                item.idHost === id ? updatedResponse : item
            ));
        } catch (error) {
            console.error("Error updating host:", error);
        }
    }
    const fetchBestHost = async () => {
        const res = await fetch(`${API_URL}/hosts/best`);
        if (!res.ok) throw new Error("Errore nel recupero del miglior Host");
        return res.json();
    };

    const fetchTopFiveBestHost = async () => {
        const res = await fetch(`${API_URL}/hosts/topfivehosts`);
        if (!res.ok) throw new Error("Errore nel recupero dei migliori 5 Host");
        return res.json();
    };

    const fetchSuperHost = async () => {
        const res = await fetch(`${API_URL}/hosts/superhosts`);
        if (!res.ok) throw new Error("Errore nel recupero dei Superhost");
        return res.json();
    };

    return (
        <HostContext.Provider value={{ data, addHost, deleteHost, updateHost, fetchBestHost, fetchSuperHost, fetchTopFiveBestHost }}>
            {children}
        </HostContext.Provider>
    );
};

export default HostContext;