import { createContext, useContext, useEffect, useState } from "react";
import type { THost } from "./host-context";
import { toast } from "sonner";
import type { TAccomodationWithNReservations } from "../accomodation/best-accomodation";

export type TAccomodation = {
    idAccomodation: number;
    accomodationName: string;
    nrooms: number;
    Host?: THost;
    hostId: number;
    nbedPlaces: number;
    floor: number;
    startDate: string;
    endDate: string;
    price: number;
    accomodationAddress: string;
}

export type TNewAccomodation = Omit<TAccomodation, "idAccomodation">;

interface AccomodationProviderProps {
    children: React.ReactNode;
}

export interface AccomodationContextType {
    accomodationData: TAccomodation[];
    addAccomodation: (newAccomodation: TNewAccomodation) => Promise<void>;
    deleteAccomodation: (id: number) => Promise<void>;
    updateAccomodation: (id: number, updated: TNewAccomodation) => Promise<void>;
    fetchBestAccomodation: () => Promise<TAccomodationWithNReservations>;
}

const API_URL = import.meta.env.VITE_API_URL;

const AccomodationContext = createContext<AccomodationContextType | null>(null);

export const useAccomodation = () => {
    const context = useContext(AccomodationContext);
    if (!context)
        throw new Error("useAccomodation must be used within an AccomodationProvider");
    return context;
}

export const AccomodationProvider = ({ children }: AccomodationProviderProps) => {
    const [accomodationData, setData] = useState<TAccomodation[]>([]);

    useEffect(() => {
        const fetchAccomodations = async () => {
            try {
                const res = await fetch(`${API_URL}/accomodations`);
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                const json: TAccomodation[] = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching accomodations:", error);
                toast.error("Failed to load accomodations");
            }
        }
        fetchAccomodations();
    }, []);

    const addAccomodation = async (newAccomodation: TNewAccomodation) => {
        try {
            const res = await fetch(`${API_URL}/accomodations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAccomodation),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }

            const newAccomodationResponse: TAccomodation = await res.json();
            setData(prev => [newAccomodationResponse, ...prev]);
            toast.success("Accomodation added successfully!");
        } catch (error) {
            console.error("Error adding accomodation:", error);
            toast.error(error instanceof Error ? error.message : "Failed to add accomodation");
            throw error;
        }
    }

    const deleteAccomodation = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/accomodations/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }

            setData(prev => prev.filter(item => item.idAccomodation !== id));
            toast.success("Accomodation deleted successfully!");
        } catch (error) {
            console.error("Error deleting accomodation:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete accomodation");
            throw error;
        }
    };

    const updateAccomodation = async (id: number, updated: TNewAccomodation) => {
        try {
            const res = await fetch(`${API_URL}/accomodations/${id}`, {
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
            
            const updatedResponse: TAccomodation = await res.json();
            setData(prev => prev.map(item =>
                item.idAccomodation === id ? updatedResponse : item
            ));
            toast.success("Accomodation updated successfully!");
        } catch (error) {
            console.error("Error updating accomodation:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update accomodation");
            throw error;
        }
    }

    const fetchBestAccomodation = async () => {
        try {
            const res = await fetch(`${API_URL}/bestAccomodations`);
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to fetch best accomodation");
            }

            const best: TAccomodationWithNReservations = await res.json();
            return best;
        } catch (error) {
            console.error("Error fetching best accomodation:", error);
            toast.error(error instanceof Error ? error.message : "Failed to fetch best accomodation");
            throw error;
        }
    };

    return (
        <AccomodationContext.Provider value={{ accomodationData, addAccomodation, deleteAccomodation, updateAccomodation, fetchBestAccomodation }}>
            {children}
        </AccomodationContext.Provider>
    );
};

export default AccomodationContext;